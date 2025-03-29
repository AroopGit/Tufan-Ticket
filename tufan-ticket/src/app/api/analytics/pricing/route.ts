// src/app/api/analytics/pricing/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Parse query parameters
  const eventId = searchParams.get('event_id');
  const currentPrice = searchParams.get('current_price') 
    ? parseFloat(searchParams.get('current_price')!) 
    : undefined;
  
  // Validate required parameters
  if (!eventId) {
    return NextResponse.json(
      { error: 'Event ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';
    let apiUrl = `${mlServiceUrl}/api/analytics/pricing-optimization?event_id=${eventId}`;
    
    if (currentPrice !== undefined) {
      apiUrl += `&current_price=${currentPrice}`;
    }
    
    console.log(`Fetching price optimization from ML service: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ML service error (${response.status}): ${errorText}`);
      return NextResponse.json(
        { error: `Failed to optimize pricing: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Pricing optimization API error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize pricing' },
      { status: 500 }
    );
  }
}
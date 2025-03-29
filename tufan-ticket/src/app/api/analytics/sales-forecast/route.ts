// src/app/api/analytics/sales-forecast/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Parse query parameters
  const eventId = searchParams.get('event_id');
  const daysAhead = parseInt(searchParams.get('days_ahead') || '30');
  
  // Validate required parameters
  if (!eventId) {
    return NextResponse.json(
      { error: 'Event ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';
    const apiUrl = `${mlServiceUrl}/api/analytics/sales-forecast?event_id=${eventId}&days_ahead=${daysAhead}`;
    
    console.log(`Fetching sales forecast from ML service: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ML service error (${response.status}): ${errorText}`);
      return NextResponse.json(
        { error: `Failed to fetch sales forecast: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Sales forecast API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales forecast from ML service' },
      { status: 500 }
    );
  }
}
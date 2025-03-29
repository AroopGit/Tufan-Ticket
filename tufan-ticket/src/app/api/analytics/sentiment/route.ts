// src/app/api/analytics/sentiment/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body || !body.text) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      );
    }
    
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';
    const apiUrl = `${mlServiceUrl}/api/analytics/sentiment`;
    
    console.log(`Sending text for sentiment analysis to ML service`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ML service error (${response.status}): ${errorText}`);
      return NextResponse.json(
        { error: `Failed to analyze sentiment: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Sentiment analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    );
  }
}
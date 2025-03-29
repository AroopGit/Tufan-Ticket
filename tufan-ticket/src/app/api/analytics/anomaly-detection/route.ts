// src/app/api/analytics/anomaly-detection/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body || !body.metrics) {
      return NextResponse.json(
        { error: 'Metrics data is required' },
        { status: 400 }
      );
    }
    
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';
    const apiUrl = `${mlServiceUrl}/api/analytics/anomaly-detection`;
    
    console.log(`Sending metrics for anomaly detection to ML service`);
    
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
        { error: `Failed to detect anomalies: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Anomaly detection API error:', error);
    return NextResponse.json(
      { error: 'Failed to detect anomalies' },
      { status: 500 }
    );
  }
}
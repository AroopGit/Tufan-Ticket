import { NextRequest, NextResponse } from 'next/server';

// Types for organizer analytics
interface SalesMetrics {
  totalSales: number;
  ticketsSold: number;
  averageTicketPrice: number;
  revenueTrend: {
    date: string;
    revenue: number;
  }[];
}

interface AudienceMetrics {
  demographics: {
    ageGroups: {
      label: string;
      percentage: number;
    }[];
    gender: {
      label: string;
      percentage: number;
    }[];
    location: {
      city: string;
      count: number;
    }[];
  };
  interests: {
    category: string;
    percentage: number;
  }[];
}

interface EventPerformance {
  eventId: string;
  eventName: string;
  eventDate: string;
  salesPerformance: number; // 0-100 score
  attendeeEngagement: number; // 0-100 score
  priceEfficiency: number; // 0-100 score
  marketingEffectiveness: number; // 0-100 score
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const organizerId = searchParams.get('organizerId');
  const eventId = searchParams.get('eventId');
  const metricType = searchParams.get('type') || 'sales';
  const timeRange = searchParams.get('timeRange') || '30d';
  
  if (!organizerId) {
    return NextResponse.json({ error: 'Organizer ID is required' }, { status: 400 });
  }
  
  // In a real implementation, this would fetch data from your analytics service
  // For this example, we're returning mock data
  
  switch (metricType) {
    case 'sales':
      const salesMetrics = getMockSalesMetrics(organizerId, eventId, timeRange);
      return NextResponse.json({ metrics: salesMetrics });
    
    case 'audience':
      const audienceMetrics = getMockAudienceMetrics(organizerId, eventId);
      return NextResponse.json({ metrics: audienceMetrics });
    
    case 'performance':
      const performanceMetrics = getMockPerformanceMetrics(organizerId, eventId);
      return NextResponse.json({ metrics: performanceMetrics });
    
    default:
      return NextResponse.json({ error: 'Invalid metric type' }, { status: 400 });
  }
}

// Mock functions that would be replaced with actual analytics service calls
function getMockSalesMetrics(organizerId: string, eventId: string | null, timeRange: string): SalesMetrics {
  // Generate mock sales data
  const revenueTrend = [];
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    revenueTrend.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 1000) + 500,
    });
  }
  
  return {
    totalSales: Math.floor(Math.random() * 50000) + 10000,
    ticketsSold: Math.floor(Math.random() * 1000) + 200,
    averageTicketPrice: Math.floor(Math.random() * 50) + 50,
    revenueTrend,
  };
}

function getMockAudienceMetrics(organizerId: string, eventId: string | null): AudienceMetrics {
  return {
    demographics: {
      ageGroups: [
        { label: '18-24', percentage: 35 },
        { label: '25-34', percentage: 40 },
        { label: '35-44', percentage: 15 },
        { label: '45+', percentage: 10 },
      ],
      gender: [
        { label: 'Male', percentage: 48 },
        { label: 'Female', percentage: 50 },
        { label: 'Non-binary', percentage: 2 },
      ],
      location: [
        { city: 'New York', count: 120 },
        { city: 'Los Angeles', count: 85 },
        { city: 'Chicago', count: 65 },
        { city: 'San Francisco', count: 45 },
        { city: 'Other', count: 185 },
      ],
    },
    interests: [
      { category: 'Music', percentage: 75 },
      { category: 'Technology', percentage: 60 },
      { category: 'Food & Drink', percentage: 45 },
      { category: 'Sports', percentage: 30 },
      { category: 'Arts', percentage: 25 },
    ],
  };
}

function getMockPerformanceMetrics(organizerId: string, eventId: string | null): EventPerformance[] {
  if (eventId) {
    // Return performance for a specific event
    return [{
      eventId,
      eventName: 'Sample Event',
      eventDate: '2023-07-15',
      salesPerformance: Math.floor(Math.random() * 40) + 60, // 60-100
      attendeeEngagement: Math.floor(Math.random() * 30) + 70, // 70-100
      priceEfficiency: Math.floor(Math.random() * 50) + 50, // 50-100
      marketingEffectiveness: Math.floor(Math.random() * 40) + 60, // 60-100
    }];
  }
  
  // Return performance for multiple events
  const events = [];
  for (let i = 1; i <= 5; i++) {
    events.push({
      eventId: `event-${i}`,
      eventName: `Event ${i}`,
      eventDate: `2023-0${i + 2}-15`,
      salesPerformance: Math.floor(Math.random() * 40) + 60,
      attendeeEngagement: Math.floor(Math.random() * 30) + 70,
      priceEfficiency: Math.floor(Math.random() * 50) + 50,
      marketingEffectiveness: Math.floor(Math.random() * 40) + 60,
    });
  }
  
  return events;
}
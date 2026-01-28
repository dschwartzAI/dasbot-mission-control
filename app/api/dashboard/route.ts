import { NextResponse } from 'next/server';

const GATEWAY_API_URL = process.env.GATEWAY_API_URL || 'https://quiet-human-discounted-million.trycloudflare.com';
const GATEWAY_API_TOKEN = process.env.GATEWAY_API_TOKEN || 'dasbot-mission-control-2026';

export async function GET() {
  try {
    const response = await fetch(`${GATEWAY_API_URL}/dashboard`, {
      headers: {
        'Authorization': `Bearer ${GATEWAY_API_TOKEN}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Gateway API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from Gateway API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

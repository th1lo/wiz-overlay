import { NextResponse } from 'next/server';

const TARKOV_ITEMS_API = 'https://api.tarkov.dev/graphql';

const ITEMS_QUERY = `
  query {
    items {
      id
      name
      shortName
      basePrice
      avg24hPrice
      iconLink
      wikiLink
      imageLink
      types
      properties {
        name
        value
      }
    }
  }
`;

export async function GET() {
  try {
    const res = await fetch(TARKOV_ITEMS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: ITEMS_QUERY
      })
    });

    if (!res.ok) {
      throw new Error('Failed to fetch items');
    }

    const data = await res.json();
    
    // Filter for valuable items (you can adjust these criteria)
    const valuableItems = data.data.items.filter((item: any) => {
      const avgPrice = item.avg24hPrice || item.basePrice;
      return avgPrice > 100000; // Items worth more than 100k roubles
    });

    // Sort by average price
    valuableItems.sort((a: any, b: any) => {
      const priceA = a.avg24hPrice || a.basePrice;
      const priceB = b.avg24hPrice || b.basePrice;
      return priceB - priceA;
    });

    return NextResponse.json(valuableItems);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
} 
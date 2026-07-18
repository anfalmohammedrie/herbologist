import { NextResponse } from 'next/server';
import { db } from '@/db';
import { varietals } from '@/db/schema';

export async function GET() {
  try {
    const data = await db.select().from(varietals);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch varietals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, compoundBaseline, compoundName, giPrefix, govtMarketRate, allowedVisuals, description } = body;

    if (!name || !compoundBaseline || !giPrefix || !allowedVisuals) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db.insert(varietals).values({
      name,
      compoundBaseline: parseFloat(compoundBaseline),
      compoundName: compoundName || 'Active Compound',
      giPrefix,
      govtMarketRate: govtMarketRate ? parseFloat(govtMarketRate) : 500.0,
      allowedVisuals: JSON.stringify(allowedVisuals),
      description: description || '',
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Create varietal error:', error);
    return NextResponse.json({ error: 'Failed to create varietal' }, { status: 500 });
  }
}

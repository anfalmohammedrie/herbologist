import { NextResponse } from 'next/server';
import { db } from '@/db';
import { listings, varietals } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const varietalIdParam = url.searchParams.get('varietalId');

    let allListings;
    if (varietalIdParam) {
      allListings = await db
        .select({
          id: listings.id,
          sellerName: listings.sellerName,
          sellerType: listings.sellerType,
          contactPhone: listings.contactPhone,
          contactEmail: listings.contactEmail,
          location: listings.location,
          varietalId: listings.varietalId,
          giTag: listings.giTag,
          quantityKg: listings.quantityKg,
          pricePerKg: listings.pricePerKg,
          yqiScore: listings.yqiScore,
          grade: listings.grade,
          coaAttached: listings.coaAttached,
          notes: listings.notes,
          createdAt: listings.createdAt,
          varietalName: varietals.name,
          govtMarketRate: varietals.govtMarketRate,
        })
        .from(listings)
        .leftJoin(varietals, eq(listings.varietalId, varietals.id))
        .where(eq(listings.varietalId, parseInt(varietalIdParam)));
    } else {
      allListings = await db
        .select({
          id: listings.id,
          sellerName: listings.sellerName,
          sellerType: listings.sellerType,
          contactPhone: listings.contactPhone,
          contactEmail: listings.contactEmail,
          location: listings.location,
          varietalId: listings.varietalId,
          giTag: listings.giTag,
          quantityKg: listings.quantityKg,
          pricePerKg: listings.pricePerKg,
          yqiScore: listings.yqiScore,
          grade: listings.grade,
          coaAttached: listings.coaAttached,
          notes: listings.notes,
          createdAt: listings.createdAt,
          varietalName: varietals.name,
          govtMarketRate: varietals.govtMarketRate,
        })
        .from(listings)
        .leftJoin(varietals, eq(listings.varietalId, varietals.id));
    }

    return NextResponse.json(allListings);
  } catch (error) {
    console.error('Listings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch seller listings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sellerName,
      sellerType,
      contactPhone,
      contactEmail,
      location,
      varietalId,
      giTag,
      quantityKg,
      pricePerKg,
      yqiScore,
      grade,
      coaAttached,
      notes,
    } = body;

    if (!sellerName || !contactPhone || !contactEmail || !location || !varietalId || !giTag || !quantityKg || !pricePerKg) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newListing = await db.insert(listings).values({
      sellerName,
      sellerType: sellerType || 'Farmer Co-operative',
      contactPhone,
      contactEmail,
      location,
      varietalId: parseInt(varietalId),
      giTag,
      quantityKg: parseFloat(quantityKg),
      pricePerKg: parseFloat(pricePerKg),
      yqiScore: yqiScore ? parseFloat(yqiScore) : 85.0,
      grade: grade || 'VERIFIED PREMIUM GRADE A',
      coaAttached: coaAttached !== undefined ? !!coaAttached : true,
      notes: notes || '',
    }).returning();

    return NextResponse.json(newListing[0], { status: 201 });
  } catch (error) {
    console.error('Listings POST error:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}

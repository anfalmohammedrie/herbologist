import { NextResponse } from 'next/server';
import { db } from '@/db';
import { audits, varietals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const auditId = parseInt(id);

    if (isNaN(auditId)) {
      return NextResponse.json({ error: 'Invalid audit ID' }, { status: 400 });
    }

    const result = await db
      .select({
        id: audits.id,
        varietalId: audits.varietalId,
        inputActiveValue: audits.inputActiveValue,
        coaAttached: audits.coaAttached,
        giTag: audits.giTag,
        visualObservation: audits.visualObservation,
        cultivationConditions: audits.cultivationConditions,
        handlingJourney: audits.handlingJourney,
        harvestDate: audits.harvestDate,
        yqiScore: audits.yqiScore,
        status: audits.status,
        llmReasoning: audits.llmReasoning,
        govtRate: audits.govtRate,
        estimatedPricePerKg: audits.estimatedPricePerKg,
        isSpeculated: audits.isSpeculated,
        sealCode: audits.sealCode,
        createdAt: audits.createdAt,
        varietalName: varietals.name,
        compoundName: varietals.compoundName,
        compoundBaseline: varietals.compoundBaseline,
        giPrefix: varietals.giPrefix,
        description: varietals.description,
      })
      .from(audits)
      .leftJoin(varietals, eq(audits.varietalId, varietals.id))
      .where(eq(audits.id, auditId));

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Audit record not found' }, { status: 404 });
    }

    const item = result[0];
    // If COA is missing/unverified, enforce sealCode to null
    if (!item.coaAttached) {
      item.sealCode = null;
    } else if (!item.sealCode) {
      // If sealCode was created before column addition and COA was attached, generate deterministic unique hash
      const hash = crypto.createHash('sha256').update(`AUDIT-${item.id}-${item.createdAt?.toISOString() || '2026'}`).digest('hex').substring(0, 8).toUpperCase();
      item.sealCode = `KER-SEAL-2026-${hash.substring(0, 4)}-${hash.substring(4)}`;
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Verify API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve provenance record' }, { status: 500 });
  }
}

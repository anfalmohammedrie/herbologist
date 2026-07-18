import { NextResponse } from 'next/server';
import { db } from '@/db';
import { varietals, listings, audits } from '@/db/schema';

export async function GET() {
  try {
    const existing = await db.select().from(varietals);
    if (existing.length >= 6) {
      return NextResponse.json({ message: 'Database already populated with full Kerala baseline dataset.' });
    }

    // Wipe tables in correct dependency order
    await db.delete(audits);
    await db.delete(listings);
    await db.delete(varietals);

    const initialVarietals = [
      {
        name: 'Wayanad Black Pepper',
        compoundBaseline: 4.0,
        compoundName: 'Piperine',
        giPrefix: 'GI-IND-KER',
        govtMarketRate: 680.0, // ₹680 / kg
        allowedVisuals: JSON.stringify([
          'Deep dark black, highly wrinkled, dense surface geometry',
          'Dark brown, moderate wrinkling, uniform size profile',
          'Light brown, smooth surface, low wrinkling (Substandard)'
        ]),
        description: 'Renowned globally for its high volatile oil and piperine content cultivated in the high altitude soils of Wayanad.'
      },
      {
        name: 'Alleppey Turmeric',
        compoundBaseline: 5.0,
        compoundName: 'Curcumin',
        giPrefix: 'GI-IND-KER',
        govtMarketRate: 220.0, // ₹220 / kg
        allowedVisuals: JSON.stringify([
          'Vibrant deep orange-yellow, high density, hard break fracture',
          'Bright metallic yellow, uniform color distribution, dry core',
          'Dull pale yellow, soft spongy texture profile (Substandard)'
        ]),
        description: 'Celebrated for its intense deep orange-yellow tone and exceptionally high curcumin content used in premium extracts.'
      },
      {
        name: 'Alleppey Green Cardamom',
        compoundBaseline: 7.5,
        compoundName: 'Cineole & Terpinyl Acetate',
        giPrefix: 'GI-IND-KER',
        govtMarketRate: 2850.0, // ₹2,850 / kg
        allowedVisuals: JSON.stringify([
          'Plump extra-bold 8mm+ green pods, uniform emerald skin, intact seeds',
          'Medium 7mm light green pods, slight color variance, crisp aroma',
          'Pale yellowed faded pods, split husk, low aromatic density (Substandard)'
        ]),
        description: 'Grade 1 Extra Bold Green Cardamom from Western Ghats cardamom hill reserves with unexcelled aromatic oil profile.'
      },
      {
        name: 'Malabar Nutmeg & Mace',
        compoundBaseline: 8.0,
        compoundName: 'Myristicin & Volatile Essential Oils',
        giPrefix: 'GI-IND-KER',
        govtMarketRate: 980.0, // ₹980 / kg
        allowedVisuals: JSON.stringify([
          'Heavy oval brown seed, deep net-like fissures, crimson intact mace aril',
          'Light brown uniform oval seed, brittle mace fragmenting',
          'Hollow lightweight shell, pale insect-bored surface, moldy core (Substandard)'
        ]),
        description: 'Sourced from high-humidity riverine belts of central Kerala producing rich pharmaceutical essential oils.'
      },
      {
        name: 'Malabar True Cinnamon',
        compoundBaseline: 2.2,
        compoundName: 'Cinnamaldehyde',
        giPrefix: 'GI-IND-KER',
        govtMarketRate: 1150.0, // ₹1,150 / kg
        allowedVisuals: JSON.stringify([
          'Multi-layered paper-thin quill rolls, warm tan brown, highly sweet aromatic aroma',
          'Single thick bark slice, medium reddish brown, moderate bite',
          'Coarse thick rugged bark, dark grayish exterior, bitter wood note (Substandard)'
        ]),
        description: 'True Ceylon/Malabar variety cinnamon grown in pristine agro-forestry systems in Idukki and Malabar.'
      },
      {
        name: 'Kerala Golden Clove',
        compoundBaseline: 16.0,
        compoundName: 'Eugenol Content',
        giPrefix: 'GI-IND-KER',
        govtMarketRate: 1050.0, // ₹1,050 / kg
        allowedVisuals: JSON.stringify([
          'Plump intact crown head, deep reddish-brown stem, high oil exuding texture',
          'Slightly headless brown stems, dry crisp shell, medium aroma',
          'Faded pale gray stems, missing heads, high proportion of mother cloves (Substandard)'
        ]),
        description: 'Hand-picked high-oil cloves harvested along coastal hilly gradients of Travancore.'
      }
    ];

    const insertedVarietals = await db.insert(varietals).values(initialVarietals).returning();

    // Map inserted varietals to create initial verified seller listings
    const pepper = insertedVarietals.find(v => v.name.includes('Pepper'));
    const turmeric = insertedVarietals.find(v => v.name.includes('Turmeric'));
    const cardamom = insertedVarietals.find(v => v.name.includes('Cardamom'));
    const nutmeg = insertedVarietals.find(v => v.name.includes('Nutmeg'));
    const cinnamon = insertedVarietals.find(v => v.name.includes('Cinnamon'));
    const clove = insertedVarietals.find(v => v.name.includes('Clove'));

    const initialListings = [
      {
        sellerName: 'Wayanad High-Altitude Farmers Co-operative',
        sellerType: 'Certified Farmer Co-op',
        contactPhone: '+91 94471 82901',
        contactEmail: 'sales@wayanadfarmers.org',
        location: 'Kalpetta, Wayanad, Kerala',
        varietalId: pepper?.id,
        giTag: 'GI-IND-KER-WAY-802',
        quantityKg: 1500,
        pricePerKg: 720.0,
        yqiScore: 92.5,
        grade: 'VERIFIED PREMIUM GRADE A',
        coaAttached: true,
        notes: 'Organically grown, sun-dried Grade A pepper with 4.4% piperine content. Full COA test reports verified.'
      },
      {
        sellerName: 'Idukki Tribal Spice Producer Society',
        sellerType: 'Tribal Agro Producer Society',
        contactPhone: '+91 98952 11044',
        contactEmail: 'idukki.spices@keralagov.in',
        location: 'Kattappana, Idukki, Kerala',
        varietalId: pepper?.id,
        giTag: 'GI-IND-KER-IDK-441',
        quantityKg: 850,
        pricePerKg: 680.0,
        yqiScore: 88.0,
        grade: 'VERIFIED PREMIUM GRADE A',
        coaAttached: true,
        notes: 'Handpicked pepper berries. High oil content, dark dense surface geometry.'
      },
      {
        sellerName: 'Alleppey Spices & Extraction Consortium',
        sellerType: 'GI Certified Exporter',
        contactPhone: '+91 94002 77112',
        contactEmail: 'orders@alleppeyspices.com',
        location: 'Alappuzha, Kerala',
        varietalId: turmeric?.id,
        giTag: 'GI-IND-KER-ALP-109',
        quantityKg: 3000,
        pricePerKg: 235.0,
        yqiScore: 94.0,
        grade: 'VERIFIED PREMIUM GRADE A',
        coaAttached: true,
        notes: 'Extra high curcumin batch tested at 5.6%. Vibrant deep orange-yellow cores.'
      },
      {
        sellerName: 'Central Kerala Agricultural Co-op',
        sellerType: 'Agricultural Primary Co-op',
        contactPhone: '+91 94460 33811',
        contactEmail: 'info@keralaspicecoop.org',
        location: 'Thrissur, Kerala',
        varietalId: turmeric?.id,
        giTag: 'GI-IND-KER-TCR-552',
        quantityKg: 2200,
        pricePerKg: 210.0,
        yqiScore: 78.5,
        grade: 'STANDARD GRADE B',
        coaAttached: true,
        notes: 'Bright yellow turmeric fingers, ideal for general spice blending and medicinal processing.'
      },
      {
        sellerName: 'Western Ghats Cardamom Estates Guild',
        sellerType: 'Planters Association',
        contactPhone: '+91 94473 99820',
        contactEmail: 'planters@idukkicardamom.in',
        location: 'Vandiperiyar, Idukki, Kerala',
        varietalId: cardamom?.id,
        giTag: 'GI-IND-KER-CD-991',
        quantityKg: 600,
        pricePerKg: 3100.0,
        yqiScore: 96.2,
        grade: 'VERIFIED PREMIUM GRADE A',
        coaAttached: true,
        notes: 'Super Extra Bold 8mm+ pods. Unmatched aromatic volatility and brilliant emerald pods.'
      },
      {
        sellerName: 'Malabar Bio-Flora Spice Producers',
        sellerType: 'Bio Certified Collective',
        contactPhone: '+91 98470 61230',
        contactEmail: 'contact@malabarspices.co.in',
        location: 'Angamaly, Ernakulam, Kerala',
        varietalId: nutmeg?.id,
        giTag: 'GI-IND-KER-NTM-304',
        quantityKg: 900,
        pricePerKg: 1020.0,
        yqiScore: 91.0,
        grade: 'VERIFIED PREMIUM GRADE A',
        coaAttached: true,
        notes: 'Whole nut with bright crimson mace aril intact. Moisture content < 8%.'
      },
      {
        sellerName: 'Travancore Heritage Cinnamon Farms',
        sellerType: 'GI Certified Estate',
        contactPhone: '+91 94470 12099',
        contactEmail: 'trade@travancorespices.com',
        location: 'Punalur, Kollam, Kerala',
        varietalId: cinnamon?.id,
        giTag: 'GI-IND-KER-CIN-711',
        quantityKg: 400,
        pricePerKg: 1220.0,
        yqiScore: 89.5,
        grade: 'VERIFIED PREMIUM GRADE A',
        coaAttached: true,
        notes: 'C4/C5 grade thin quill cinnamon. Pure sweet fragrant cinnamaldehyde note.'
      },
      {
        sellerName: 'High Range Golden Clove Planters',
        sellerType: 'Farmer Co-operative',
        contactPhone: '+91 94478 88200',
        contactEmail: 'cloves@highrangespices.in',
        location: 'Kottayam, Kerala',
        varietalId: clove?.id,
        giTag: 'GI-IND-KER-CLV-503',
        quantityKg: 750,
        pricePerKg: 1100.0,
        yqiScore: 93.0,
        grade: 'VERIFIED PREMIUM GRADE A',
        coaAttached: true,
        notes: 'Full crown hand-harvested golden brown cloves. Tested 17.2% eugenol concentration.'
      }
    ];

    await db.insert(listings).values(initialListings as any);

    return NextResponse.json({ 
      message: 'Database successfully seeded with complete Kerala Govt botanical dataset & verified seller listings!',
      varietalsCount: insertedVarietals.length,
      listingsCount: initialListings.length
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed: ' + String(error) }, { status: 500 });
  }
}

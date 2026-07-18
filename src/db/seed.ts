import { db } from '../db';
import { varietals } from './schema';

async function seed() {
  console.log('Seeding database...');
  
  const initialVarietals = [
    {
      name: 'Wayanad Black Pepper',
      compoundBaseline: 4.0,
      giPrefix: 'GI-IND-KER',
      allowedVisuals: JSON.stringify([
        'Deep dark black, highly wrinkled, dense surface geometry',
        'Dark brown, moderate wrinkling, uniform size profile',
        'Light brown, smooth surface, low wrinkling (Substandard)'
      ]),
    },
    {
      name: 'Alleppey Turmeric',
      compoundBaseline: 5.0,
      giPrefix: 'GI-IND-KER',
      allowedVisuals: JSON.stringify([
        'Vibrant deep orange-yellow, high density, hard break fracture',
        'Bright metallic yellow, uniform color distribution, dry core',
        'Dull pale yellow, soft spongy texture profile (Substandard)'
      ]),
    },
  ];

  for (const v of initialVarietals) {
    await db.insert(varietals).values(v);
  }
  
  console.log('Seeding complete!');
}

seed().catch(console.error);

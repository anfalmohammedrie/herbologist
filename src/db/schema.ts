import { pgTable, serial, text, real, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const varietals = pgTable('varietals', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  compoundBaseline: real('compound_baseline').notNull(),
  compoundName: text('compound_name').notNull().default('Active Compound'),
  giPrefix: text('gi_prefix').notNull(),
  govtMarketRate: real('govt_market_rate').notNull().default(500.0), // Baseline ₹/kg Kerala Govt Rate
  allowedVisuals: text('allowed_visuals').notNull(), // Stored as JSON string
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const audits = pgTable('audits', {
  id: serial('id').primaryKey(),
  varietalId: integer('varietal_id').references(() => varietals.id),
  inputActiveValue: real('input_active_value').notNull(),
  coaAttached: boolean('coa_attached').notNull(),
  giTag: text('gi_tag').notNull(),
  visualObservation: text('visual_observation').notNull(),
  cultivationConditions: text('cultivation_conditions').notNull().default('Organic Rainfed Agroforestry'),
  handlingJourney: text('handling_journey').notNull().default('Hand-picked -> Traditional Sun-drying -> Micro-batch Sealed'),
  harvestDate: text('harvest_date').notNull().default('2026-01-15'),
  yqiScore: real('yqi_score').notNull(),
  status: text('status').notNull(),
  llmReasoning: text('llm_reasoning'),
  govtRate: real('govt_rate').notNull().default(0),
  estimatedPricePerKg: real('estimated_price_per_kg').notNull().default(0),
  isSpeculated: boolean('is_speculated').notNull().default(false),
  sealCode: text('seal_code'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const listings = pgTable('listings', {
  id: serial('id').primaryKey(),
  sellerName: text('seller_name').notNull(),
  sellerType: text('seller_type').notNull().default('Farmer Co-operative'),
  contactPhone: text('contact_phone').notNull(),
  contactEmail: text('contact_email').notNull(),
  location: text('location').notNull(),
  varietalId: integer('varietal_id').references(() => varietals.id),
  giTag: text('gi_tag').notNull(),
  quantityKg: real('quantity_kg').notNull(),
  pricePerKg: real('price_per_kg').notNull(),
  yqiScore: real('yqi_score').notNull().default(85.0),
  grade: text('grade').notNull().default('VERIFIED PREMIUM GRADE A'),
  coaAttached: boolean('coa_attached').notNull().default(true),
  cultivationConditions: text('cultivation_conditions').notNull().default('High Altitude Forest Agro-ecology'),
  handlingJourney: text('handling_journey').notNull().default('Hand-picked -> Solar Drying -> Nitrogen Flush Sealed'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

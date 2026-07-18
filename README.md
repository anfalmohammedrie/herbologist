PROJECT NAME : AI HERBOLOGIST 

PROBLEM STATEMENT: Supply Chain Traceability for Indigenous
Spices & Herbs
Farmers cultivating high-value indigenous spices and Ayurvedic herbs with
recognised geographical and botanical significance lack a reliable mechanism
to establish and communicate the verified origin, cultivation conditions, and
handling journey of their produce to buyers and end consumers. This makes it
difficult to distinguish authentic, ethically sourced products from substitutes or
adulterated alternatives, preventing farmers from receiving the premium value
their produce rightfully deserves.

PROBLEM DESCRIPTION:
### System Overview
The platform is an integrated digital ecosystem that generates a secure Digital Passport for agricultural produce. By combining botanical data, geographical verification, and a public audit trail, the framework eliminates supply chain fraud and establishes clear transparency between farmers and consumers.
### Verification Pipeline
1. **Digital Registration:** Farmers log the crop's exact botanical varietal, geographical origin, and cultivation methods.
2. **AI Specification Detection:** Automated models analyze physical and chemical characteristics against established regional baselines to ensure authenticity.
3. **Immutable Audit Trail:** Every lifecycle touchpoint—from harvest to final distribution—is logged to enforce an unalterable chain of custody.
4. **Instant Consumer Verification:** End-users query a public verification endpoint (`/verify/[id]`) to access the complete batch history and origin in real time.
### Core Value Proposition
* **Elimination of Information Asymmetry:** Replaces blind label trust with objective, data-backed evidence of origin and quality.
* **Premium Value Capture:** Generates a verifiable Certificate of Authenticity, enabling farmers to command premium pricing and increase revenue.
* **Market Transparency:** Provides a centralized view of live marketplace data to protect producers from predatory pricing models.

Google AI Usage:
TOOLS USED:
 - GEMMA-4-31B CLOUD
 - VSCODE
 - ANTIGRAVITY

### Technical Architecture
* **Core Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS
* **Data Layer:** PostgreSQL with Drizzle ORM (Type-safe)
* **AI Core:** Google Gemma 4, GLM 5.1
### Google AI Ingestion Pipelines
* **Botanical Verification (`/api/detect-specifications`):** Multimodal visual analysis of crop morphology to verify regional authenticity against database standards.
* **Compliance Auditing (`/api/audit`):** Algorithmic anomaly detection across supply chain logs to identify transport and documentation fraud.
* **Market Intelligence (`/api/spices-board-prices`):** Automated parsing of live commodities data to deliver realtime fair value pricing insights.
### Strategic Impact
| Metric | Legacy Workflow | Gemini-Powered Pipeline |
| --- | --- | --- |
| **Verification** | Manual, subjective, and slow | Instant morphological analysis |
| **Trust Model** | Vulnerable middleman inspection | Automated Digital Passports |
| **Fraud Prevention** | Opaque logistics trails | Algorithmic anomaly flags |
| **Price Protection** | Asymmetrical, buyer-driven rates | Real-time market value alignment |


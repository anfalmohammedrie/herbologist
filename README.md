# AI Herbology Web Application

## Problem Statement
The spice and herb trade often suffers from a lack of standardized, transparent quality verification. Farmers and traders struggle to prove the premium quality of their produce, while buyers face uncertainty regarding the actual chemical and visual specifications of the herbs they purchase. There is a need for an automated, AI-driven system that can audit botanical samples and provide a verified quality score based on visual and chemical data.

## Project Description
AI Herbology is a comprehensive web application designed to standardize the auditing and listing of high-value botanical varietals (like Turmeric, Cardamom, Nutmeg, etc.). 

The system works by:
1. **Varietal Management**: Allowing administrators to define botanical varietals with specific chemical baselines and visual specifications.
2. **AI-Powered Auditing**: Using Computer Vision (via Google AI/Gemma) to analyze images of botanical samples, matching them against predefined visual specifications to determine quality.
3. **Quality Scoring (YQI)**: Calculating a Yield Quality Index (YQI) based on the AI's visual analysis and chemical input values.
4. **Verified Marketplace**: Creating a marketplace where only verified, audited listings can be posted, ensuring buyers get the grade of product they pay for.

---

## Google AI Usage

### Tools / Models Used
- **Gemma 4**: Used for botanical computer vision analysis and reasoning.
- **Ollama**: Used as the local inference engine to serve the Gemma 4 model.

## Tech Stack used
- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Gemma 4 (via Ollama)
- **Language**: TypeScript

### How Google AI Was Used
Google AI (Gemma 4) is integrated into the `detect-specifications` API route. When a user uploads an image of a botanical sample, the application sends the image and a set of candidate visual specifications to the Gemma 4 model. The model performs a visual analysis of the sample's surface geometry, pigmentation, and fracture profile, then returns a JSON response identifying the best-matching specification and the reasoning behind its decision. This AI-driven detection is critical for automating the quality audit process without requiring a human botanical expert for every sample.

---

### GitHub repo link of the project
[Link of the github repository](https://github.com/anfalmohammedrie/herbologist.git)

## Proof of Google AI Usage
Include it in the `/proofs` folder.

## Screenshots
Add project screenshots in `/screenshots` folder.

---

## Demo Video
Upload your demo video to Google Drive and paste the shareable link here(max 3 minutes). [Watch Demo](https://example.com/demo-video)

---

## Installation Steps
How to run your project

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anfalmohammedrie/herbologist.git
   cd herbologist
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your PostgreSQL connection string:
   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/herbology
   ```

4. **Database Migration & Seeding**:
   ```bash
   npx drizzle-kit push
   npm run seed # If a seed script is provided
   ```

5. **AI Model Setup**:
   Ensure Ollama is installed and the Gemma 4 model is pulled:
   ```bash
   ollama pull gemma4
   ```

6. **Run the application**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

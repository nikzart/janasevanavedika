# B Ravi Janaseva Vedika

A Progressive Web App (PWA) for Karnataka Guarantee Schemes lead generation. Citizens can learn about government schemes, fill application forms, and submit requests via WhatsApp.

## Features

- **5 Karnataka Guarantee Schemes**: Gruha Lakshmi, Gruha Jyothi, Yuva Nidhi, Shakti, Anna Bhagya
- **Bilingual Support**: English and Kannada
- **Document Upload**: Capture/upload required documents with automatic compression
- **WhatsApp Integration**: Pre-filled messages sent directly to campaign coordinator
- **PWA**: Installable on mobile devices, works offline
- **Supabase Backend**: Lead storage with document management

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v4
- Supabase (PostgreSQL)
- vite-plugin-pwa

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Set your Supabase URL, anon key, and WhatsApp number.

3. Setup database:
   - Run `supabase/schema.sql` in Supabase SQL Editor

4. Start development server:
   ```bash
   npm run dev
   ```

## Build

```bash
npm run build
npm run preview
```

## Database Schema

- `leads` - Application submissions with form data
- `lead_documents` - Uploaded document images (base64)

See `supabase/schema.sql` for complete schema.

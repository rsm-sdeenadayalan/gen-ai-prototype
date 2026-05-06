# Macy's Campaign Command Center

Email-based marketing operations platform powered by GenAI skills. Demo for MGT 449 Group 4.

## Local Development

### Backend
```bash
cp .env.example .env   # fill in TRITONAI_API_KEY and UNSPLASH_ACCESS_KEY
uv sync
uv run uvicorn api.main:app --reload --port 8000
```

### Frontend
```bash
cd gui
echo "NEXT_PUBLIC_API_BASE=http://localhost:8000" > .env.local
npm install
npm run dev
```

Open http://localhost:3000

## Agent Email Addresses

| Address | Skill |
|---|---|
| segment.builder@macys-ai.com | Audience Segment Builder (RFM k-means clustering) |
| dam.finder@macys-ai.com | DAM Asset Finder (filter + rank 5,000 assets) |
| localize@macys-ai.com | Localization Generator (40 regional variants) |
| performance@macys-ai.com | Campaign Performance Analyzer + 14-day Forecast |
| creative@macys-ai.com | Creative Concept Board (Unsplash mood board) |

## Pre-seeded Campaigns

- `MDC-2026-MD-001` — Mother's Day Beauty Event (active, step 4)
- `MDC-2026-MS-002` — Memorial Day Home Sale (planned, step 1)
- `MDC-2026-SS-003` — Spring Style Refresh (completed, step 10)

## Deploy

- **Backend**: Railway — connect GitHub repo, set `TRITONAI_API_KEY` + `UNSPLASH_ACCESS_KEY`
- **Frontend**: Vercel — set Root Directory to `gui`, set `NEXT_PUBLIC_API_BASE` = Railway URL

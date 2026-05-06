from __future__ import annotations
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.db import init_app_db
from api.routes import campaigns, emails

app = FastAPI(title="Campaign Command Center API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_app_db()


@app.get("/health")
def health():
    return {"ok": True}


app.include_router(campaigns.router)
app.include_router(emails.router)

"""Simulated creative asset generation via Unsplash photo search."""
from __future__ import annotations
import os
import httpx

UNSPLASH_BASE = "https://api.unsplash.com"


def search_unsplash(keywords: list[str], count: int = 6) -> dict:
    """Search Unsplash for photos matching keywords. Falls back to picsum if no key."""
    access_key = os.environ.get("UNSPLASH_ACCESS_KEY", "")
    query = " ".join(keywords)

    if not access_key:
        return {
            "query": query,
            "photos": [
                {
                    "id": f"placeholder-{i}",
                    "url": f"https://picsum.photos/seed/{query.replace(' ', '')}{i}/800/600",
                    "thumb": f"https://picsum.photos/seed/{query.replace(' ', '')}{i}/400/300",
                    "alt": f"Concept image {i + 1} — {query}",
                    "photographer": "Stock Photo",
                    "width": 800,
                    "height": 600,
                }
                for i in range(count)
            ],
            "total_results": count,
            "source": "placeholder",
        }

    resp = httpx.get(
        f"{UNSPLASH_BASE}/search/photos",
        headers={"Authorization": f"Client-ID {access_key}"},
        params={"query": query, "per_page": count, "orientation": "landscape"},
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()

    photos = [
        {
            "id": p["id"],
            "url": p["urls"]["regular"],
            "thumb": p["urls"]["thumb"],
            "alt": p.get("alt_description") or query,
            "photographer": p["user"]["name"],
            "width": p["width"],
            "height": p["height"],
        }
        for p in data.get("results", [])
    ]

    return {
        "query": query,
        "photos": photos,
        "total_results": data.get("total", len(photos)),
        "source": "unsplash",
    }

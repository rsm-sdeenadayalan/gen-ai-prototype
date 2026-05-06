from __future__ import annotations
from fastapi import APIRouter, HTTPException
from api.db import list_campaigns, get_thread
from api.models import CampaignOut, ThreadOut, MessageOut

router = APIRouter(prefix="/api/campaigns", tags=["campaigns"])


@router.get("", response_model=list[CampaignOut])
def get_campaigns():
    return list_campaigns()


@router.get("/{code}", response_model=ThreadOut)
def get_campaign_thread(code: str):
    campaign, messages = get_thread(code)
    if campaign is None:
        raise HTTPException(status_code=404, detail=f"Campaign {code} not found")
    return ThreadOut(
        campaign=CampaignOut(**campaign),
        messages=[MessageOut(**m) for m in messages],
    )

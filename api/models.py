from __future__ import annotations
from pydantic import BaseModel


class SendEmailRequest(BaseModel):
    campaign_code: str
    from_persona: str
    to_address: str
    body: str


class MessageOut(BaseModel):
    id: int
    campaign_code: str
    from_persona: str
    to_address: str | None
    body: str
    agent_narrative: str | None
    skill_name: str | None
    skill_result: dict | None
    created_at: str


class CampaignOut(BaseModel):
    code: str
    name: str
    status: str
    workflow_step: int
    created_at: str


class ThreadOut(BaseModel):
    campaign: CampaignOut
    messages: list[MessageOut]

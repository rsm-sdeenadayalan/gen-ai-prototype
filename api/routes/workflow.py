from __future__ import annotations
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from api.db import (
    get_thread, save_agent_reply, save_human_message,
    set_step_state, advance_workflow, build_agent_context,
)
from api.agent import run_agent
from api.models import CampaignOut, MessageOut

router = APIRouter(prefix="/api/campaigns", tags=["workflow"])

AI_STEPS = {2, 4, 5, 7, 9}

STEP_ADDRESSES = {
    2: "segment.builder@macys-ai.com",
    4: "dam.finder@macys-ai.com",
    5: "creative@macys-ai.com",
    7: "localize@macys-ai.com",
    9: "performance@macys-ai.com",
}


class AdvanceRequest(BaseModel):
    note: str = ""


@router.post("/{code}/step/trigger")
def trigger_step(code: str) -> dict:
    campaign, messages = get_thread(code)
    if campaign is None:
        raise HTTPException(404, f"Campaign {code} not found")

    step = campaign["workflow_step"]
    if step not in AI_STEPS:
        raise HTTPException(400, f"Step {step} is not an AI step")
    if campaign.get("step_state") not in ("pending", None):
        raise HTTPException(400, "Step is already running or awaiting approval")

    address = STEP_ADDRESSES[step]
    context = build_agent_context(campaign, messages, step)
    thread_history = [{"from_persona": m["from_persona"], "body": m["body"]} for m in messages]

    try:
        skill_name, narrative, skill_result = run_agent(address, context, thread_history)
    except Exception as exc:
        raise HTTPException(500, str(exc))

    msg_id = save_agent_reply(code, skill_name, narrative, skill_result, advance=False)
    set_step_state(code, "awaiting_approval")

    campaign, messages = get_thread(code)
    agent_msg = next((m for m in messages if m["id"] == msg_id), None)
    return {
        "ok": True,
        "campaign": CampaignOut(**campaign).model_dump(),
        "agent_reply": MessageOut(**agent_msg).model_dump() if agent_msg else None,
    }


@router.post("/{code}/step/approve")
def approve_step(code: str) -> dict:
    campaign, _ = get_thread(code)
    if campaign is None:
        raise HTTPException(404)
    advance_workflow(code)
    campaign, _ = get_thread(code)
    return CampaignOut(**campaign).model_dump()


@router.post("/{code}/step/revise")
def revise_step(code: str) -> dict:
    """Reset current AI step to pending so it can be re-triggered."""
    campaign, _ = get_thread(code)
    if campaign is None:
        raise HTTPException(404)
    set_step_state(code, "pending")
    campaign, _ = get_thread(code)
    return CampaignOut(**campaign).model_dump()


@router.post("/{code}/step/advance")
def advance_human_step(code: str, body: AdvanceRequest) -> dict:
    campaign, _ = get_thread(code)
    if campaign is None:
        raise HTTPException(404)

    step = campaign["workflow_step"]
    if step in AI_STEPS:
        raise HTTPException(400, f"Step {step} is an AI step — use /trigger and /approve")

    if body.note:
        save_human_message(code, "sarah", None, f"[Step {step} complete] {body.note}")

    advance_workflow(code)
    campaign, _ = get_thread(code)
    return CampaignOut(**campaign).model_dump()

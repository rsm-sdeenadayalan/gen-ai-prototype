from __future__ import annotations
from fastapi import APIRouter, HTTPException
from api.models import SendEmailRequest
from api.db import save_human_message, save_agent_reply, get_thread
from api.agent import run_agent

router = APIRouter(prefix="/api/emails", tags=["emails"])

AGENT_ADDRESSES = {
    "segment.builder@macys-ai.com",
    "dam.finder@macys-ai.com",
    "localize@macys-ai.com",
    "performance@macys-ai.com",
    "creative@macys-ai.com",
}


@router.post("/send")
def send_email(req: SendEmailRequest) -> dict:
    save_human_message(req.campaign_code, req.from_persona, req.to_address, req.body)

    if req.to_address not in AGENT_ADDRESSES:
        return {"ok": True, "agent_reply": None}

    _, messages = get_thread(req.campaign_code)
    thread_history = [
        {"from_persona": m["from_persona"], "body": m["body"]}
        for m in messages[:-1]
    ]

    try:
        skill_name, narrative, skill_result = run_agent(
            req.to_address, req.body, thread_history
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    msg_id = save_agent_reply(req.campaign_code, skill_name, narrative, skill_result)

    _, updated_messages = get_thread(req.campaign_code)
    agent_msg = next((m for m in updated_messages if m["id"] == msg_id), None)

    return {"ok": True, "agent_reply": agent_msg}

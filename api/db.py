from __future__ import annotations
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
MACYS_DB = REPO_ROOT / "data" / "macys.db"
APP_DB = REPO_ROOT / "app.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS campaigns (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    workflow_step INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_code TEXT NOT NULL,
    from_persona TEXT NOT NULL,
    to_address TEXT,
    body TEXT NOT NULL,
    agent_narrative TEXT,
    skill_name TEXT,
    skill_result TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (campaign_code) REFERENCES campaigns(code)
);
"""

SEED = [
    ("MDC-2026-MD-001", "Mother's Day Beauty Event", "active", 4),
    ("MDC-2026-MS-002", "Memorial Day Home Sale", "planned", 1),
    ("MDC-2026-SS-003", "Spring Style Refresh", "completed", 10),
]


def get_app_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(str(APP_DB))
    conn.row_factory = sqlite3.Row
    return conn


def get_macys_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(str(MACYS_DB))
    conn.row_factory = sqlite3.Row
    return conn


def init_app_db() -> None:
    with get_app_conn() as conn:
        conn.executescript(SCHEMA)
        now = datetime.now(timezone.utc).isoformat()
        for code, name, status, step in SEED:
            conn.execute(
                "INSERT OR IGNORE INTO campaigns (code, name, status, workflow_step, created_at) VALUES (?,?,?,?,?)",
                (code, name, status, step, now),
            )


def list_campaigns() -> list[dict]:
    with get_app_conn() as conn:
        rows = conn.execute("SELECT * FROM campaigns ORDER BY created_at DESC").fetchall()
    return [dict(r) for r in rows]


def get_thread(code: str) -> tuple[dict | None, list[dict]]:
    with get_app_conn() as conn:
        camp = conn.execute("SELECT * FROM campaigns WHERE code=?", (code,)).fetchone()
        msgs = conn.execute(
            "SELECT * FROM messages WHERE campaign_code=? ORDER BY created_at ASC", (code,)
        ).fetchall()
    if camp is None:
        return None, []
    campaign = dict(camp)
    messages = []
    for m in msgs:
        row = dict(m)
        if row["skill_result"]:
            row["skill_result"] = json.loads(row["skill_result"])
        messages.append(row)
    return campaign, messages


def save_human_message(campaign_code: str, from_persona: str, to_address: str, body: str) -> int:
    now = datetime.now(timezone.utc).isoformat()
    with get_app_conn() as conn:
        cur = conn.execute(
            "INSERT INTO messages (campaign_code, from_persona, to_address, body, created_at) VALUES (?,?,?,?,?)",
            (campaign_code, from_persona, to_address, body, now),
        )
        return cur.lastrowid


def save_agent_reply(campaign_code: str, skill_name: str, narrative: str, skill_result: dict) -> int:
    now = datetime.now(timezone.utc).isoformat()
    with get_app_conn() as conn:
        cur = conn.execute(
            """INSERT INTO messages
               (campaign_code, from_persona, to_address, body, agent_narrative, skill_name, skill_result, created_at)
               VALUES (?,?,?,?,?,?,?,?)""",
            (campaign_code, "agent", None, narrative, narrative, skill_name, json.dumps(skill_result), now),
        )
        msg_id = cur.lastrowid
        conn.execute(
            "UPDATE campaigns SET workflow_step = MIN(workflow_step + 1, 10) WHERE code=?",
            (campaign_code,),
        )
        return msg_id

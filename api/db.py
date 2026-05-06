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
    status TEXT NOT NULL DEFAULT 'planned',
    workflow_step INTEGER NOT NULL DEFAULT 1,
    brief TEXT,
    step_state TEXT NOT NULL DEFAULT 'pending',
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
    ("MDC-2026-MD-001", "Mother's Day Beauty Event", "active", 2),
    ("MDC-2026-MS-002", "Memorial Day Home Sale", "planned", 1),
    ("MDC-2026-SS-003", "Spring Style Refresh", "completed", 10),
]

STEP_PROMPTS = {
    2: "Run audience segmentation analysis. Use RFM k-means clustering to identify VIP, mid-tier, and lapsed customer segments that align with this campaign.",
    4: "Search the DAM library for creative assets — photos, hero images, and banners — that best match this campaign brief and target audience.",
    5: "Generate a creative concept board with visual inspiration and photo ideas that capture the mood and tone of this campaign.",
    7: "Generate localized campaign variants for all US regional markets, including regional pricing and ad placement options.",
    9: "Analyze campaign performance metrics, channel attribution, ROAS by channel, and provide a 14-day revenue forecast.",
}


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
        for col, default in [("brief", "NULL"), ("step_state", "'pending'")]:
            try:
                conn.execute(f"ALTER TABLE campaigns ADD COLUMN {col} TEXT NOT NULL DEFAULT {default}")
            except sqlite3.OperationalError:
                pass
        now = datetime.now(timezone.utc).isoformat()
        for code, name, status, step in SEED:
            conn.execute(
                "INSERT OR IGNORE INTO campaigns (code, name, status, workflow_step, step_state, created_at) VALUES (?,?,?,?,?,?)",
                (code, name, status, step, "pending", now),
            )


def generate_campaign_code(name: str) -> str:
    import re
    year = datetime.now(timezone.utc).year
    words = [w for w in re.findall(r"[A-Za-z]+", name) if len(w) > 2][:2]
    initials = "".join(w[0].upper() for w in words) if words else "XX"
    initials = (initials + "X")[:2]
    with get_app_conn() as conn:
        count = conn.execute("SELECT COUNT(*) FROM campaigns").fetchone()[0]
    return f"MDC-{year}-{initials}-{count + 1:03d}"


def create_campaign(name: str, brief: str, status: str) -> dict:
    code = generate_campaign_code(name)
    now = datetime.now(timezone.utc).isoformat()
    with get_app_conn() as conn:
        # Start at step 2 — brief submission completes step 1 (Briefing)
        conn.execute(
            "INSERT INTO campaigns (code, name, status, workflow_step, brief, step_state, created_at) VALUES (?,?,?,?,?,?,?)",
            (code, name, status, 2, brief, "pending", now),
        )
        if brief:
            conn.execute(
                "INSERT INTO messages (campaign_code, from_persona, to_address, body, created_at) VALUES (?,?,?,?,?)",
                (code, "sarah", None, f"[Campaign Brief]\n{brief}", now),
            )
        row = conn.execute("SELECT * FROM campaigns WHERE code=?", (code,)).fetchone()
    return dict(row)


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


def save_human_message(campaign_code: str, from_persona: str, to_address: str | None, body: str) -> int:
    now = datetime.now(timezone.utc).isoformat()
    with get_app_conn() as conn:
        cur = conn.execute(
            "INSERT INTO messages (campaign_code, from_persona, to_address, body, created_at) VALUES (?,?,?,?,?)",
            (campaign_code, from_persona, to_address, body, now),
        )
        return cur.lastrowid


def save_agent_reply(campaign_code: str, skill_name: str, narrative: str, skill_result: dict, advance: bool = True) -> int:
    now = datetime.now(timezone.utc).isoformat()
    with get_app_conn() as conn:
        cur = conn.execute(
            """INSERT INTO messages
               (campaign_code, from_persona, to_address, body, agent_narrative, skill_name, skill_result, created_at)
               VALUES (?,?,?,?,?,?,?,?)""",
            (campaign_code, "agent", None, narrative, narrative, skill_name, json.dumps(skill_result), now),
        )
        msg_id = cur.lastrowid
        if advance:
            conn.execute(
                "UPDATE campaigns SET workflow_step = MIN(workflow_step + 1, 10) WHERE code=?",
                (campaign_code,),
            )
        return msg_id


def set_step_state(code: str, state: str) -> None:
    with get_app_conn() as conn:
        conn.execute("UPDATE campaigns SET step_state=? WHERE code=?", (state, code))


def advance_workflow(code: str) -> None:
    """Increment workflow_step and reset step_state to pending."""
    with get_app_conn() as conn:
        conn.execute(
            "UPDATE campaigns SET workflow_step = MIN(workflow_step + 1, 10), step_state = 'pending' WHERE code=?",
            (code,),
        )


def build_agent_context(campaign: dict, messages: list, step: int) -> str:
    """Build the prompt sent to the agent for a workflow step trigger."""
    lines = [f"Campaign: {campaign['name']} ({campaign['code']})"]

    if campaign.get("brief"):
        lines += ["", "CAMPAIGN BRIEF:", campaign["brief"]]

    ai_msgs = [
        m for m in messages
        if m.get("from_persona") == "agent" and m.get("agent_narrative")
    ]
    if ai_msgs:
        lines.append("\nPRIOR RESULTS:")
        for m in ai_msgs[-3:]:
            skill = (m.get("skill_name") or "agent").replace("_", " ").title()
            lines.append(f"{skill}: {(m['agent_narrative'] or '')[:400]}")

    lines += ["", STEP_PROMPTS.get(step, f"Complete step {step} for this campaign.")]
    return "\n".join(lines)

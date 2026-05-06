"""LLM agent: routes emails to skills via TritonAI tool calling."""
from __future__ import annotations
import json
import os
from pathlib import Path

from openai import OpenAI

TRITONAI_BASE = "https://tritonai-api.ucsd.edu/v1"
MODEL = "claude-opus-4-6-v1"

REPO_ROOT = Path(__file__).resolve().parents[1]
MACYS_DB = str(REPO_ROOT / "data" / "macys.db")

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "audience_segment_builder",
            "description": "Build 3 audience segments for a campaign using RFM k-means clustering. Use when the email asks about targeting, audience, who to reach, or segmentation.",
            "parameters": {
                "type": "object",
                "properties": {
                    "brief": {"type": "string", "description": "Campaign brief or description"}
                },
                "required": ["brief"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "dam_asset_finder",
            "description": "Find clean DAM assets (photos, hero images, banners) for a campaign. Use when the email asks for images, assets, photos, hero shots, or creative materials.",
            "parameters": {
                "type": "object",
                "properties": {
                    "brief": {"type": "string"},
                    "max_results": {"type": "integer", "default": 12},
                },
                "required": ["brief"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "localization_generator",
            "description": "Generate 40 regional variants (10 US regions x 4 placements) for a campaign. Use when the email asks about localization, regional variants, regional copy, or market-specific versions.",
            "parameters": {
                "type": "object",
                "properties": {
                    "brief": {"type": "string"},
                    "sku_ids": {"type": "array", "items": {"type": "integer"}},
                },
                "required": ["brief"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "campaign_performance_analyzer",
            "description": "Analyze campaign performance: channel attribution, segment breakdown, and 14-day revenue forecast. Use when the email asks about performance, ROAS, metrics, results, or forecasting.",
            "parameters": {
                "type": "object",
                "properties": {
                    "campaign_id": {"type": "integer"},
                    "forecast_days": {"type": "integer", "default": 14},
                },
                "required": ["campaign_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "creative_concept_board",
            "description": "Generate a visual concept board by searching for photos matching the campaign mood. Use when the email asks for creative concepts, mood board, visual inspiration, or image generation.",
            "parameters": {
                "type": "object",
                "properties": {
                    "keywords": {"type": "array", "items": {"type": "string"}},
                    "count": {"type": "integer", "default": 6},
                },
                "required": ["keywords"],
            },
        },
    },
]

ADDRESS_FALLBACK = {
    "segment.builder@macys-ai.com": ("audience_segment_builder", lambda body: {"brief": body[:200]}),
    "dam.finder@macys-ai.com": ("dam_asset_finder", lambda body: {"brief": body[:200]}),
    "localize@macys-ai.com": ("localization_generator", lambda body: {"brief": body[:200]}),
    "performance@macys-ai.com": ("campaign_performance_analyzer", lambda _: {"campaign_id": 7}),
    "creative@macys-ai.com": ("creative_concept_board", lambda body: {"keywords": body.split()[:5]}),
}


def _client() -> OpenAI:
    key = os.environ.get("TRITONAI_API_KEY", "")
    if not key:
        raise ValueError("TRITONAI_API_KEY not set")
    return OpenAI(api_key=key, base_url=TRITONAI_BASE)


def _execute_tool(tool_name: str, args: dict) -> tuple[str, dict]:
    from api.skills import segment, search, generate, analyze, creative

    if tool_name == "audience_segment_builder":
        result = segment.build_segments(args["brief"], db_path=MACYS_DB)
        return "segment", {"segments": result, "brief": args["brief"]}

    if tool_name == "dam_asset_finder":
        assets, stats = search.search_with_stats(
            args["brief"], max_results=args.get("max_results", 12), db_path=MACYS_DB
        )
        return "dam", {"results": assets, "stats": stats, "brief": args["brief"]}

    if tool_name == "localization_generator":
        sku_ids = args.get("sku_ids", [4, 18])
        variants, stats = generate.generate_variants_with_stats(
            args["brief"], sku_ids, db_path=MACYS_DB
        )
        return "localize", {"variants": variants, "stats": stats, "brief": args["brief"]}

    if tool_name == "campaign_performance_analyzer":
        result = analyze.analyze_campaign(
            args["campaign_id"], forecast_days=args.get("forecast_days", 14), db_path=MACYS_DB
        )
        return "performance", {"analysis": result}

    if tool_name == "creative_concept_board":
        result = creative.search_unsplash(args["keywords"], count=args.get("count", 6))
        return "creative", result

    raise ValueError(f"Unknown tool: {tool_name}")


def run_agent(to_address: str, email_body: str, thread_history: list[dict]) -> tuple[str, str, dict]:
    client = _client()

    history_text = ""
    for m in thread_history[-6:]:
        role = "Agent" if m["from_persona"] == "agent" else m["from_persona"].title()
        history_text += f"{role}: {m['body'][:300]}\n"

    messages = [
        {
            "role": "system",
            "content": (
                "You are a Macy's marketing operations AI. "
                "Read the email and select exactly ONE tool to run. "
                "Extract precise parameters from the email text. "
                "If performance/analysis is requested without a specific campaign, use campaign_id=7."
            ),
        },
        {
            "role": "user",
            "content": f"Thread context:\n{history_text}\n\nNew email to {to_address}:\n{email_body}",
        },
    ]

    tool_name, tool_args = _select_tool(client, messages, to_address, email_body)
    skill_name, skill_result = _execute_tool(tool_name, tool_args)
    narrative = _write_reply(client, email_body, skill_name, skill_result)

    return skill_name, narrative, skill_result


def _select_tool(client: OpenAI, messages: list, to_address: str, email_body: str) -> tuple[str, dict]:
    try:
        resp = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
            temperature=0.1,
            max_tokens=500,
        )
        msg = resp.choices[0].message
        if msg.tool_calls:
            tc = msg.tool_calls[0]
            return tc.function.name, json.loads(tc.function.arguments)
    except Exception:
        pass

    if to_address in ADDRESS_FALLBACK:
        tool_name, arg_fn = ADDRESS_FALLBACK[to_address]
        return tool_name, arg_fn(email_body)

    return "audience_segment_builder", {"brief": email_body[:200]}


def _write_reply(client: OpenAI, original_email: str, skill_name: str, skill_result: dict) -> str:
    SKILL_SUMMARIES = {
        "segment": lambda r: f"Found {len(r.get('segments', []))} segments. Top segment: {r['segments'][0]['name'] if r.get('segments') else 'N/A'} with {r['segments'][0].get('customer_count', 0):,} customers." if r.get('segments') else "Segmentation complete.",
        "dam": lambda r: f"Searched {r.get('stats', {}).get('total_searched', 0)} assets, filtered to {r.get('stats', {}).get('returned', 0)} clean candidates.",
        "localize": lambda r: f"Generated {r.get('stats', {}).get('total_variants', 0)} regional variants across {r.get('stats', {}).get('regions', 0)} regions.",
        "performance": lambda r: f"Campaign analysis complete. ROAS: {r.get('analysis', {}).get('totals', {}).get('roas', 0):.1f}x.",
        "creative": lambda r: f"Found {len(r.get('photos', []))} concept images for '{r.get('query', '')}'.",
    }
    summary = SKILL_SUMMARIES.get(skill_name, lambda r: str(r)[:200])(skill_result)

    messages = [
        {
            "role": "system",
            "content": (
                "You are a professional Macy's marketing AI co-worker replying to an email. "
                "Write exactly 3-4 sentences: start with the key insight, give one specific recommendation, "
                "mention any alerts if present. Be direct and professional. No greetings or sign-offs."
            ),
        },
        {
            "role": "user",
            "content": f"Original email: {original_email}\n\nSkill output summary: {summary}\n\nFull result (use for specifics): {json.dumps(skill_result)[:1500]}",
        },
    ]

    try:
        resp = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.5,
            max_tokens=300,
        )
        return resp.choices[0].message.content or summary
    except Exception:
        return summary

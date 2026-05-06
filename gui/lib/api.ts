import type { Campaign, ThreadResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API ${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

export const fetchCampaigns = (): Promise<Campaign[]> => req("/api/campaigns");

export const fetchThread = (code: string): Promise<ThreadResponse> =>
  req(`/api/campaigns/${code}`);

export const createCampaign = (payload: {
  name: string;
  brief: string;
  status: string;
}): Promise<Campaign> =>
  req("/api/campaigns", { method: "POST", body: JSON.stringify(payload) });

export const sendEmail = (payload: {
  campaign_code: string;
  from_persona: string;
  to_address: string;
  body: string;
}): Promise<{ ok: boolean; agent_reply: unknown }> =>
  req("/api/emails/send", { method: "POST", body: JSON.stringify(payload) });

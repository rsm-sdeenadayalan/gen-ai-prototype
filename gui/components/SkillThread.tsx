"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { fetchThread } from "@/lib/api";
import { sendEmail } from "@/lib/api";
import type { Campaign, Message, SkillMeta } from "@/lib/types";
import { PERSONAS } from "@/lib/types";
import { WorkflowBar } from "./WorkflowBar";
import { MessageBubble } from "./MessageBubble";
import { Send, Loader2, ArrowLeft } from "lucide-react";

export function SkillThread({ code, skillMeta }: { code: string; skillMeta: SkillMeta }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsgId, setNewMsgId] = useState<number | null>(null);
  const [body, setBody] = useState("");
  const [from, setFrom] = useState(PERSONAS[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadThread = useCallback(async () => {
    const data = await fetchThread(code);
    setCampaign(data.campaign);
    // Filter to messages for this skill only
    const filtered = data.messages.filter(
      (m) =>
        m.to_address === skillMeta.address ||
        m.skill_name === skillMeta.skillName ||
        (m.from_persona !== "agent" && m.to_address === skillMeta.address)
    );
    setMessages(filtered);
  }, [code, skillMeta]);

  useEffect(() => { loadThread(); }, [loadThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await sendEmail({
        campaign_code: code,
        from_persona: from,
        to_address: skillMeta.address,
        body,
      });
      setBody("");
      const r = result as { ok: boolean; agent_reply?: Message | null };
      await loadThread();
      if (r.agent_reply) setNewMsgId((r.agent_reply as Message).id);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    active: { bg: "#E0F3F5", text: "#007B8A" },
    completed: { bg: "#F3F4F6", text: "#6B7280" },
    planned: { bg: "#FEF9C3", text: "#A16207" },
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Campaign header */}
      <header style={{ padding: "12px 24px", borderBottom: "1px solid #E5E0D8", backgroundColor: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Link href={`/${code}`} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6B6B6B", textDecoration: "none" }}>
            <ArrowLeft style={{ width: 12, height: 12 }} />
            {campaign?.name ?? code}
          </Link>
          <span style={{ color: "#E5E0D8" }}>›</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#007B8A" }}>{skillMeta.icon} {skillMeta.label}</span>
          {campaign && (
            <span style={{
              marginLeft: "auto",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              padding: "2px 8px",
              borderRadius: 9999,
              backgroundColor: STATUS_COLORS[campaign.status]?.bg ?? "#F3F4F6",
              color: STATUS_COLORS[campaign.status]?.text ?? "#6B7280",
            }}>
              {campaign.status}
            </span>
          )}
        </div>
        {campaign && <WorkflowBar currentStep={campaign.workflow_step} />}
      </header>

      {/* Skill sub-header */}
      <div style={{ padding: "10px 24px", backgroundColor: "#EEF8F9", borderBottom: "1px solid #C8EFF3", flexShrink: 0, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 22 }}>{skillMeta.icon}</span>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#2C2C2C", margin: 0 }}>{skillMeta.label}</p>
          <p style={{ fontSize: 11, color: "#6B6B6B", margin: 0 }}>{skillMeta.description}</p>
        </div>
        <span style={{ marginLeft: "auto", fontSize: 10, fontFamily: "monospace", color: "#007B8A", backgroundColor: "#E0F3F5", padding: "3px 8px", borderRadius: 4, border: "1px solid #C8EFF3" }}>
          {skillMeta.address}
        </span>
      </div>

      {/* Thread */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {messages.length === 0 && !loading && (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <p style={{ fontSize: 36, margin: "0 0 12px 0" }}>{skillMeta.icon}</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#2C2C2C", margin: "0 0 6px 0" }}>
              No messages yet
            </p>
            <p style={{ fontSize: 13, color: "#6B6B6B", margin: 0 }}>
              Send a brief below to run the {skillMeta.label} agent
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} animate={msg.id === newMsgId} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Compose — locked to this skill's address */}
      <form onSubmit={handleSend} style={{ borderTop: "1px solid #E5E0D8", backgroundColor: "#fff", padding: 16, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6B6B6B" }}>To</span>
          <span style={{ fontSize: 12, backgroundColor: "#E0F3F5", color: "#007B8A", padding: "3px 10px", borderRadius: 9999, fontFamily: "monospace" }}>
            {skillMeta.address}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6B6B6B", marginLeft: 16 }}>From</span>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={{ fontSize: 12, border: "1px solid #E5E0D8", borderRadius: 6, padding: "4px 8px", backgroundColor: "#F9F6F1", color: "#2C2C2C", outline: "none" }}
          >
            {PERSONAS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div style={{ position: "relative" }}>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`Write your brief for the ${skillMeta.label} agent…`}
            rows={3}
            style={{
              width: "100%",
              fontSize: 13,
              border: "1px solid #E5E0D8",
              borderRadius: 6,
              padding: "8px 12px",
              paddingRight: 100,
              backgroundColor: "#fff",
              color: "#2C2C2C",
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
          <button
            type="submit"
            disabled={!body.trim() || loading}
            style={{
              position: "absolute",
              right: 8,
              bottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: body.trim() && !loading ? "#007B8A" : "#B0D4D9",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              padding: "6px 14px",
              borderRadius: 6,
              border: "none",
              cursor: body.trim() && !loading ? "pointer" : "default",
            }}
          >
            {loading ? <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> : <Send style={{ width: 14, height: 14 }} />}
            {loading ? "Running…" : "Send"}
          </button>
        </div>
        {error && <p style={{ fontSize: 11, color: "#D9534F", margin: "6px 0 0 0" }}>{error}</p>}
      </form>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { fetchThread, sendEmail } from "@/lib/api";
import type { Campaign, Message, SkillMeta } from "@/lib/types";
import { PERSONAS } from "@/lib/types";
import { WorkflowBar } from "./WorkflowBar";
import { MessageBubble, ThinkingBubble } from "./MessageBubble";
import { Send, Loader2, ArrowLeft } from "lucide-react";

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  active:    { color: "#10B981", bg: "#ECFDF5", dot: "#10B981" },
  completed: { color: "#64748B", bg: "#F1F5F9", dot: "#94A3B8" },
  planned:   { color: "#F59E0B", bg: "#FFFBEB", dot: "#F59E0B" },
};

export function SkillThread({ code, skillMeta }: { code: string; skillMeta: SkillMeta }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsgId, setNewMsgId] = useState<number | null>(null);
  const [body, setBody] = useState("");
  const [from, setFrom] = useState(PERSONAS[0].value);
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadThread = useCallback(async () => {
    const data = await fetchThread(code);
    setCampaign(data.campaign);
    const filtered = data.messages.filter(
      (m) => m.to_address === skillMeta.address || m.skill_name === skillMeta.skillName
    );
    setMessages(filtered);
  }, [code, skillMeta]);

  useEffect(() => { loadThread(); }, [loadThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || loading) return;
    setLoading(true);
    setThinking(false);
    setError(null);

    const optimistic: Message = {
      id: -1,
      campaign_code: code,
      from_persona: from,
      to_address: skillMeta.address,
      body,
      agent_narrative: null,
      skill_name: null,
      skill_result: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setBody("");

    try {
      setThinking(true);
      const result = await sendEmail({
        campaign_code: code,
        from_persona: from,
        to_address: skillMeta.address,
        body: optimistic.body,
      });
      setThinking(false);
      const r = result as { ok: boolean; agent_reply?: Message | null };
      await loadThread();
      if (r.agent_reply) setNewMsgId((r.agent_reply as Message).id);
    } catch (err) {
      setThinking(false);
      setError((err as Error).message);
      await loadThread();
    } finally {
      setLoading(false);
    }
  }

  const sc = STATUS_CONFIG[campaign?.status ?? "planned"];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", backgroundColor: "var(--bg)" }}>
      {/* Campaign header */}
      <header style={{ padding: "20px 28px 16px", borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Link href={`/${code}`} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)", textDecoration: "none", fontWeight: 500 }}>
            <ArrowLeft style={{ width: 12, height: 12 }} />
            {campaign?.name ?? code}
          </Link>
          <span style={{ color: "var(--border)", fontSize: 14 }}>›</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{skillMeta.label}</span>
          {campaign && (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, backgroundColor: sc.bg, padding: "4px 10px", borderRadius: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: sc.dot }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: sc.color, textTransform: "capitalize" }}>{campaign.status}</span>
            </div>
          )}
        </div>
        {campaign && <WorkflowBar currentStep={campaign.workflow_step} />}
      </header>

      {/* Skill sub-header */}
      <div style={{ padding: "12px 28px", backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", flexShrink: 0, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 2px 0" }}>{skillMeta.label}</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>{skillMeta.description}</p>
        </div>
        <code style={{ fontSize: 10, color: "var(--text-muted)", backgroundColor: "var(--bg)", border: "1px solid var(--border)", padding: "4px 8px", borderRadius: 4, flexShrink: 0 }}>
          {skillMeta.address}
        </code>
      </div>

      {/* Thread */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
        {messages.length === 0 && !loading && (
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Send style={{ width: 20, height: 20, color: "var(--text-muted)" }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px 0" }}>
              No messages yet
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
              Send a brief below to trigger the {skillMeta.label} agent
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} animate={msg.id === newMsgId} />
        ))}
        {thinking && <ThinkingBubble />}
        <div ref={bottomRef} />
      </div>

      {/* Compose */}
      <form onSubmit={handleSend} style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--bg)", padding: "16px 28px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>To</span>
          <span style={{ fontSize: 11, backgroundColor: "var(--agent-bg)", color: "var(--accent)", padding: "3px 10px", borderRadius: 20, fontFamily: "monospace", border: "1px solid var(--agent-border)" }}>
            {skillMeta.address}
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginLeft: 12 }}>From</span>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={{ fontSize: 12, border: "1px solid var(--border)", borderRadius: 6, padding: "4px 8px", backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)", outline: "none", cursor: "pointer" }}
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
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "10px 14px",
              paddingRight: 110,
              backgroundColor: "var(--bg)",
              color: "var(--text-primary)",
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
              lineHeight: 1.6,
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--accent)"; }}
            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--border)"; }}
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
              backgroundColor: body.trim() && !loading ? "var(--accent)" : "var(--border)",
              color: body.trim() && !loading ? "#fff" : "var(--text-muted)",
              fontSize: 12,
              fontWeight: 600,
              padding: "7px 16px",
              borderRadius: 6,
              border: "none",
              cursor: body.trim() && !loading ? "pointer" : "default",
              transition: "background 0.15s",
            }}
          >
            {loading
              ? <Loader2 style={{ width: 13, height: 13, animation: "spin 1s linear infinite" }} />
              : <Send style={{ width: 13, height: 13 }} />
            }
            {loading ? "Running…" : "Send"}
          </button>
        </div>
        {error && <p style={{ fontSize: 11, color: "#EF4444", margin: "6px 0 0 0" }}>{error}</p>}
      </form>
    </div>
  );
}

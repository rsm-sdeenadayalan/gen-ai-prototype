"use client";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { AGENT_ADDRESSES, PERSONAS } from "@/lib/types";
import { sendEmail } from "@/lib/api";

export function ComposeForm({
  campaignCode,
  onSent,
}: {
  campaignCode: string;
  onSent: (reply: unknown) => void;
}) {
  const [to, setTo] = useState(AGENT_ADDRESSES[0].value);
  const [from, setFrom] = useState(PERSONAS[0].value);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await sendEmail({ campaign_code: campaignCode, from_persona: from, to_address: to, body });
      setBody("");
      onSent(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const selectStyle = {
    width: "100%",
    marginTop: 4,
    fontSize: 13,
    border: "1px solid #E5E0D8",
    borderRadius: 6,
    padding: "6px 10px",
    backgroundColor: "#F9F6F1",
    color: "#2C2C2C",
    outline: "none",
    cursor: "pointer",
  };

  const labelStyle = {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    color: "#6B6B6B",
    display: "block",
  };

  return (
    <form onSubmit={handleSend} style={{ borderTop: "1px solid #E5E0D8", backgroundColor: "#fff", padding: 16, display: "flex", flexDirection: "column" as const, gap: 12 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>To</label>
          <select value={to} onChange={e => setTo(e.target.value)} style={selectStyle}>
            {AGENT_ADDRESSES.map(a => (
              <option key={a.value} value={a.value}>{a.label} — {a.value}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>From</label>
          <select value={from} onChange={e => setFrom(e.target.value)} style={selectStyle}>
            {PERSONAS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Write your brief or request to the agent…"
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
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            cursor: body.trim() && !loading ? "pointer" : "default",
            transition: "background-color 0.15s",
          }}
        >
          {loading ? <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> : <Send style={{ width: 14, height: 14 }} />}
          {loading ? "Sending…" : "Send"}
        </button>
      </div>

      {error && <p style={{ fontSize: 11, color: "#D9534F", margin: 0 }}>{error}</p>}
    </form>
  );
}

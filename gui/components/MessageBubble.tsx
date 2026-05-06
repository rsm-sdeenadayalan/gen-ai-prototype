"use client";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import type { Message } from "@/lib/types";
import { PERSONA_COLORS } from "@/lib/types";
import { ReplyCard } from "./reply-cards";

function useTypewriter(text: string | null, active: boolean) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!text || !active) {
      setDisplayed(text ?? "");
      return;
    }
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [text, active]);
  return displayed;
}

export function ThinkingBubble() {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", backgroundColor: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Sparkles style={{ width: 15, height: 15, color: "#fff" }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", margin: "0 0 5px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          AI Agent · Processing
        </p>
        <div style={{ backgroundColor: "var(--agent-bg)", border: "1px solid var(--agent-border)", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "flex", gap: 3 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--accent)",
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                display: "inline-block",
              }} />
            ))}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Running agent…</span>
        </div>
      </div>
    </div>
  );
}

export function MessageBubble({ message, animate = false }: { message: Message; animate?: boolean }) {
  const isAgent = message.from_persona === "agent";
  const narrative = useTypewriter(message.agent_narrative, animate && isAgent);

  if (isAgent) {
    const skillLabel = (message.skill_name ?? "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", backgroundColor: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles style={{ width: 15, height: 15, color: "#fff" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", margin: "0 0 5px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {skillLabel} Agent · Macy&apos;s AI
          </p>
          <div style={{ backgroundColor: "var(--agent-bg)", border: "1px solid var(--agent-border)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "var(--text-primary)", lineHeight: 1.7 }}>
            {narrative || message.agent_narrative}
          </div>
          {message.skill_result && (
            <div style={{ marginTop: 12 }}>
              <ReplyCard message={message} />
            </div>
          )}
        </div>
      </div>
    );
  }

  const color = PERSONA_COLORS[message.from_persona] ?? "#555";
  const initial = message.from_persona[0]?.toUpperCase() ?? "?";
  const personaLabel = message.from_persona.charAt(0).toUpperCase() + message.from_persona.slice(1);

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", backgroundColor: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
        {initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)" }}>{personaLabel}</span>
          {message.to_address && (
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace" }}>→ {message.to_address}</span>
          )}
        </div>
        <div style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "var(--text-primary)", lineHeight: 1.7 }}>
          {message.body}
        </div>
      </div>
    </div>
  );
}

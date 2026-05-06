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

export function MessageBubble({ message, animate = false }: { message: Message; animate?: boolean }) {
  const isAgent = message.from_persona === "agent";
  const narrative = useTypewriter(message.agent_narrative, animate && isAgent);

  if (isAgent) {
    const skillLabel = (message.skill_name ?? "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", backgroundColor: "#007B8A", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles style={{ width: 16, height: 16, color: "#fff" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#007B8A", margin: "0 0 4px 0" }}>
            {skillLabel} Agent · Macy&apos;s AI
          </p>
          <div style={{ backgroundColor: "#EEF8F9", border: "1px solid #C8EFF3", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#2C2C2C", lineHeight: 1.6 }}>
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
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", backgroundColor: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
        {initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#2C2C2C", textTransform: "capitalize" }}>{message.from_persona}</span>
          {message.to_address && (
            <span style={{ fontSize: 11, color: "#6B6B6B" }}>→ {message.to_address}</span>
          )}
        </div>
        <div style={{ backgroundColor: "#fff", border: "1px solid #E5E0D8", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#2C2C2C", lineHeight: 1.6 }}>
          {message.body}
        </div>
      </div>
    </div>
  );
}

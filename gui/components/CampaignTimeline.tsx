"use client";
import { useEffect, useRef } from "react";
import type { Message } from "@/lib/types";
import { MessageBubble, ThinkingBubble } from "./MessageBubble";

interface Props {
  messages: Message[];
  newMsgId: number | null;
  thinking: boolean;
}

export function CampaignTimeline({ messages, newMsgId, thinking }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {messages.length === 0 && !thinking && (
        <div style={{ textAlign: "center", paddingTop: 60 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px 0" }}>
            Campaign ready
          </p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
            Use the action bar below to start the workflow
          </p>
        </div>
      )}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} animate={msg.id === newMsgId} />
      ))}
      {thinking && <ThinkingBubble />}
      <div ref={bottomRef} />
    </div>
  );
}

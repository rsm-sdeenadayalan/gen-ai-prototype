"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { fetchThread } from "@/lib/api";
import type { Campaign, Message } from "@/lib/types";
import { WorkflowBar } from "./WorkflowBar";
import { MessageBubble } from "./MessageBubble";
import { ComposeForm } from "./ComposeForm";

export function ThreadClient({ code }: { code: string }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsgId, setNewMsgId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadThread = useCallback(async () => {
    const data = await fetchThread(code);
    setCampaign(data.campaign);
    setMessages(data.messages);
  }, [code]);

  useEffect(() => { loadThread(); }, [loadThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSent(result: unknown) {
    const r = result as { ok: boolean; agent_reply?: Message | null };
    loadThread().then(() => {
      if (r.agent_reply) setNewMsgId((r.agent_reply as Message).id);
    });
  }

  if (!campaign) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#6B6B6B", fontSize: 13 }}>
        Loading campaign…
      </div>
    );
  }

  const statusColors: Record<string, { bg: string; text: string }> = {
    active: { bg: "#E0F3F5", text: "#007B8A" },
    completed: { bg: "#F3F4F6", text: "#6B7280" },
    planned: { bg: "#FEF9C3", text: "#A16207" },
  };
  const sc = statusColors[campaign.status] ?? statusColors.planned;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Header */}
      <header style={{ padding: "16px 24px", borderBottom: "1px solid #E5E0D8", backgroundColor: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, backgroundColor: "#E0F3F5", color: "#007B8A", padding: "2px 8px", borderRadius: 4 }}>
            {campaign.code}
          </span>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 600, color: "#2C2C2C", margin: 0 }}>
            {campaign.name}
          </h2>
          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, textTransform: "uppercase", padding: "3px 8px", borderRadius: 9999, backgroundColor: sc.bg, color: sc.text }}>
            {campaign.status}
          </span>
        </div>
        <WorkflowBar currentStep={campaign.workflow_step} />
      </header>

      {/* Thread */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#6B6B6B", fontSize: 13, paddingTop: 48 }}>
            No messages yet. Send an email to an agent below to get started.
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} animate={msg.id === newMsgId} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Compose */}
      <div style={{ flexShrink: 0 }}>
        <ComposeForm campaignCode={code} onSent={handleSent} />
      </div>
    </div>
  );
}

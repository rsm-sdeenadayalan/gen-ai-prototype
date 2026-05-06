"use client";
import { useCallback, useEffect, useState } from "react";
import { fetchThread, triggerStep, approveStep, reviseStep, advanceStep } from "@/lib/api";
import type { Campaign, Message } from "@/lib/types";
import { WorkflowPipeline } from "./WorkflowPipeline";
import { CampaignTimeline } from "./CampaignTimeline";
import { StepActionBar } from "./StepActionBar";

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  active:    { color: "#10B981", bg: "#ECFDF5", dot: "#10B981" },
  completed: { color: "#64748B", bg: "#F1F5F9", dot: "#94A3B8" },
  planned:   { color: "#F59E0B", bg: "#FFFBEB", dot: "#F59E0B" },
};

export function CampaignWorkspace({ code }: { code: string }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsgId, setNewMsgId] = useState<number | null>(null);
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const data = await fetchThread(code);
    setCampaign(data.campaign);
    setMessages(data.messages);
  }, [code]);

  useEffect(() => { reload(); }, [reload]);

  async function handleTrigger() {
    setLoading(true);
    setThinking(true);
    setError(null);
    try {
      const result = await triggerStep(code);
      setThinking(false);
      const reply = result.agent_reply as Message | null;
      if (reply?.id) setNewMsgId(reply.id);
      setCampaign(result.campaign);
      await reload();
    } catch (err) {
      setThinking(false);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    setLoading(true);
    setError(null);
    try {
      const updated = await approveStep(code);
      setCampaign(updated);
      await reload();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRevise() {
    setLoading(true);
    setError(null);
    try {
      const updated = await reviseStep(code);
      setCampaign(updated);
      await reload();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdvance(note: string) {
    setLoading(true);
    setError(null);
    try {
      const updated = await advanceStep(code, note);
      setCampaign(updated);
      await reload();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const sc = STATUS_CONFIG[campaign?.status ?? "planned"];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", backgroundColor: "var(--bg)" }}>
      {/* Header */}
      <header style={{ padding: "20px 28px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: campaign?.brief ? 14 : 0 }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)", backgroundColor: "var(--bg-secondary)", padding: "3px 8px", borderRadius: 4, border: "1px solid var(--border)", fontWeight: 500 }}>
            {code}
          </span>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
            {campaign?.name ?? "Loading…"}
          </h2>
          {campaign && (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, backgroundColor: sc.bg, padding: "4px 10px", borderRadius: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: sc.dot }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: sc.color, textTransform: "capitalize" }}>{campaign.status}</span>
            </div>
          )}
        </div>

        {campaign?.brief && (
          <div style={{ padding: "10px 14px", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderLeft: "3px solid var(--accent)", borderRadius: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px 0" }}>Campaign Brief</p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{campaign.brief}</p>
          </div>
        )}
      </header>

      {/* Workflow pipeline */}
      {campaign && (
        <WorkflowPipeline
          currentStep={campaign.workflow_step}
          stepState={campaign.step_state}
        />
      )}

      {/* Unified message timeline */}
      <CampaignTimeline
        messages={messages}
        newMsgId={newMsgId}
        thinking={thinking}
      />

      {/* Context-aware action bar */}
      {campaign && (
        <StepActionBar
          campaign={campaign}
          loading={loading}
          error={error}
          onTrigger={handleTrigger}
          onApprove={handleApprove}
          onRevise={handleRevise}
          onAdvance={handleAdvance}
        />
      )}
    </div>
  );
}

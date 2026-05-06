"use client";
import { useEffect, useState } from "react";
import { fetchThread } from "@/lib/api";
import { WorkflowBar } from "./WorkflowBar";
import type { Campaign } from "@/lib/types";

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  active:    { color: "#10B981", bg: "#ECFDF5", dot: "#10B981" },
  completed: { color: "#64748B", bg: "#F1F5F9", dot: "#94A3B8" },
  planned:   { color: "#F59E0B", bg: "#FFFBEB", dot: "#F59E0B" },
};

export function CampaignOverviewHeader({ code }: { code: string }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchThread(code).then((d) => setCampaign(d.campaign)).catch(console.error);
  }, [code]);

  const sc = STATUS_CONFIG[campaign?.status ?? "planned"];

  return (
    <header style={{ padding: "20px 28px 16px", borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg)", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
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
        <div style={{ marginBottom: 14, padding: "10px 14px", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, borderLeft: "3px solid var(--accent)" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px 0" }}>Campaign Brief</p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{campaign.brief}</p>
        </div>
      )}
      {campaign && <WorkflowBar currentStep={campaign.workflow_step} />}
    </header>
  );
}

"use client";
import { useEffect, useState } from "react";
import { fetchThread } from "@/lib/api";
import { WorkflowBar } from "./WorkflowBar";
import type { Campaign } from "@/lib/types";

export function CampaignOverviewHeader({ code }: { code: string }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchThread(code).then((d) => setCampaign(d.campaign)).catch(console.error);
  }, [code]);

  const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    active: { bg: "#E0F3F5", text: "#007B8A" },
    completed: { bg: "#F3F4F6", text: "#6B7280" },
    planned: { bg: "#FEF9C3", text: "#A16207" },
  };

  return (
    <header style={{ padding: "16px 32px", borderBottom: "1px solid #E5E0D8", backgroundColor: "#fff", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, backgroundColor: "#E0F3F5", color: "#007B8A", padding: "2px 8px", borderRadius: 4 }}>
          {code}
        </span>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 600, color: "#2C2C2C", margin: 0 }}>
          {campaign?.name ?? "Loading…"}
        </h2>
        {campaign && (
          <span style={{
            marginLeft: "auto",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            padding: "3px 8px",
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
  );
}

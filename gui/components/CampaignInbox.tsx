"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCampaigns } from "@/lib/api";
import type { Campaign } from "@/lib/types";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: "#E0F3F5", text: "#007B8A" },
  planned: { bg: "#FEF9C3", text: "#A16207" },
  completed: { bg: "#F3F4F6", text: "#6B7280" },
};

export function CampaignInbox({ activeCode }: { activeCode?: string }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    fetchCampaigns().then(setCampaigns).catch(console.error);
  }, []);

  return (
    <aside style={{
      width: 280,
      flexShrink: 0,
      borderRight: "1px solid #E5E0D8",
      backgroundColor: "#FFFFFF",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
    }}>
      <header style={{ padding: "16px 20px", borderBottom: "1px solid #E5E0D8" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#007B8A", margin: 0 }}>
          Macy&apos;s Marketing Ops
        </p>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 600, color: "#2C2C2C", margin: "4px 0 0 0" }}>
          Campaign Inbox
        </h1>
      </header>

      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {campaigns.map((c) => (
          <Link
            key={c.code}
            href={`/${c.code}`}
            style={{
              display: "block",
              padding: "12px 16px",
              borderLeft: `2px solid ${activeCode === c.code ? "#007B8A" : "transparent"}`,
              backgroundColor: activeCode === c.code ? "#F9F6F1" : "transparent",
              textDecoration: "none",
              transition: "background-color 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 10, fontFamily: "monospace", color: "#6B6B6B", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.code}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#2C2C2C", margin: "2px 0 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.name}
                </p>
              </div>
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "2px 6px",
                borderRadius: 9999,
                flexShrink: 0,
                backgroundColor: STATUS_COLORS[c.status]?.bg ?? "#F3F4F6",
                color: STATUS_COLORS[c.status]?.text ?? "#6B7280",
              }}>
                {c.status}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <div style={{ flex: 1, height: 4, backgroundColor: "#E5E0D8", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(c.workflow_step / 10) * 100}%`, backgroundColor: "#007B8A", borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 9, color: "#6B6B6B" }}>{c.workflow_step}/10</span>
            </div>
          </Link>
        ))}
      </nav>

      <footer style={{ padding: "12px 16px", borderTop: "1px solid #E5E0D8", fontSize: 10, color: "#6B6B6B" }}>
        GenAI Co-Worker · Group 4 · MGT 449
      </footer>
    </aside>
  );
}

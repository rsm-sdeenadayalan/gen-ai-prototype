"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Plus, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { fetchCampaigns } from "@/lib/api";
import type { Campaign } from "@/lib/types";
import { STEPS_META } from "@/lib/types";
import { NewCampaignModal } from "./NewCampaignModal";

const STATUS_DOT: Record<string, string> = {
  active: "#10B981",
  planned: "#F59E0B",
  completed: "#64748B",
};

const AI_STEPS = new Set([2, 4, 5, 7, 9]);

export function CampaignInbox({ activeCode }: { activeCode?: string; activeSkill?: string }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCampaigns().then(setCampaigns).catch(console.error);
  }, [showModal]);

  return (
    <>
      {showModal && <NewCampaignModal onClose={() => setShowModal(false)} />}
      <aside style={{
        width: 256,
        flexShrink: 0,
        backgroundColor: "var(--sidebar-bg)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        borderRight: "1px solid var(--sidebar-border)",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--sidebar-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: "-0.5px" }}>M</span>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9", lineHeight: 1 }}>Campaign Center</p>
              <p style={{ fontSize: 10, color: "var(--sidebar-text)", marginTop: 2, lineHeight: 1 }}>Macy&apos;s Marketing Ops</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 4px" }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
              Campaigns
            </p>
            <button
              onClick={() => setShowModal(true)}
              title="New Campaign"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", display: "flex", alignItems: "center", padding: 2, borderRadius: 4 }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#475569"; }}
            >
              <Plus size={14} />
            </button>
          </div>

          {campaigns.map((c) => {
            const isActive = activeCode === c.code;
            const dot = STATUS_DOT[c.status] ?? "#64748B";

            return (
              <div key={c.code}>
                <Link href={`/${c.code}`} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{
                    padding: "8px 16px",
                    backgroundColor: isActive ? "var(--sidebar-active)" : "transparent",
                    borderLeft: `2px solid ${isActive ? "var(--accent)" : "transparent"}`,
                    cursor: "pointer",
                    transition: "background 0.1s",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: dot, flexShrink: 0 }} />
                      <span style={{
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "var(--sidebar-text-active)" : "var(--sidebar-text)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}>
                        {c.name}
                      </span>
                      <ChevronRight size={12} style={{ color: "#475569", flexShrink: 0, transform: isActive ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }} />
                    </div>
                    <p style={{ fontSize: 10, fontFamily: "monospace", color: "#475569", marginTop: 2, paddingLeft: 14 }}>
                      {c.code}
                    </p>
                  </div>
                </Link>

                {/* Workflow step sub-items */}
                {isActive && (
                  <div style={{ backgroundColor: "#080F1E", paddingBottom: 4 }}>
                    {Object.entries(STEPS_META).map(([s, meta]) => {
                      const step = Number(s);
                      const done = step < c.workflow_step;
                      const active = step === c.workflow_step;
                      const isAI = AI_STEPS.has(step);

                      return (
                        <div
                          key={step}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "5px 16px 5px 22px",
                            borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                            backgroundColor: active ? "#0F1E3A" : "transparent",
                          }}
                        >
                          {done ? (
                            <CheckCircle2 size={11} style={{ color: "#10B981", flexShrink: 0 }} />
                          ) : active ? (
                            <div style={{ width: 11, height: 11, borderRadius: "50%", border: "2px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "var(--accent)" }} />
                            </div>
                          ) : (
                            <Circle size={11} style={{ color: "#2D3748", flexShrink: 0 }} />
                          )}
                          <span style={{
                            fontSize: 11,
                            color: done ? "#475569" : active ? "#CBD5E1" : "#2D3748",
                            fontWeight: active ? 500 : 400,
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}>
                            {step}. {meta.name}
                          </span>
                          {isAI && (
                            <Sparkles size={9} style={{ color: done ? "#475569" : active ? "var(--accent)" : "#2D3748", flexShrink: 0 }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--sidebar-border)", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>G4</span>
          </div>
          <span style={{ fontSize: 11, color: "#475569" }}>MGT 449 · Group 4</span>
        </div>
      </aside>
    </>
  );
}

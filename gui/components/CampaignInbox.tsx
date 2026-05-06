"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, ImageIcon, Sparkles, Globe, TrendingUp, ChevronRight, Plus } from "lucide-react";
import { fetchCampaigns } from "@/lib/api";
import type { Campaign } from "@/lib/types";
import { SKILL_META } from "@/lib/types";
import { NewCampaignModal } from "./NewCampaignModal";

const SKILL_ICONS: Record<string, React.FC<{ size?: number; strokeWidth?: number }>> = {
  segment: ({ size = 14, strokeWidth = 1.8 }) => <Users size={size} strokeWidth={strokeWidth} />,
  dam: ({ size = 14, strokeWidth = 1.8 }) => <ImageIcon size={size} strokeWidth={strokeWidth} />,
  creative: ({ size = 14, strokeWidth = 1.8 }) => <Sparkles size={size} strokeWidth={strokeWidth} />,
  localize: ({ size = 14, strokeWidth = 1.8 }) => <Globe size={size} strokeWidth={strokeWidth} />,
  performance: ({ size = 14, strokeWidth = 1.8 }) => <TrendingUp size={size} strokeWidth={strokeWidth} />,
};

const STATUS_DOT: Record<string, string> = {
  active: "#10B981",
  planned: "#F59E0B",
  completed: "#64748B",
};

export function CampaignInbox({ activeCode, activeSkill }: { activeCode?: string; activeSkill?: string }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCampaigns().then(setCampaigns).catch(console.error);
  }, [showModal]);

  return (
    <>
    {showModal && <NewCampaignModal onClose={() => setShowModal(false)} />}
    <aside style={{
      width: 248,
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
                  backgroundColor: isActive && !activeSkill ? "var(--sidebar-active)" : "transparent",
                  borderLeft: `2px solid ${isActive && !activeSkill ? "var(--accent)" : "transparent"}`,
                  cursor: "pointer",
                  transition: "background 0.1s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: dot, flexShrink: 0 }} />
                    <span style={{
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive && !activeSkill ? "var(--sidebar-text-active)" : "var(--sidebar-text)",
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

              {/* Skill sub-items */}
              {isActive && (
                <div style={{ backgroundColor: "#080F1E" }}>
                  {SKILL_META.map((skill) => {
                    const Icon = SKILL_ICONS[skill.slug];
                    const isSkillActive = activeSkill === skill.slug;
                    return (
                      <Link key={skill.slug} href={`/${c.code}/${skill.slug}`} style={{ textDecoration: "none", display: "block" }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                          padding: "7px 16px 7px 28px",
                          backgroundColor: isSkillActive ? "#0F1E3A" : "transparent",
                          borderLeft: `2px solid ${isSkillActive ? "var(--accent)" : "transparent"}`,
                          transition: "background 0.1s",
                        }}>
                          <span style={{ color: isSkillActive ? "var(--accent)" : "#475569", display: "flex", flexShrink: 0 }}>
                            {Icon && <Icon size={13} strokeWidth={2} />}
                          </span>
                          <span style={{
                            fontSize: 12,
                            color: isSkillActive ? "#CBD5E1" : "#64748B",
                            fontWeight: isSkillActive ? 500 : 400,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}>
                            {skill.label}
                          </span>
                        </div>
                      </Link>
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

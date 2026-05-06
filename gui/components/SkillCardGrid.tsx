"use client";
import Link from "next/link";
import { Users, ImageIcon, Sparkles, Globe, TrendingUp, ArrowRight } from "lucide-react";
import { SKILL_META } from "@/lib/types";

const SKILL_ICONS: Record<string, React.FC<{ size?: number }>> = {
  segment:     ({ size = 20 }) => <Users size={size} strokeWidth={1.6} />,
  dam:         ({ size = 20 }) => <ImageIcon size={size} strokeWidth={1.6} />,
  creative:    ({ size = 20 }) => <Sparkles size={size} strokeWidth={1.6} />,
  localize:    ({ size = 20 }) => <Globe size={size} strokeWidth={1.6} />,
  performance: ({ size = 20 }) => <TrendingUp size={size} strokeWidth={1.6} />,
};

const SKILL_ACCENT: Record<string, string> = {
  segment:     "#0284C7",
  dam:         "#7C3AED",
  creative:    "#DB2777",
  localize:    "#059669",
  performance: "#D97706",
};

export function SkillCardGrid({ code }: { code: string }) {
  return (
    <>
      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
        AI-Assisted Workflow Steps
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        {SKILL_META.map((skill) => {
          const Icon = SKILL_ICONS[skill.slug];
          const accent = SKILL_ACCENT[skill.slug] ?? "var(--accent)";
          return (
            <Link key={skill.slug} href={`/${code}/${skill.slug}`} style={{ textDecoration: "none" }}>
              <div
                style={{
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "20px",
                  cursor: "pointer",
                  transition: "box-shadow 0.15s, border-color 0.15s, transform 0.1s",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = accent;
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center", color: accent }}>
                    {Icon && <Icon size={20} />}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: accent, backgroundColor: `${accent}12`, padding: "3px 8px", borderRadius: 20, letterSpacing: "0.04em" }}>
                    STEP {skill.workflowStep} · AI
                  </span>
                </div>

                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 5, letterSpacing: "-0.2px" }}>
                    {skill.label}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
                    {skill.description}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4, borderTop: "1px solid var(--border)" }}>
                  <code style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "-0.2px" }}>
                    {skill.address}
                  </code>
                  <ArrowRight size={14} style={{ color: accent }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

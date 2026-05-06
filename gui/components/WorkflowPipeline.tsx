"use client";
import { CheckCircle2, Circle, Sparkles, User } from "lucide-react";
import { STEPS_META } from "@/lib/types";

interface Props {
  currentStep: number;
  stepState: string;
}

export function WorkflowPipeline({ currentStep, stepState }: Props) {
  return (
    <div style={{ padding: "12px 28px", borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)", flexShrink: 0, overflowX: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: "max-content" }}>
        {Object.entries(STEPS_META).map(([s, meta]) => {
          const step = Number(s);
          const done = step < currentStep;
          const active = step === currentStep;
          const isAI = meta.type === "ai";
          const isAwaiting = active && stepState === "awaiting_approval";

          let dotColor = "var(--border)";
          let labelColor = "var(--text-muted)";
          let bgColor = "transparent";

          if (done) {
            dotColor = "#10B981";
            labelColor = "var(--text-secondary)";
          } else if (active) {
            dotColor = isAwaiting ? "#F59E0B" : "var(--accent)";
            labelColor = "var(--text-primary)";
            bgColor = isAwaiting ? "#FFFBEB" : "var(--accent-light)";
          }

          return (
            <div key={step} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                borderRadius: 8,
                backgroundColor: bgColor,
                transition: "background 0.2s",
                minWidth: 72,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {done ? (
                    <CheckCircle2 size={14} style={{ color: "#10B981", flexShrink: 0 }} />
                  ) : active ? (
                    <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${dotColor}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: dotColor }} />
                    </div>
                  ) : (
                    <Circle size={14} style={{ color: "var(--border)", flexShrink: 0 }} />
                  )}
                  {isAI && (
                    <Sparkles size={9} style={{ color: done ? "#10B981" : active ? dotColor : "var(--border)" }} />
                  )}
                  {!isAI && !done && !active && (
                    <User size={9} style={{ color: "var(--border)" }} />
                  )}
                </div>
                <span style={{
                  fontSize: 9,
                  fontWeight: active ? 700 : 400,
                  color: labelColor,
                  whiteSpace: "nowrap",
                  letterSpacing: active ? "0.02em" : 0,
                  textAlign: "center",
                  lineHeight: 1.3,
                }}>
                  {step}. {meta.name}
                </span>
              </div>
              {step < 10 && (
                <div style={{ width: 16, height: 1, backgroundColor: step < currentStep ? "#10B981" : "var(--border)", flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

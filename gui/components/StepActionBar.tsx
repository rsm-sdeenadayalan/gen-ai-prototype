"use client";
import { useState } from "react";
import { Play, ThumbsUp, RotateCcw, CheckCheck, Loader2, ChevronRight } from "lucide-react";
import type { Campaign } from "@/lib/types";
import { STEPS_META } from "@/lib/types";

const AI_STEPS = new Set([2, 4, 5, 7, 9]);

interface Props {
  campaign: Campaign;
  loading: boolean;
  error: string | null;
  onTrigger: () => void;
  onApprove: () => void;
  onRevise: () => void;
  onAdvance: (note: string) => void;
}

export function StepActionBar({ campaign, loading, error, onTrigger, onApprove, onRevise, onAdvance }: Props) {
  const [note, setNote] = useState("");
  const step = campaign.workflow_step;
  const state = campaign.step_state;
  const meta = STEPS_META[step];
  const isAI = AI_STEPS.has(step);

  if (!meta || step > 10) return null;

  const accent = "var(--accent)";

  const btnBase: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 7,
    fontSize: 12, fontWeight: 600, padding: "9px 18px",
    borderRadius: 7, border: "none", cursor: "pointer",
    fontFamily: "inherit", transition: "opacity 0.15s",
  };

  // Campaign complete
  if (step === 10 && state === "pending") {
    return (
      <div style={{ borderTop: "1px solid var(--border)", padding: "16px 28px", backgroundColor: "var(--bg)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 2px 0" }}>Step 10 · Reporting</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Compile final campaign report and archive results.</p>
          </div>
          <button onClick={() => onAdvance("")} disabled={loading} style={{ ...btnBase, backgroundColor: "#10B981", color: "#fff", opacity: loading ? 0.6 : 1 }}>
            {loading ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <CheckCheck size={13} />}
            Mark Campaign Complete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--bg)", padding: "14px 28px", flexShrink: 0 }}>
      {/* Step label */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Current Step
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 5, backgroundColor: isAI ? "var(--accent-light)" : "var(--bg-secondary)", padding: "3px 10px", borderRadius: 20, border: "1px solid var(--border)" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: isAI ? accent : "var(--text-secondary)" }}>
            {step}. {meta.name}
          </span>
          {isAI && <span style={{ fontSize: 9, fontWeight: 700, color: accent, backgroundColor: `${accent}15`, padding: "1px 5px", borderRadius: 10 }}>AI</span>}
        </div>
        {state === "awaiting_approval" && (
          <span style={{ fontSize: 10, fontWeight: 600, color: "#F59E0B", backgroundColor: "#FFFBEB", padding: "3px 8px", borderRadius: 10, border: "1px solid #FDE68A" }}>
            Awaiting Approval
          </span>
        )}
      </div>

      {/* Action content */}
      {isAI && state === "pending" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", flex: 1, margin: 0 }}>
            AI will automatically pull the campaign brief and all prior results as context.
          </p>
          <button onClick={onTrigger} disabled={loading} style={{ ...btnBase, backgroundColor: accent, color: "#fff", opacity: loading ? 0.6 : 1 }}>
            {loading ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Play size={13} />}
            {loading ? "Running Agent…" : `Run ${meta.name} Agent`}
          </button>
        </div>
      )}

      {isAI && state === "awaiting_approval" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", flex: 1, margin: 0 }}>
            Review the agent results above, then approve to advance the workflow.
          </p>
          <button onClick={onRevise} disabled={loading} style={{ ...btnBase, backgroundColor: "var(--bg)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            <RotateCcw size={13} />
            Request Revision
          </button>
          <button onClick={onApprove} disabled={loading} style={{ ...btnBase, backgroundColor: "#10B981", color: "#fff", opacity: loading ? 0.6 : 1 }}>
            {loading ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <ThumbsUp size={13} />}
            Approve &amp; Continue
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      {!isAI && (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Optional note for step ${step} (${meta.name})…`}
            style={{
              flex: 1, fontSize: 12, padding: "8px 12px",
              border: "1px solid var(--border)", borderRadius: 7,
              backgroundColor: "var(--bg)", color: "var(--text-primary)",
              outline: "none", fontFamily: "inherit",
            }}
            onFocus={(e) => { e.target.style.borderColor = accent; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
          />
          <button
            onClick={() => { onAdvance(note); setNote(""); }}
            disabled={loading}
            style={{ ...btnBase, backgroundColor: "var(--accent)", color: "#fff", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <CheckCheck size={13} />}
            Mark Complete
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      {error && <p style={{ fontSize: 11, color: "#EF4444", margin: "8px 0 0 0" }}>{error}</p>}
    </div>
  );
}

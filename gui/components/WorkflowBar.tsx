"use client";

const STEPS = ["Briefing", "Segmentation", "SKU Select", "Creative", "Layout", "Approval", "Localization", "Activation", "Monitoring", "Reporting"];
const AI_STEPS = new Set([2, 4, 5, 7, 9]);

export function WorkflowBar({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
      {STEPS.map((name, i) => {
        const step = i + 1;
        const done = step < currentStep;
        const active = step === currentStep;
        return (
          <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              height: active ? 3 : 2,
              width: "100%",
              borderRadius: 2,
              backgroundColor: done ? "var(--accent)" : active ? "var(--accent)" : "var(--border)",
              opacity: done ? 1 : active ? 1 : 0.5,
              transition: "all 0.2s",
            }} />
            <span style={{
              fontSize: 9,
              fontWeight: active ? 700 : 400,
              color: active ? "var(--accent)" : done ? "var(--text-secondary)" : "var(--text-muted)",
              whiteSpace: "nowrap",
              letterSpacing: active ? "0.02em" : 0,
            }}>
              {step}. {name}
              {AI_STEPS.has(step) && <span style={{ color: "var(--accent)", marginLeft: 2 }}>·AI</span>}
            </span>
          </div>
        );
      })}
    </div>
  );
}

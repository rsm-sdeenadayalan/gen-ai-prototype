"use client";

const STEPS = [
  "Briefing", "Segmentation", "SKU Selection", "Creative",
  "Layout", "Approval", "Localization", "Activation", "Monitoring", "Reporting",
];

const AI_STEPS = new Set([2, 4, 5, 7, 9]);

export function WorkflowBar({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ display: "flex", gap: 4, overflowX: "auto", padding: "8px 0" }}>
      {STEPS.map((name, i) => {
        const step = i + 1;
        const done = step < currentStep;
        const active = step === currentStep;
        const barColor = done || active ? "#007B8A" : "#E5E0D8";
        const textColor = active ? "#007B8A" : done ? "#2C2C2C" : "#6B6B6B";
        const fontWeight = active ? "700" : "400";
        return (
          <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 68 }}>
            <div style={{
              height: 6,
              width: "100%",
              borderRadius: 3,
              backgroundColor: barColor,
              animation: active ? "pulse 2s infinite" : undefined,
            }} />
            <span style={{ fontSize: 9, textAlign: "center", lineHeight: 1.2, color: textColor, fontWeight }}>
              {step}. {name}
              {AI_STEPS.has(step) && <><br /><span style={{ color: "#007B8A", fontSize: 8 }}>✦ AI</span></>}
            </span>
          </div>
        );
      })}
    </div>
  );
}

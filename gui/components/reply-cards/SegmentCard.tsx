import type { Segment } from "@/lib/types";

export function SegmentCard({ segments, brief }: { segments: Segment[]; brief: string }) {
  return (
    <div style={{ borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "var(--bg)", overflow: "hidden", fontSize: 13 }}>
      <div style={{ backgroundColor: "var(--agent-bg)", padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--agent-border)" }}>
        <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Audience Segments</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>— {brief}</span>
      </div>
      <div>
        {segments.map((seg, i) => (
          <div key={i} style={{ padding: "12px 16px", borderBottom: i < segments.length - 1 ? "1px solid var(--border)" : undefined, backgroundColor: i === 0 ? "var(--bg-secondary)" : "var(--bg)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{seg.name}</span>
                {i === 0 && (
                  <span style={{ marginLeft: 8, fontSize: 10, backgroundColor: "var(--accent)", color: "#fff", padding: "2px 8px", borderRadius: 20 }}>
                    RECOMMENDED
                  </span>
                )}
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0 0" }}>{seg.definition}</p>
              </div>
              <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--text-primary)", fontWeight: 600, flexShrink: 0 }}>
                {seg.customer_count.toLocaleString()} customers
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 8, fontSize: 11 }}>
              <div><span style={{ color: "var(--text-muted)" }}>Recency</span><br /><b>{Math.round(seg.avg_recency_days)}d ago</b></div>
              <div><span style={{ color: "var(--text-muted)" }}>Frequency</span><br /><b>{seg.avg_frequency.toFixed(1)}x</b></div>
              <div><span style={{ color: "var(--text-muted)" }}>Avg Spend</span><br /><b>${seg.avg_monetary.toFixed(0)}</b></div>
            </div>
            {seg.top_category && (
              <p style={{ fontSize: 11, color: "var(--accent)", marginTop: 6 }}>
                ↑ {seg.top_category} +{(seg.top_category_lift * 100).toFixed(0)}% vs avg
              </p>
            )}
            <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
              {Object.entries(seg.loyalty_mix).map(([tier, pct]) => (
                <span key={tier} style={{ fontSize: 10, backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 6px", color: "var(--text-secondary)" }}>
                  {tier} {pct.toFixed(0)}%
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "8px 16px", backgroundColor: "var(--bg-secondary)", fontSize: 11, color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
        Total addressable: <b style={{ color: "var(--text-primary)" }}>{segments.reduce((s, seg) => s + seg.customer_count, 0).toLocaleString()} customers</b>
      </div>
    </div>
  );
}

import type { Segment } from "@/lib/types";

export function SegmentCard({ segments, brief }: { segments: Segment[]; brief: string }) {
  return (
    <div style={{ borderRadius: 8, border: "1px solid #E5E0D8", backgroundColor: "#fff", overflow: "hidden", fontSize: 13 }}>
      <div style={{ backgroundColor: "#E0F3F5", padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#007B8A", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>✦ Audience Segments</span>
        <span style={{ fontSize: 11, color: "#6B6B6B" }}>— {brief}</span>
      </div>
      <div>
        {segments.map((seg, i) => (
          <div key={i} style={{ padding: "12px 16px", borderBottom: i < segments.length - 1 ? "1px solid #E5E0D8" : undefined, backgroundColor: i === 0 ? "#F0FAFB" : "#fff" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontWeight: 600, color: "#2C2C2C" }}>{seg.name}</span>
                {i === 0 && (
                  <span style={{ marginLeft: 8, fontSize: 10, backgroundColor: "#007B8A", color: "#fff", padding: "2px 8px", borderRadius: 9999 }}>
                    RECOMMENDED
                  </span>
                )}
                <p style={{ fontSize: 11, color: "#6B6B6B", margin: "2px 0 0 0" }}>{seg.definition}</p>
              </div>
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "#2C2C2C" }}>{seg.customer_count.toLocaleString()} customers</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 8, fontSize: 11 }}>
              <div><span style={{ color: "#6B6B6B" }}>Recency</span><br /><b>{Math.round(seg.avg_recency_days)}d ago</b></div>
              <div><span style={{ color: "#6B6B6B" }}>Frequency</span><br /><b>{seg.avg_frequency.toFixed(1)}x</b></div>
              <div><span style={{ color: "#6B6B6B" }}>Avg Spend</span><br /><b>${seg.avg_monetary.toFixed(0)}</b></div>
            </div>
            {seg.top_category && (
              <p style={{ fontSize: 11, color: "#007B8A", marginTop: 6 }}>
                ↑ {seg.top_category} +{(seg.top_category_lift * 100).toFixed(0)}% vs avg
              </p>
            )}
            <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
              {Object.entries(seg.loyalty_mix).map(([tier, pct]) => (
                <span key={tier} style={{ fontSize: 10, backgroundColor: "#F9F6F1", border: "1px solid #E5E0D8", borderRadius: 4, padding: "2px 6px" }}>
                  {tier} {pct.toFixed(0)}%
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "8px 16px", backgroundColor: "#F9F6F1", fontSize: 11, color: "#6B6B6B", borderTop: "1px solid #E5E0D8" }}>
        Total customers: {segments.reduce((s, seg) => s + seg.customer_count, 0).toLocaleString()}
      </div>
    </div>
  );
}

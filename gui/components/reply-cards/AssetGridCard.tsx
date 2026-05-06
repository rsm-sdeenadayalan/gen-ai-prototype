import type { DamAsset, DamStats } from "@/lib/types";

export function AssetGridCard({ results, stats, brief }: { results: DamAsset[]; stats: DamStats; brief: string }) {
  return (
    <div style={{ borderRadius: 8, border: "1px solid #E5E0D8", backgroundColor: "#fff", overflow: "hidden", fontSize: 13 }}>
      <div style={{ backgroundColor: "#E0F3F5", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#007B8A", fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>✦ DAM Assets</span>
        <span style={{ fontSize: 11, color: "#6B6B6B" }}>{stats.returned} of {stats.total_searched} · {brief}</span>
      </div>
      <div style={{ padding: "8px 16px", display: "flex", gap: 12, fontSize: 11, backgroundColor: "#F9F6F1", borderBottom: "1px solid #E5E0D8" }}>
        <span style={{ color: "#D9534F" }}>✕ {stats.filtered_out.degraded} degraded</span>
        <span style={{ color: "#D9534F" }}>✕ {stats.filtered_out.expired_rights} expired rights</span>
        <span style={{ color: "#D9534F" }}>✕ {stats.filtered_out.low_resolution} low-res</span>
        <span style={{ marginLeft: "auto", color: "#007B8A", fontWeight: 600 }}>✓ {stats.kept} clean</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: 12 }}>
        {results.slice(0, 12).map((asset, i) => (
          <div key={asset.asset_id} style={{ position: "relative", borderRadius: 6, overflow: "hidden", border: "1px solid #E5E0D8", aspectRatio: "4/3", backgroundColor: "#F0FAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10, color: "#6B6B6B", textAlign: "center", padding: 4 }}>{asset.asset_type}</span>
            <div style={{ position: "absolute", bottom: 2, left: 2, right: 2 }}>
              <span style={{ fontSize: 9, backgroundColor: "rgba(44,44,44,0.75)", color: "#fff", padding: "1px 4px", borderRadius: 3, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {(asset.relevance_score * 100).toFixed(0)}% · {asset.resolution}
              </span>
            </div>
            {i === 0 && (
              <span style={{ position: "absolute", top: 4, left: 4, fontSize: 8, backgroundColor: "#007B8A", color: "#fff", padding: "1px 5px", borderRadius: 3 }}>#1</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

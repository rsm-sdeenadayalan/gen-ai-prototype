import type { DamAsset, DamStats } from "@/lib/types";

function assetImageUrl(asset: DamAsset): string {
  // Deterministic image per asset using picsum seed — consistent across refreshes
  return `https://picsum.photos/seed/dam-${asset.asset_id}/400/300`;
}

const TYPE_LABEL: Record<string, string> = {
  banner: "Banner",
  product: "Product",
  lifestyle: "Lifestyle",
  social: "Social",
};

export function AssetGridCard({ results, stats, brief }: { results: DamAsset[]; stats: DamStats; brief: string }) {
  return (
    <div style={{ borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "var(--bg)", overflow: "hidden", fontSize: 13 }}>
      {/* Header */}
      <div style={{ backgroundColor: "var(--agent-bg)", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--agent-border)" }}>
        <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>DAM Assets</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)", maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {stats.returned} of {stats.total_searched} · {brief}
        </span>
      </div>

      {/* Filter stats */}
      <div style={{ padding: "7px 16px", display: "flex", gap: 16, fontSize: 11, backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
        <span style={{ color: "#EF4444" }}>✕ {stats.filtered_out.degraded} degraded</span>
        <span style={{ color: "#EF4444" }}>✕ {stats.filtered_out.expired_rights} expired rights</span>
        <span style={{ color: "#EF4444" }}>✕ {stats.filtered_out.low_resolution} low-res</span>
        <span style={{ marginLeft: "auto", color: "#10B981", fontWeight: 600 }}>✓ {stats.kept} clean</span>
      </div>

      {/* Image grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: 12 }}>
        {results.slice(0, 12).map((asset, i) => (
          <div key={asset.asset_id} style={{ position: "relative", borderRadius: 6, overflow: "hidden", border: "1px solid var(--border)", aspectRatio: "4/3", backgroundColor: "var(--bg-secondary)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetImageUrl(asset)}
              alt={asset.filename}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              loading="lazy"
            />
            {/* Type badge */}
            <div style={{ position: "absolute", top: 4, left: 4, fontSize: 8, fontWeight: 600, backgroundColor: "rgba(0,0,0,0.55)", color: "#fff", padding: "2px 5px", borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {TYPE_LABEL[asset.asset_type] ?? asset.asset_type}
            </div>
            {/* Rank badge */}
            {i === 0 && (
              <div style={{ position: "absolute", top: 4, right: 4, fontSize: 8, fontWeight: 700, backgroundColor: "var(--accent)", color: "#fff", padding: "2px 5px", borderRadius: 3 }}>
                #1
              </div>
            )}
            {/* Score + resolution */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.6)", padding: "3px 6px" }}>
              <span style={{ fontSize: 9, color: "#fff", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {(asset.relevance_score * 100).toFixed(0)}% · {asset.resolution}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import type { Variant, LocalizeStats } from "@/lib/types";

const INV_COLORS: Record<string, string> = {
  in_stock:     "#10B981",
  low_stock:    "#F59E0B",
  out_of_stock: "#EF4444",
};

export function LocalizationCard({ variants, stats }: { variants: Variant[]; stats: LocalizeStats }) {
  const preview = variants.slice(0, 10);
  return (
    <div style={{ borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "var(--bg)", overflow: "hidden", fontSize: 13 }}>
      <div style={{ backgroundColor: "var(--agent-bg)", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--agent-border)" }}>
        <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Localization</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{stats.total_variants} variants · {stats.regions} regions · {stats.placements} placements</span>
      </div>

      {((stats.inventory_alerts?.length ?? 0) > 0 || (stats.price_alerts?.length ?? 0) > 0) && (
        <div style={{ padding: "8px 16px", backgroundColor: "#FFFBEB", borderBottom: "1px solid #FEF3C7", fontSize: 11, display: "flex", gap: 16 }}>
          {(stats.inventory_alerts?.length ?? 0) > 0 && <span style={{ color: "#F59E0B" }}>⚠ {stats.inventory_alerts.length} inventory alerts</span>}
          {(stats.price_alerts?.length ?? 0) > 0 && <span style={{ color: "#F59E0B" }}>⚠ {stats.price_alerts.length} price anomalies</span>}
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
              {["Region", "Placement", "SKU", "Price", "Inventory", "Headline"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((v) => (
              <tr key={v.variant_id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "8px 12px", fontWeight: 500, color: "var(--text-primary)" }}>{v.region}</td>
                <td style={{ padding: "8px 12px", color: "var(--text-muted)" }}>{v.placement}</td>
                <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "var(--text-muted)" }}>{v.sku_id}</td>
                <td style={{ padding: "8px 12px", color: "var(--text-primary)" }}>
                  ${v.regional_price.toFixed(2)}
                  {v.price_flag && <span style={{ marginLeft: 4, color: "#F59E0B", fontSize: 10 }}>⚠</span>}
                </td>
                <td style={{ padding: "8px 12px", color: INV_COLORS[v.inventory_status] ?? "var(--text-primary)", fontWeight: 500 }}>
                  {v.inventory_status.replace(/_/g, " ")}
                </td>
                <td style={{ padding: "8px 12px", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-secondary)" }}>{v.copy_headline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: "8px 16px", backgroundColor: "var(--bg-secondary)", fontSize: 11, color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
        Showing {preview.length} of {stats.total_variants} variants
      </div>
    </div>
  );
}

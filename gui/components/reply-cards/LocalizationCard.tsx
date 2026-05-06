import type { Variant, LocalizeStats } from "@/lib/types";

const INV_COLORS: Record<string, string> = {
  in_stock: "#5CB85C",
  low_stock: "#F0AD4E",
  out_of_stock: "#D9534F",
};

export function LocalizationCard({ variants, stats }: { variants: Variant[]; stats: LocalizeStats }) {
  const preview = variants.slice(0, 10);
  return (
    <div style={{ borderRadius: 8, border: "1px solid #E5E0D8", backgroundColor: "#fff", overflow: "hidden", fontSize: 13 }}>
      <div style={{ backgroundColor: "#E0F3F5", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#007B8A", fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>✦ Localization</span>
        <span style={{ fontSize: 11, color: "#6B6B6B" }}>{stats.total_variants} variants · {stats.regions} regions · {stats.placements} placements</span>
      </div>
      {((stats.inventory_alerts?.length ?? 0) > 0 || (stats.price_alerts?.length ?? 0) > 0) && (
        <div style={{ padding: "8px 16px", backgroundColor: "#FFFBEB", borderBottom: "1px solid #FEF3C7", fontSize: 11, display: "flex", gap: 16 }}>
          {(stats.inventory_alerts?.length ?? 0) > 0 && <span style={{ color: "#F0AD4E" }}>⚠ {stats.inventory_alerts.length} inventory alerts</span>}
          {(stats.price_alerts?.length ?? 0) > 0 && <span style={{ color: "#F0AD4E" }}>⚠ {stats.price_alerts.length} price anomalies</span>}
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F9F6F1", borderBottom: "1px solid #E5E0D8" }}>
              {["Region", "Placement", "SKU", "Price", "Inventory", "Headline"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#6B6B6B", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((v) => (
              <tr key={v.variant_id} style={{ borderBottom: "1px solid #E5E0D8" }}>
                <td style={{ padding: "8px 12px", fontWeight: 500 }}>{v.region}</td>
                <td style={{ padding: "8px 12px", color: "#6B6B6B" }}>{v.placement}</td>
                <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "#6B6B6B" }}>{v.sku_id}</td>
                <td style={{ padding: "8px 12px" }}>
                  ${v.regional_price.toFixed(2)}
                  {v.price_flag && <span style={{ marginLeft: 4, color: "#F0AD4E", fontSize: 10 }}>⚠</span>}
                </td>
                <td style={{ padding: "8px 12px", color: INV_COLORS[v.inventory_status] ?? "#2C2C2C" }}>
                  {v.inventory_status.replace(/_/g, " ")}
                </td>
                <td style={{ padding: "8px 12px", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.copy_headline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "8px 16px", backgroundColor: "#F9F6F1", fontSize: 11, color: "#6B6B6B", borderTop: "1px solid #E5E0D8" }}>
        Showing {preview.length} of {stats.total_variants} variants
      </div>
    </div>
  );
}

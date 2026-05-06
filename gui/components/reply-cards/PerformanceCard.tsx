"use client";
import type { Analysis } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function PerformanceCard({ analysis }: { analysis: Analysis }) {
  const channels = analysis.attribution.by_channel.slice(0, 5);
  const chartData = channels.map(c => ({ name: c.channel, roas: Number(c.roas.toFixed(1)) }));
  const forecast = analysis.forecast;
  const hasForecast = forecast.forecast_status === "success" && forecast.revenue;

  return (
    <div style={{ borderRadius: 8, border: "1px solid #E5E0D8", backgroundColor: "#fff", overflow: "hidden", fontSize: 13 }}>
      <div style={{ backgroundColor: "#E0F3F5", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#007B8A", fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>✦ Campaign Performance</span>
        <span style={{ fontSize: 11, color: "#6B6B6B" }}>{analysis.campaign_name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
        {[
          { label: "Revenue", value: `$${(analysis.totals.revenue / 1000).toFixed(0)}K` },
          { label: "Spend", value: `$${(analysis.totals.spend / 1000).toFixed(0)}K` },
          { label: "ROAS", value: `${analysis.totals.roas.toFixed(1)}x` },
          { label: "Conversions", value: analysis.totals.conversions.toLocaleString() },
        ].map(({ label, value }, i) => (
          <div key={label} style={{ padding: "12px 16px", borderRight: i < 3 ? "1px solid #E5E0D8" : undefined }}>
            <p style={{ fontSize: 11, color: "#6B6B6B", margin: 0 }}>{label}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#2C2C2C", margin: "2px 0 0 0" }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", margin: "0 0 8px 0" }}>ROAS by Channel</p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={chartData} barSize={28}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => [`${v}x`, "ROAS"]} />
            <Bar dataKey="roas" fill="#007B8A" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {hasForecast && forecast.revenue && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #E5E0D8", paddingTop: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", margin: "0 0 8px 0" }}>14-Day Forecast</p>
          <div style={{ display: "flex", gap: 24, fontSize: 12 }}>
            <div><span style={{ color: "#6B6B6B" }}>Predicted/day</span><br /><b>${(forecast.revenue.predicted / 1000).toFixed(0)}K</b></div>
            <div><span style={{ color: "#6B6B6B" }}>Range</span><br /><b>${(forecast.revenue.lower_bound / 1000).toFixed(0)}K – ${(forecast.revenue.upper_bound / 1000).toFixed(0)}K</b></div>
            <div><span style={{ color: "#6B6B6B" }}>Trend</span><br />
              <b style={{ color: forecast.revenue.trend_direction === "up" ? "#5CB85C" : "#D9534F" }}>
                {forecast.revenue.trend_direction === "up" ? "↑ Up" : forecast.revenue.trend_direction === "down" ? "↓ Down" : "→ Flat"}
              </b>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "8px 16px", backgroundColor: "#F9F6F1", fontSize: 11, color: "#6B6B6B", borderTop: "1px solid #E5E0D8" }}>
        Top channel: <b>{analysis.attribution.top_channel}</b>
      </div>
    </div>
  );
}

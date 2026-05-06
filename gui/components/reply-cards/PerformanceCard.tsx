"use client";
import type { Analysis } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function PerformanceCard({ analysis }: { analysis: Analysis }) {
  const channels = analysis.attribution.by_channel.slice(0, 5);
  const chartData = channels.map(c => ({ name: c.channel, roas: Number(c.roas.toFixed(1)) }));
  const forecast = analysis.forecast;
  const hasForecast = forecast.forecast_status === "success" && forecast.revenue;

  return (
    <div style={{ borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "var(--bg)", overflow: "hidden", fontSize: 13 }}>
      <div style={{ backgroundColor: "var(--agent-bg)", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--agent-border)" }}>
        <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Campaign Performance</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{analysis.campaign_name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: "1px solid var(--border)" }}>
        {[
          { label: "Revenue",     value: `$${(analysis.totals.revenue / 1000).toFixed(0)}K` },
          { label: "Spend",       value: `$${(analysis.totals.spend / 1000).toFixed(0)}K` },
          { label: "ROAS",        value: `${analysis.totals.roas.toFixed(1)}x` },
          { label: "Conversions", value: analysis.totals.conversions.toLocaleString() },
        ].map(({ label, value }, i) => (
          <div key={label} style={{ padding: "12px 16px", borderRight: i < 3 ? "1px solid var(--border)" : undefined }}>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{label}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: "2px 0 0 0", letterSpacing: "-0.5px" }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: 16, borderBottom: hasForecast ? "1px solid var(--border)" : undefined }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 8px 0" }}>ROAS by Channel</p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={chartData} barSize={28}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [`${v}x`, "ROAS"]} contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #E2E8F0" }} />
            <Bar dataKey="roas" fill="#0284C7" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {hasForecast && forecast.revenue && (
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 8px 0" }}>14-Day Forecast</p>
          <div style={{ display: "flex", gap: 24, fontSize: 12 }}>
            <div><span style={{ color: "var(--text-muted)" }}>Predicted/day</span><br /><b>${(forecast.revenue.predicted / 1000).toFixed(0)}K</b></div>
            <div><span style={{ color: "var(--text-muted)" }}>Range</span><br /><b>${(forecast.revenue.lower_bound / 1000).toFixed(0)}K – ${(forecast.revenue.upper_bound / 1000).toFixed(0)}K</b></div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Trend</span><br />
              <b style={{ color: forecast.revenue.trend_direction === "up" ? "#10B981" : forecast.revenue.trend_direction === "down" ? "#EF4444" : "var(--text-secondary)" }}>
                {forecast.revenue.trend_direction === "up" ? "↑ Up" : forecast.revenue.trend_direction === "down" ? "↓ Down" : "→ Flat"}
              </b>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "8px 16px", backgroundColor: "var(--bg-secondary)", fontSize: 11, color: "var(--text-muted)" }}>
        Top channel: <b style={{ color: "var(--text-primary)" }}>{analysis.attribution.top_channel}</b>
      </div>
    </div>
  );
}

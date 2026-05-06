"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { createCampaign } from "@/lib/api";

export function NewCampaignModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState("planned");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !brief.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const campaign = await createCampaign({ name: name.trim(), brief: brief.trim(), status });
      onClose();
      router.push(`/${campaign.code}`);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: "var(--bg)",
        borderRadius: 12,
        width: "100%",
        maxWidth: 520,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>New Campaign</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "3px 0 0 0" }}>A campaign code will be auto-generated</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, display: "flex", borderRadius: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px 24px" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              Campaign Name *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Summer Handbag Event"
              autoFocus
              style={{
                width: "100%", fontSize: 13, padding: "9px 12px",
                border: "1px solid var(--border)", borderRadius: 7,
                backgroundColor: "var(--bg)", color: "var(--text-primary)",
                outline: "none", boxSizing: "border-box", fontFamily: "inherit",
              }}
              onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              Campaign Brief *
            </label>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Describe the campaign objective, target audience, key products, timeline, and any creative direction…"
              rows={5}
              style={{
                width: "100%", fontSize: 13, padding: "9px 12px",
                border: "1px solid var(--border)", borderRadius: 7,
                backgroundColor: "var(--bg)", color: "var(--text-primary)",
                outline: "none", resize: "vertical", boxSizing: "border-box",
                fontFamily: "inherit", lineHeight: 1.6,
              }}
              onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
            />
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "5px 0 0 0" }}>
              This brief will be visible to all AI agents in the campaign thread.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                fontSize: 13, padding: "9px 12px",
                border: "1px solid var(--border)", borderRadius: 7,
                backgroundColor: "var(--bg)", color: "var(--text-primary)",
                outline: "none", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
            </select>
          </div>

          {error && (
            <p style={{ fontSize: 12, color: "#EF4444", marginBottom: 12 }}>{error}</p>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                fontSize: 13, fontWeight: 500, padding: "8px 16px",
                border: "1px solid var(--border)", borderRadius: 7,
                backgroundColor: "var(--bg)", color: "var(--text-secondary)",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !brief.trim() || loading}
              style={{
                fontSize: 13, fontWeight: 600, padding: "8px 20px",
                border: "none", borderRadius: 7,
                backgroundColor: name.trim() && brief.trim() && !loading ? "var(--accent)" : "var(--border)",
                color: name.trim() && brief.trim() && !loading ? "#fff" : "var(--text-muted)",
                cursor: name.trim() && brief.trim() && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit",
                transition: "background 0.15s",
              }}
            >
              {loading && <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />}
              {loading ? "Creating…" : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

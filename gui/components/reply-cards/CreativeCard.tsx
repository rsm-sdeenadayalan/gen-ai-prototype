import type { Photo } from "@/lib/types";

export function CreativeCard({ photos, query }: { photos: Photo[]; query: string }) {
  return (
    <div style={{ borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "var(--bg)", overflow: "hidden", fontSize: 13 }}>
      <div style={{ backgroundColor: "var(--agent-bg)", padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--agent-border)" }}>
        <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Creative Concepts</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>— {query}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, padding: 12 }}>
        {photos.slice(0, 6).map((photo, i) => (
          <div key={photo.id} style={{ position: "relative", borderRadius: 6, overflow: "hidden", aspectRatio: "4/3", backgroundColor: "var(--bg-secondary)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.thumb}
              alt={photo.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              loading="lazy"
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 8px 5px", background: "linear-gradient(transparent, rgba(0,0,0,0.65))" }}>
              <p style={{ fontSize: 9, color: "#fff", margin: 0, opacity: 0.85 }}>{photo.photographer}</p>
            </div>
            {i === 0 && (
              <span style={{ position: "absolute", top: 5, left: 5, fontSize: 8, fontWeight: 700, backgroundColor: "var(--accent)", color: "#fff", padding: "2px 6px", borderRadius: 3 }}>
                Hero candidate
              </span>
            )}
          </div>
        ))}
      </div>
      <div style={{ padding: "8px 16px", backgroundColor: "var(--bg-secondary)", fontSize: 11, color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
        {photos.length} concept images · AI-curated for campaign mood
      </div>
    </div>
  );
}

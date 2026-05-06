import type { Photo } from "@/lib/types";

export function CreativeCard({ photos, query }: { photos: Photo[]; query: string }) {
  return (
    <div style={{ borderRadius: 8, border: "1px solid #E5E0D8", backgroundColor: "#fff", overflow: "hidden", fontSize: 13 }}>
      <div style={{ backgroundColor: "#E0F3F5", padding: "8px 16px" }}>
        <span style={{ color: "#007B8A", fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>✦ Creative Concepts</span>
        <span style={{ fontSize: 11, color: "#6B6B6B", marginLeft: 8 }}>— {query}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, padding: 12 }}>
        {photos.slice(0, 6).map((photo, i) => (
          <div key={photo.id} style={{ position: "relative", borderRadius: 6, overflow: "hidden", aspectRatio: "4/3", backgroundColor: "#E0F3F5" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.thumb}
              alt={photo.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 6px", background: "linear-gradient(transparent, rgba(44,44,44,0.7))" }}>
              <p style={{ fontSize: 9, color: "#fff", margin: 0 }}>{photo.photographer}</p>
            </div>
            {i === 0 && (
              <span style={{ position: "absolute", top: 4, left: 4, fontSize: 8, backgroundColor: "#007B8A", color: "#fff", padding: "2px 6px", borderRadius: 3 }}>
                Hero candidate
              </span>
            )}
          </div>
        ))}
      </div>
      <div style={{ padding: "8px 16px", backgroundColor: "#F9F6F1", fontSize: 11, color: "#6B6B6B", borderTop: "1px solid #E5E0D8" }}>
        {photos.length} concept images · AI-curated for campaign mood
      </div>
    </div>
  );
}

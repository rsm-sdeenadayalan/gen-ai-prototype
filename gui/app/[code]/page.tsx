import Link from "next/link";
import { CampaignInbox } from "@/components/CampaignInbox";
import { WorkflowBar } from "@/components/WorkflowBar";
import { SKILL_META } from "@/lib/types";

export default async function CampaignOverview({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#F9F6F1" }}>
      <CampaignInbox activeCode={code} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header — campaign name loaded client-side via CampaignHeader */}
        <CampaignHeader code={code} />

        {/* Skill tiles */}
        <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
          <p style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
            AI-Assisted Workflow Steps
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {SKILL_META.map((skill) => (
              <Link
                key={skill.slug}
                href={`/${code}/${skill.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E0D8",
                  borderRadius: 10,
                  padding: 20,
                  cursor: "pointer",
                  transition: "box-shadow 0.15s, border-color 0.15s",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 28 }}>{skill.icon}</span>
                    <div>
                      <p style={{ fontSize: 10, color: "#007B8A", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                        Step {skill.workflowStep} · AI
                      </p>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#2C2C2C", margin: "2px 0 0 0" }}>
                        {skill.label}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0, lineHeight: 1.5 }}>
                    {skill.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 10, fontFamily: "monospace", color: "#6B6B6B", backgroundColor: "#F9F6F1", padding: "2px 6px", borderRadius: 4, border: "1px solid #E5E0D8" }}>
                      {skill.address}
                    </span>
                    <span style={{ fontSize: 12, color: "#007B8A", fontWeight: 600 }}>Open →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Thin client component to show campaign name in the header
import { CampaignOverviewHeader } from "@/components/CampaignOverviewHeader";

function CampaignHeader({ code }: { code: string }) {
  return <CampaignOverviewHeader code={code} />;
}

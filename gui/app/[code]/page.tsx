import { CampaignInbox } from "@/components/CampaignInbox";
import { CampaignOverviewHeader } from "@/components/CampaignOverviewHeader";
import { SkillCardGrid } from "@/components/SkillCardGrid";

export default async function CampaignOverview({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <CampaignInbox activeCode={code} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "var(--bg)" }}>
        <CampaignOverviewHeader code={code} />
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px" }}>
          <SkillCardGrid code={code} />
        </div>
      </div>
    </div>
  );
}

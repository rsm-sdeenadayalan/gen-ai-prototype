import { CampaignInbox } from "@/components/CampaignInbox";
import { CampaignWorkspace } from "@/components/CampaignWorkspace";

export default async function CampaignOverview({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <CampaignInbox activeCode={code} />
      <CampaignWorkspace code={code} />
    </div>
  );
}

import { CampaignInbox } from "@/components/CampaignInbox";
import { ThreadClient } from "@/components/ThreadClient";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#F9F6F1" }}>
      <CampaignInbox activeCode={code} />
      <ThreadClient code={code} />
    </div>
  );
}

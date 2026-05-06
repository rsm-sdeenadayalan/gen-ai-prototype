import { notFound } from "next/navigation";
import { CampaignInbox } from "@/components/CampaignInbox";
import { SkillThread } from "@/components/SkillThread";
import { SKILL_META } from "@/lib/types";

export default async function SkillPage({
  params,
}: {
  params: Promise<{ code: string; skill: string }>;
}) {
  const { code, skill } = await params;
  const skillMeta = SKILL_META.find((s) => s.slug === skill);
  if (!skillMeta) notFound();

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#F9F6F1" }}>
      <CampaignInbox activeCode={code} activeSkill={skill} />
      <SkillThread code={code} skillMeta={skillMeta} />
    </div>
  );
}

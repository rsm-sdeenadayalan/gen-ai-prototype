import type { Message } from "@/lib/types";
import { SegmentCard } from "./SegmentCard";
import { AssetGridCard } from "./AssetGridCard";
import { LocalizationCard } from "./LocalizationCard";
import { PerformanceCard } from "./PerformanceCard";
import { CreativeCard } from "./CreativeCard";

export function ReplyCard({ message }: { message: Message }) {
  const r = message.skill_result;
  if (!r) return null;

  if (message.skill_name === "segment" && "segments" in r)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <SegmentCard segments={(r as any).segments} brief={(r as any).brief ?? ""} />;

  if (message.skill_name === "dam" && "results" in r)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <AssetGridCard results={(r as any).results} stats={(r as any).stats} brief={(r as any).brief ?? ""} />;

  if (message.skill_name === "localize" && "variants" in r)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <LocalizationCard variants={(r as any).variants} stats={(r as any).stats} />;

  if (message.skill_name === "performance" && "analysis" in r)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <PerformanceCard analysis={(r as any).analysis} />;

  if (message.skill_name === "creative" && "photos" in r)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <CreativeCard photos={(r as any).photos} query={(r as any).query ?? ""} />;

  return null;
}

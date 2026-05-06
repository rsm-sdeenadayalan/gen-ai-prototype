export interface Campaign {
  code: string;
  name: string;
  status: "planned" | "active" | "completed";
  workflow_step: number;
  brief?: string | null;
  created_at: string;
}

export interface Message {
  id: number;
  campaign_code: string;
  from_persona: string;
  to_address: string | null;
  body: string;
  agent_narrative: string | null;
  skill_name: string | null;
  skill_result: Record<string, unknown> | null;
  created_at: string;
}

export interface ThreadResponse {
  campaign: Campaign;
  messages: Message[];
}

export interface Segment {
  name: string;
  definition: string;
  customer_count: number;
  avg_recency_days: number;
  avg_frequency: number;
  avg_monetary: number;
  top_category: string | null;
  top_category_lift: number;
  loyalty_mix: Record<string, number>;
}

export interface DamAsset {
  rank: number;
  asset_id: number;
  filename: string;
  asset_type: string;
  tags: string[];
  resolution: string;
  usage_rights: string;
  relevance_score: number;
  quality_flag: string;
}

export interface DamStats {
  total_searched: number;
  filtered_out: { degraded: number; expired_rights: number; low_resolution: number };
  filtered_total: number;
  kept: number;
  returned: number;
  avg_relevance: number;
}

export interface Variant {
  variant_id: string;
  region: string;
  placement: string;
  sku_id: number;
  sku_name: string;
  regional_price: number;
  master_price: number;
  price_difference_pct: number;
  inventory_status: string;
  copy_headline: string;
  price_flag?: string;
}

export interface LocalizeStats {
  total_variants: number;
  regions: number;
  placements: number;
  inventory_alerts: Array<{ sku_name: string; region: string; status: string }>;
  price_alerts: Array<{ sku_name: string; region: string; pct_diff: number }>;
}

export interface ChannelAttribution {
  channel: string;
  revenue: number;
  roas: number;
  rank: number;
}

export interface Analysis {
  campaign_name: string;
  totals: { revenue: number; spend: number; conversions: number; roas: number };
  attribution: {
    by_channel: ChannelAttribution[];
    by_segment: Array<{ segment: string; conversion_rate: number; lift_vs_avg: number }>;
    top_channel: string | null;
  };
  forecast: {
    forecast_status: string;
    revenue: { predicted: number; lower_bound: number; upper_bound: number; trend_direction: string } | null;
  };
  summary: string;
}

export interface Photo {
  id: string;
  url: string;
  thumb: string;
  alt: string;
  photographer: string;
}

export const AGENT_ADDRESSES = [
  { value: "segment.builder@macys-ai.com", label: "Segment Builder" },
  { value: "dam.finder@macys-ai.com", label: "DAM Asset Finder" },
  { value: "localize@macys-ai.com", label: "Localization Generator" },
  { value: "performance@macys-ai.com", label: "Performance Analyzer" },
  { value: "creative@macys-ai.com", label: "Creative Concepts" },
];

export const PERSONAS = [
  { value: "sarah", label: "Sarah — Campaign Manager" },
  { value: "priya", label: "Priya — Senior Designer" },
  { value: "diego", label: "Diego — Production Artist" },
  { value: "anna", label: "Anna — Marketing Analyst" },
];

export const PERSONA_COLORS: Record<string, string> = {
  sarah: "#007B8A",
  priya: "#8B5E3C",
  diego: "#5A6B3A",
  anna: "#7B3F6E",
};

export interface SkillMeta {
  slug: string;
  skillName: string;
  address: string;
  label: string;
  description: string;
  workflowStep: number;
}

export const SKILL_META: SkillMeta[] = [
  {
    slug: "segment",
    skillName: "segment",
    address: "segment.builder@macys-ai.com",
    label: "Audience Segmentation",
    description: "RFM k-means clustering across 50K customers — identify VIP, mid-tier, and lapsed segments",
    workflowStep: 2,
  },
  {
    slug: "dam",
    skillName: "dam",
    address: "dam.finder@macys-ai.com",
    label: "Creative Assets",
    description: "Filter & rank 5,000 DAM assets — strips degraded, expired, and low-res files automatically",
    workflowStep: 4,
  },
  {
    slug: "creative",
    skillName: "creative",
    address: "creative@macys-ai.com",
    label: "Creative Concepts",
    description: "Visual concept board — photo search matched to campaign mood and tone",
    workflowStep: 5,
  },
  {
    slug: "localize",
    skillName: "localize",
    address: "localize@macys-ai.com",
    label: "Localization",
    description: "Generate 40 regional variants — 10 US markets × 4 ad placements with regional pricing",
    workflowStep: 7,
  },
  {
    slug: "performance",
    skillName: "performance",
    address: "performance@macys-ai.com",
    label: "Performance & Forecast",
    description: "Channel attribution, ROAS, and 14-day revenue forecast",
    workflowStep: 9,
  },
];

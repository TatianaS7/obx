export interface OilOption {
  id: number;
  name: string;
  description: string;
  oil_type: string;
}

export interface SelectedOil {
  oil_id: number;
  oil_type: string;
  essential_dilution?: "STANDARD" | "INTENSE";
}

export interface ProfessionalBlendAllocation {
  blend_id: number | null;
  blend_name?: string;
  quantity: string;
}

export interface PremadeBlendOil {
  oil_id: number;
  oil_type: string;
  name: string;
}

export interface PremadeBlendSelection {
  blend_id: number | null;
  blend_name?: string;
  quantity: string;
  oils: PremadeBlendOil[];
}

export interface BlendData {
  name: string;
  description: string;
  oils: SelectedOil[];
  premade_blend_id?: number | null;
  professional_allocations?: ProfessionalBlendAllocation[];
  premade_blend_oils?: PremadeBlendSelection[];
}

export interface NewBlendCard {
  name: string;
  description: string;
  customer_tier: string;
  quantity: string;
  product_type: string;
  category: string;
  bottle_size: string;
  bottle_type: string;
}

export interface CreateBlendProps {
  newBlendCard: NewBlendCard;
  onChange: (data: BlendData) => void;
}

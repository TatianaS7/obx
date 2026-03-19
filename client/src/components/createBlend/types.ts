export interface OilOption {
  id: number;
  name: string;
  description: string;
  oil_type: string;
}

export interface SelectedOil {
  oil_id: number;
  oil_type: string;
}

export interface BlendData {
  name: string;
  description: string;
  oils: SelectedOil[];
}

export interface NewBlendCard {
  name: string;
  description: string;
  product_type: string;
  category: string;
  bottle_size: string;
  bottle_type: string;
}

export interface CreateBlendProps {
  newBlendCard: NewBlendCard;
  onChange: (data: BlendData) => void;
}

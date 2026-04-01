export interface Category {
  id: string;
  name: string;
  depreciation_rate: number;
  salvage_rate: number;
}

export interface Asset {
  id: string;
  name: string;
  tag_id: string;
  serial_number: string;
  description?: string;
  status: 'IN_STOCK' | 'ASSIGNED' | 'BROKEN' | 'MISSING' | 'DISPOSED';
  location: string;
  category?: { id: string; name: string };
  department?: { id: string; name: string };
  assigned_to?: { id: string; full_name: string };
  purchase_cost?: number;
  purchase_date?: string;
  warranty_expiry?: string;
  current_value?: number;
  accumulated_depreciation?: number;
  disposal_value?: number;
  disposal_date?: string;
  disposal_reason?: string;
}

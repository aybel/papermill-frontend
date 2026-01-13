export interface SupplierContact {
  id?: number;
  supplier_id?: number;
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  position?: string;
  department?: string;
  is_primary: boolean;
  is_active: boolean;
  notes?: string;
}

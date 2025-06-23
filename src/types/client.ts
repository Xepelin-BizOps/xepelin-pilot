
export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: 'billing' | 'shipping' | 'main';
}

export interface BillingData {
  id: string;
  businessName: string;
  rfc: string;
  taxRegime: string;
  useCFDI: string;
  email: string;
  phone: string;
}

export interface Contact {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  whatsapp?: string;
  isPrimary: boolean;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  status: 'active' | 'inactive' | 'prospect';
  createdAt: string;
  lastContact: string;
  addresses: Address[];
  billingData: BillingData;
  contacts: Contact[];
  notes?: string;
}

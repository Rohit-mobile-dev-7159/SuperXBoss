export type loginApiPayload = {
  mobile: string;
};

export interface CustomerUpdateInput {
  customerId: string;
  type: 'customer' | 'b2b';

  // Fields required conditionally
  first_name?: string;
  last_name?: string;
  refer_code?: string;
  refrence_code?: string;

  business_type?: string;
  business_name?: string;
  gst_number?: string;
  business_contact_no?: string;

  // Always required
  state: string;
  language: string;

  // Optional fields
  email?: string;
  profile?: Record<string, any>; // You can make this more specific if the profile shape is known
}

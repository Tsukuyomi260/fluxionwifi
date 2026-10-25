export interface User {
  id: string;
  username: string;
  email: string;
  network_name: string;
  phone: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  username: string;
  password: string;
  profile_id: string;
  price: number;
  currency: string;
  status: "available" | "sold" | "expired" | "used";
  seller_id?: string;
  sold_at?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  duration: string;
  data_limit?: string;
  speed_limit?: string;
  device_limit?: number;
  price: number;
  currency: string;
}

export interface Router {
  id: string;
  name: string;
  ip_address: string;
  dns_name?: string;
  routeros_version: "v6" | "v7";
  status: "online" | "offline" | "unknown";
  last_seen?: string;
}

export interface Sale {
  id: string;
  ticket_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  aggregator?: string;
  seller_id?: string;
  customer_phone?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  created_at: string;
}

export interface PortalConfig {
  id: string;
  network_name: string;
  contact_phone: string;
  admin_email: string;
  theme: string;
  color_primary: string;
  color_secondary: string;
  color_accent: string;
  images: string[];
  payment_aggregators: PaymentAggregator[];
  sale_mode: "seller" | "direct" | "otp";
  identification_mode: "simple" | "sms" | "otp";
}

export interface PaymentAggregator {
  name: string;
  enabled: boolean;
  api_key?: string;
  secret_key?: string;
}

export interface Seller {
  id: string;
  name: string;
  phone: string;
  commission_rate: number;
  total_sales: number;
  balance: number;
  status: "active" | "suspended";
}

export type Currency =
  | "XOF"
  | "XAF"
  | "GNF"
  | "CDF"
  | "GHS"
  | "KES"
  | "NGN"
  | "TZS"
  | "UGX"
  | "GMD";

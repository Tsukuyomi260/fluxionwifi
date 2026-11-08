export type RouterStatus = "online" | "offline" | "warning";
export type RouterZone = "sud" | "nord" | "est" | "ouest" | "centre";
export type PortalStatus = "active" | "inactive" | "draft";
export type AuthMethod = "ticket" | "free" | "mobile_money" | "social";
export type TicketStatus = "available" | "active" | "used" | "expired";
export type SellerStatus = "active" | "inactive" | "suspended";
export type TransactionType = "sale" | "withdrawal" | "commission" | "refund" | "topup";
export type TransactionStatus = "completed" | "pending" | "failed";
export type TunnelStatus = "connected" | "disconnected" | "connecting";
export type VpnProtocol = "WireGuard" | "SSTP";
export type SupportPriority = "low" | "medium" | "high";
export type SupportStatus = "open" | "in_progress" | "resolved" | "closed";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  company: string;
  network_name: string;
  avatar_url: string;
  language: string;
  timezone: string;
  ticket_format: string;
  auto_print: boolean;
  sms_enabled: boolean;
  api_key: string;
  webhook_url: string;
  webhook_events: string[];
  notif_email_sales: boolean;
  notif_email_connections: boolean;
  notif_email_routers: boolean;
  notif_email_billing: boolean;
  notif_email_security: boolean;
  notif_email_updates: boolean;
  notif_push_offline: boolean;
  notif_push_sales: boolean;
  notif_push_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface Router {
  id: string;
  owner_id: string;
  name: string;
  ip_address: string;
  api_port: number;
  model: string;
  identity: string;
  zone: RouterZone;
  location: string;
  status: RouterStatus;
  roaming_enabled: boolean;
  cpu_usage: number;
  memory_usage: number;
  uptime: string;
  clients_connected: number;
  last_sync: string | null;
  last_seen: string | null;
  created_at: string;
  updated_at: string;
}

export interface Portal {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  status: PortalStatus;
  theme_name: string;
  theme_color: string;
  auth_methods: AuthMethod[];
  logo_url: string;
  background_url: string;
  title: string;
  subtitle: string;
  button_text: string;
  redirect_url: string;
  terms_url: string;
  ad_banner_url: string;
  ad_link: string;
  language: string;
  border_radius: number;
  total_connections: number;
  created_at: string;
  updated_at: string;
}

export interface TicketProfile {
  id: string;
  owner_id: string;
  name: string;
  duration: string;
  price: number;
  speed_limit: string;
  device_limit: number;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  owner_id: string;
  profile_id: string;
  seller_id: string | null;
  code: string;
  status: TicketStatus;
  used_at: string | null;
  expires_at: string | null;
  device_mac: string;
  router_id: string | null;
  created_at: string;
  // joined
  profile?: TicketProfile;
  seller?: Seller;
}

export interface Seller {
  id: string;
  owner_id: string;
  name: string;
  phone: string;
  location: string;
  status: SellerStatus;
  commission_rate: number;
  total_assigned: number;
  total_sold: number;
  total_revenue: number;
  stock_remaining: number;
  last_active: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  owner_id: string;
  type: TransactionType;
  label: string;
  description: string;
  amount: number;
  status: TransactionStatus;
  method: string;
  ticket_id: string | null;
  seller_id: string | null;
  created_at: string;
}

export interface Session {
  id: string;
  owner_id: string;
  ticket_id: string | null;
  router_id: string | null;
  device_mac: string;
  device_name: string;
  ip_address: string;
  bytes_in: number;
  bytes_out: number;
  started_at: string;
  ended_at: string | null;
  is_active: boolean;
}

export interface VpnTunnel {
  id: string;
  owner_id: string;
  name: string;
  protocol: VpnProtocol;
  status: TunnelStatus;
  server_ip: string;
  local_ip: string;
  port: number;
  public_key: string;
  router_id: string | null;
  uptime: string;
  last_seen: string | null;
  bytes_in: number;
  bytes_out: number;
  created_at: string;
  updated_at: string;
  router?: Router;
}

export interface SupportTicket {
  id: string;
  owner_id: string;
  subject: string;
  description: string;
  category: string;
  priority: SupportPriority;
  status: SupportStatus;
  attachment_url: string;
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_type: "user" | "agent" | "bot";
  message: string;
  attachment_url: string;
  created_at: string;
}

export interface StockAssignment {
  id: string;
  owner_id: string;
  seller_id: string;
  profile_id: string;
  quantity: number;
  type: "assign" | "return";
  created_at: string;
  seller?: Seller;
  profile?: TicketProfile;
}

export interface Affiliation {
  id: string;
  referrer_id: string;
  referred_id: string | null;
  referred_email: string;
  status: "pending" | "active" | "inactive";
  plan: string;
  total_earned: number;
  created_at: string;
}

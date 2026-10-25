import { ComingSoon } from "@/components/dashboard/coming-soon";
import { Shield } from "lucide-react";

export default function VpnPage() {
  return <ComingSoon title="VPN & Accès distant" description="Configurez des tunnels VPN WireGuard ou SSTP pour accéder à vos routeurs à distance en toute sécurité." icon={Shield} />;
}

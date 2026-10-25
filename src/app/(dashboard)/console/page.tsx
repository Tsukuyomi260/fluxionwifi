import { ComingSoon } from "@/components/dashboard/coming-soon";
import { Terminal } from "lucide-react";

export default function ConsolePage() {
  return <ComingSoon title="Console RADIUS" description="Administrez votre serveur FreeRADIUS. Gérez les utilisateurs, sessions actives et paramètres réseau." icon={Terminal} />;
}

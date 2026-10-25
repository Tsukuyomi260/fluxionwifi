import { ComingSoon } from "@/components/dashboard/coming-soon";
import { Construction } from "lucide-react";

export default function IntegrationPage() {
  return <ComingSoon title="Mon Intégration" description="Suivez les étapes de configuration de votre zone WiFi : routeur, paiement, portail captif et premiers tickets." icon={Construction} />;
}

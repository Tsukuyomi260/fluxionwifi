import { ComingSoon } from "@/components/dashboard/coming-soon";
import { Wallet } from "lucide-react";

export default function BalancePage() {
  return <ComingSoon title="Mon Solde" description="Consultez votre solde en temps réel, l'historique de vos transactions et effectuez des retraits vers votre compte Mobile Money." icon={Wallet} />;
}

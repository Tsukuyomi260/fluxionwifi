import { ComingSoon } from "@/components/dashboard/coming-soon";
import { Receipt } from "lucide-react";

export default function BillingPage() {
  return <ComingSoon title="Facturation" description="Gérez votre abonnement FLUXIONWIFI, consultez vos factures et téléchargez vos reçus." icon={Receipt} />;
}

// Catalogue de tutoriels (interface seulement : les vidéos seront branchées au back-end).

export type Theme = "Prise en main" | "Ventes et tickets" | "Portail captif" | "Routeurs et réseau" | "Compte, argent et aide" | "Vos clients";
export type Audience = "Promoteur" | "Technicien réseau" | "Revendeur" | "Client final";

export interface Tutorial {
  id: string;
  title: string;
  theme: Theme;
  duration: string; // m:ss
  steps: number;
  audience: Audience[];
  description: string;
  views: number;
  isNew?: boolean;
  featured?: boolean;
}

const P: Audience[] = ["Promoteur"];
const PT: Audience[] = ["Promoteur", "Technicien réseau"];
const C: Audience[] = ["Client final"];

// [titre, thème, durée, étapes, public, description, vues, drapeaux]
type Row = [string, Theme, string, number, Audience[], string, number, string?];

const ROWS: Row[] = [
  ["La page de statut de connexion", "Portail captif", "3:14", 5, ["Client final", "Promoteur"], "Ouvrir la page de statut, lire son temps et ses données restants, et la préparer côté gérant.", 0, "new,featured"],
  ["La console 2 (mode manuel MikHmon)", "Ventes et tickets", "3:12", 5, P, "Télécharger MikHmon personnalisé, importer ses tickets, régler les profils, voir le stock et les tickets en transit.", 0],
  ["La console 3 (MikHmon VPN)", "Ventes et tickets", "3:05", 5, P, "Profils et tickets créés en direct sur le routeur par le tunnel, réimpression, inventaire façon MikHmon.", 0],
  ["La console 4 (mode FAI)", "Ventes et tickets", "3:18", 5, P, "Couvrir des promoteurs, prélèvement, encaissement, espace promoteur, partenaires FAI et tickets.", 0],
  ["FLUXION Console (mode Serveur RADIUS)", "Ventes et tickets", "3:27", 5, P, "La console 1 : raccourcis, profils, tickets, impression, tickets en ligne, stock et inventaire.", 46],
  ["La publicité sur votre portail", "Portail captif", "3:09", 5, P, "Activer la publicité dynamique, vendre l'emplacement à un commerce, offrir des minutes.", 42],
  ["Changer d'agrégateur et mettre à jour le Walled Garden", "Portail captif", "3:47", 6, P, "Passer d'un agrégateur à un autre, mettre à jour le Walled Garden, vérifier par un achat d'essai.", 27],
  ["Souscrire une licence FLUXIONWIFI", "Compte, argent et aide", "5:17", 7, P, "Licences Identité, Services et Intégrale : déposer le dossier en 4 étapes, payer et renouveler.", 48],
  ["Console MikHmon : vue par routeur et passerelle", "Routeurs et réseau", "2:24", 4, P, "Suivre un routeur à la fois et le relier au VPN en un clic, sans script.", 12],
  ["MikHmon VPN : un routeur, puis l'interopérabilité", "Routeurs et réseau", "3:46", 6, PT, "Connecter un premier routeur, vendre, en ajouter un second, activer l'interopérabilité du parc.", 27],
  ["Créer ses affiches avec FLUXION Studio", "Ventes et tickets", "5:03", 7, P, "Affiches, bâches et statuts WhatsApp à votre nom : style, lumière, format, export, annonce vidéo.", 77],
  ["Activer le portail en ligne", "Portail captif", "3:02", 5, P, "Votre portail hébergé à une adresse à votre nom, le routeur en secours : réserver le nom, publier.", 26],
  ["Lier votre compte d'agrégateur de paiement", "Portail captif", "3:37", 6, P, "Copier vos clés, déclarer le webhook, les coller dans l'onglet Paiement et encaisser chez vous.", 17],
  ["Routeurs indépendants : une offre propre à un routeur", "Routeurs et réseau", "3:35", 6, P, "Rendre un routeur indépendant : ses profils, ses revendeurs, son portail, puis le détacher.", 0],
  ["Choisir son mode d'intégration", "Prise en main", "2:16", 4, P, "Manuel, Serveur RADIUS ou MikHmon VPN : où naissent les tickets et lequel choisir.", 22],
  ["Envoyer le ticket par SMS", "Ventes et tickets", "2:01", 4, P, "Activer l'envoi par SMS, choisir qui paie le SMS, recharger ses crédits.", 0],
  ["Installer l'application FLUXIONWIFI", "Prise en main", "2:25", 4, ["Promoteur", "Revendeur"], "Android, iPhone par Safari, ordinateur Windows ou navigateur.", 0],
  ["Le bonus fidélité client", "Ventes et tickets", "2:02", 4, P, "Paliers de cumul, activation, section du portail et parcours du client jusqu'au ticket offert.", 0],
  ["Le menu Maintenance en détail", "Routeurs et réseau", "2:09", 4, P, "Les familles d'opérations, la fenêtre de confirmation, les quatre plus utiles.", 0],
  ["Le mode manuel MikHmon", "Ventes et tickets", "2:19", 4, P, "Installer MikHmon personnalisé, importer ses tickets, régler profils, Walled Garden et portail.", 0],
  ["Les agents IA de FLUXIONWIFI", "Prise en main", "2:07", 4, P, "Ce qu'ils font, leur parler, la confirmation avant toute action, le crédit d'usage.", 0],
  ["MikHmon en ligne", "Routeurs et réseau", "2:05", 4, P, "Ouvrir MikHmon depuis le menu d'un routeur, déjà connecté : générer, imprimer, suivre les ventes.", 0],
  ["Mon solde : comprendre et retirer son argent", "Compte, argent et aide", "2:17", 4, P, "Lire Mon Solde, compléter son profil de retrait, demander un retrait.", 0],
  ["Ouvrir ses antennes à distance", "Routeurs et réseau", "2:10", 4, P, "Ouvrir la page d'une antenne par le tunnel, lire son état, le lien sécurisé de 30 min.", 0],
  ["Passer ses tickets en mode RADIUS", "Ventes et tickets", "2:16", 4, P, "Le principe du serveur RADIUS, le choix du mode, le coordinateur.", 0],
  ["Personnaliser son portail captif", "Portail captif", "2:12", 5, P, "Nom, contact, infos, couleurs, images et modèle du portail, puis la publication.", 0],
  ["Plusieurs sources Internet (Multi-WAN)", "Routeurs et réseau", "2:24", 4, P, "Box + 4G sur un routeur : secours ou répartition, quotas par source.", 0],
  ["Recharger son solde et payer avec", "Compte, argent et aide", "2:04", 4, P, "Recharger par Mobile Money, noter son code, payer ses services avec le solde.", 0],
  ["Réinstaller un routeur à distance", "Routeurs et réseau", "2:20", 4, P, "Réinitialiser l'intégration, réinstaller ou effacer en gardant tickets et profils.", 0],
  ["Se connecter sur un ordinateur ou une télévision", "Vos clients", "1:45", 4, C, "Ordinateur portable, télévision, changer d'appareil avec le même ticket.", 0],
  ["Suivre ses ventes et ses rapports", "Ventes et tickets", "2:04", 4, P, "L'inventaire de la console : période, ventes par profil et par routeur, export CSV et PDF.", 0],
  ["Ticket payé non reçu : le retrouver", "Vos clients", "1:34", 3, C, "Voir mon ticket sur le même téléphone, ou « Ticket payé non reçu ? » avec la référence du SMS.", 0],
  ["WinBox en ligne", "Routeurs et réseau", "2:10", 4, PT, "Ouvrir WebFig d'un routeur depuis la console, déjà connecté et sans VPN.", 0],
  ["Diagnostic global et maintenance d'un routeur", "Routeurs et réseau", "4:02", 6, PT, "Examiner un routeur à distance, lire sa note sur 100, appliquer le plan de maintenance.", 106],
  ["Acheter un ticket par Mobile Money", "Vos clients", "1:45", 4, C, "Choisir son forfait, payer par Mobile Money, recevoir son ticket et se connecter.", 0],
  ["Créer ses profils, tarifs et durées", "Ventes et tickets", "2:27", 4, P, "Durée, validité, débit, quota et prix d'un forfait ; ordre et masquage sur le portail.", 0],
  ["L'espace revendeur pas à pas", "Ventes et tickets", "1:57", 4, ["Revendeur"], "Ouvrir sa page de vente, vendre un ticket ou un lot, suivre et rembourser son crédit.", 0],
  ["Le Walled Garden : sites accessibles sans ticket", "Portail captif", "2:09", 4, P, "Ce qu'il contient, ce qu'il ne faut jamais y mettre, comment le garder au minimum.", 0],
  ["Ajouter un équipement dans FLUXION VPN", "Prise en main", "3:23", 6, PT, "Routeur, antennes, ordinateurs : tout joignable à distance, la topologie expliquée.", 71],
  ["Comprendre la facturation FLUXIONWIFI", "Compte, argent et aide", "3:06", 6, P, "Solde, formules, services et prix, la fenêtre d'achat, droits actifs et historique.", 41],
  ["Gagner de l'argent avec une zone Wi‑Fi", "Prise en main", "2:45", 5, P, "Le principe des tickets, un calcul d'exemple, trois façons de vendre, les pièges à éviter.", 25],
  ["Intégrer le paiement Mobile Money dans votre portail", "Portail captif", "3:16", 5, PT, "Copier le code, ou importer votre login.html : vos tarifs et le bouton Payer dans votre portail.", 37],
  ["L'interopérabilité multi-routeurs", "Routeurs et réseau", "3:04", 6, PT, "Un seul stock de tickets : espaces, déblocage, ajout d'un routeur.", 26],
  ["La vente partenaire et les revendeurs", "Ventes et tickets", "2:59", 6, ["Promoteur", "Revendeur"], "Créer un revendeur, partager son accès, sa vente, son crédit et votre suivi.", 61],
  ["Mettre à jour son portail captif à la main", "Portail captif", "2:59", 6, PT, "Télécharger, décompresser, importer dans WinBox et activer le bon dossier.", 25],
  ["Ouvrir un ticket d'assistance", "Compte, argent et aide", "2:56", 6, ["Promoteur", "Client final"], "Décrire son souci en 4 étapes, gratuit ou prioritaire, puis suivre sa demande.", 17],
  ["Parrainer et toucher 10 %", "Compte, argent et aide", "2:21", 5, P, "Partager son lien, suivre ses filleuls et ses gains, puis retirer par Mobile Money.", 102],
  ["Se connecter au Wi‑Fi avec un ticket", "Vos clients", "1:19", 2, C, "En 2 étapes : choisir le réseau, saisir son code. Et si ça ne marche pas.", 23],
  ["Vendre ses tickets par Mobile Money", "Ventes et tickets", "2:27", 5, P, "Le client paie sur la page de connexion, le ticket se crée seul, l'argent vous revient.", 26],
  ["Intégrer son routeur en mode automatique", "Prise en main", "3:03", 5, P, "Une seule commande à coller dans WinBox : l'agent installeur fait le reste.", 40],
];

export const FREE_TUTORIALS: Tutorial[] = ROWS.map((r, i) => ({
  id: `T${String(i + 1).padStart(2, "0")}`,
  title: r[0],
  theme: r[1],
  duration: r[2],
  steps: r[3],
  audience: r[4],
  description: r[5],
  views: r[6],
  isNew: r[7]?.includes("new"),
  featured: r[7]?.includes("featured"),
}));

export const GETTING_STARTED_IDS = [
  "Choisir son mode d'intégration",
  "Ajouter un équipement dans FLUXION VPN",
  "Créer ses profils, tarifs et durées",
  "Vendre ses tickets par Mobile Money",
  "Suivre ses ventes et ses rapports",
];

export interface TechTutorial {
  id: string;
  title: string;
  desc: string;
  topic: string;
  minutes: string;
  steps: number;
  length: string;
  soon?: boolean;
}

export const TECH_TUTORIALS: TechTutorial[] = [
  { id: "X1", title: "Accéder à la page d'administration d'un équipement réseau avec un ordinateur", desc: "Injecteur PoE, adresse d'usine, IP fixe sous Windows, alerte du navigateur, première connexion — et les trois pièges du terrain.", topic: "Antennes", minutes: "5 min", steps: 6, length: "3:38" },
  { id: "X2", title: "Accéder à la page d'administration d'un équipement réseau avec un téléphone", desc: "WiFiman, Fing et UISP, Wi-Fi de l'antenne, adresse fixe sur Android et iPhone, alerte du navigateur — et les trois pièges du terrain.", topic: "Antennes", minutes: "5 min", steps: 5, length: "2:55" },
  { id: "X3", title: "Configurer des routeurs en PPPoE", desc: "Serveur PPPoE, forfaits et débits, comptes des abonnés, routeur client et dépannage.", topic: "Configuration", minutes: "5 min", steps: 7, length: "4:37" },
  { id: "X4", title: "Configurer un routeur MikroTik de A à Z", desc: "De la boîte au premier client connecté : bridge, Internet, Wi-Fi, Hotspot, test et sauvegarde.", topic: "Configuration", minutes: "5 min", steps: 7, length: "5:13" },
  { id: "X5", title: "Configurer une antenne en mode point d'accès (AP)", desc: "Mode pont, adresse de gestion fixe, WDS, nom de liaison, 20 MHz, fréquence choisie au balayage, WPA2, Test/Apply.", topic: "Antennes", minutes: "6 min", steps: 6, length: "3:40" },
  { id: "X6", title: "Configurer une antenne en mode station", desc: "Mode pont, adresse fixe, Station + WDS, balayage et verrou sur le point d'accès, clé, alignement au signal.", topic: "Antennes", minutes: "6 min", steps: 6, length: "3:14" },
  { id: "S1", title: "Hotspot MikroTik : réglages avancés", desc: "Configuration", topic: "Configuration", minutes: "", steps: 0, length: "", soon: true },
  { id: "S2", title: "Pointer et aligner une antenne", desc: "Antennes", topic: "Antennes", minutes: "", steps: 0, length: "", soon: true },
  { id: "S3", title: "Diagnostiquer une coupure réseau", desc: "Diagnostic", topic: "Diagnostic", minutes: "", steps: 0, length: "", soon: true },
  { id: "S4", title: "Sauvegarder, restaurer et mettre à jour RouterOS", desc: "Maintenance", topic: "Maintenance", minutes: "", steps: 0, length: "", soon: true },
  { id: "S5", title: "Sécuriser son routeur MikroTik", desc: "Sécurité", topic: "Sécurité", minutes: "", steps: 0, length: "", soon: true },
];

export function toSeconds(d: string): number {
  const [m, s] = d.split(":").map(Number);
  return m * 60 + s;
}

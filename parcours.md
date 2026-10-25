# Parcours Utilisateur — Fluxion WiFi

> **Ton :** Vouvoiement systématique dans toute l'interface.  
> Exemples : "Bienvenue sur votre tableau de bord", "Connectez-vous à votre compte", "Votre solde actuel"

---

## 1. Inscription & Onboarding

### 1.1 Inscription
1. L'utilisateur arrive sur la page d'inscription
2. Champs : Nom complet, Email, Téléphone, Pays, Mot de passe, Confirmation
3. Bouton "Créer mon compte"
4. Email de vérification envoyé
5. Clic sur le lien → compte activé

### 1.2 Première connexion — Assistant d'intégration
1. **Étape 1 — Bienvenue** : "Bienvenue sur Fluxion WiFi ! Configurons votre espace en quelques étapes."
2. **Étape 2 — Votre réseau** : Nom du réseau WiFi, pays d'exploitation, devise (auto selon pays)
3. **Étape 3 — Votre routeur** : Choix type (MikroTik v6 / v7), IP publique ou VPN, identifiants API
4. **Étape 4 — Paiement** : Choisir un agrégateur Mobile Money (FedaPay, CinetPay, etc.), entrer les clés API
5. **Étape 5 — Portail captif** : Choisir un thème parmi les modèles, personnaliser logo + couleurs
6. **Étape 6 — Premiers tickets** : Créer 2-3 profils de tickets (1h, 24h, 7 jours) avec prix
7. **Étape 7 — Terminé** : Récapitulatif + bouton "Accéder à mon tableau de bord"

> Chaque étape peut être ignorée et complétée plus tard. Barre de progression visible.

---

## 2. Dashboard principal

### Ce que l'utilisateur voit après connexion :
- **4 cartes statistiques** (style DealDeck) :
  - Ventes aujourd'hui (nombre + variation %)
  - Revenu du mois (montant en devise locale + variation %)
  - Tickets actifs (nombre en temps réel)
  - Routeurs en ligne (nombre + indicateur vert/rouge)
- **Graphique barres** : Revenus des 7 derniers jours
- **Graphique donut** : Répartition par type de ticket
- **Activité récente** : Dernières ventes / connexions

### Navigation sidebar (sections)
```
PRINCIPAL
  ├── Tableau de bord
  ├── Portail Captif
  └── Tickets

OPÉRATIONS
  ├── Console RADIUS
  ├── Vendeurs
  └── VPN

FINANCIER
  ├── Mon Solde
  ├── Facturation
  └── Interopérabilité

OUTILS
  ├── Studio
  ├── Support
  ├── Tutoriels
  └── Affiliation

BAS DE SIDEBAR
  ├── Paramètres
  └── Upgrade Pro (si plan gratuit)
```

---

## 3. Parcours — Vente de tickets WiFi

### Flux complet :
1. **Créer des profils de tickets** (Tickets → Profils)
   - Nom : "1 Heure", "24 Heures", "7 Jours"
   - Durée, débit max, prix
   - Devise automatique selon pays

2. **Générer des tickets** (Tickets → Générer)
   - Choisir profil, quantité
   - Tickets générés avec codes uniques
   - Option : imprimer / exporter PDF / partager WhatsApp

3. **Vendre** (automatique ou via vendeurs)
   - **Automatique** : Client scanne QR sur portail captif → paie via Mobile Money → reçoit code
   - **Manuel** : Vendeur sélectionne ticket → vend au client → marque comme vendu
   - **En ligne** : Client achète directement sur le portail captif

4. **Suivi** (Dashboard + Mon Solde)
   - Chaque vente apparaît en temps réel
   - Solde mis à jour instantanément
   - Notifications de vente

---

## 4. Parcours — Configuration Portail Captif

1. **Choisir un thème** (Portail Captif → Thèmes)
   - 7+ thèmes prédéfinis
   - Prévisualisation en temps réel (desktop + mobile)

2. **Personnaliser** (Studio)
   - Logo, couleurs, textes d'accueil
   - Message de bienvenue (vouvoiement)
   - Conditions d'utilisation
   - Publicités optionnelles

3. **Lier au routeur** (Portail Captif → Configuration)
   - Sélectionner routeur
   - Appliquer le portail
   - Tester la redirection

---

## 5. Parcours — Gestion des vendeurs

1. **Ajouter un vendeur** (Vendeurs → Ajouter)
   - Nom, téléphone, localisation
   - Attribuer un stock de tickets

2. **Suivi vendeur** (Vendeurs → Liste)
   - Tickets attribués vs vendus
   - Revenus générés par vendeur
   - Historique des attributions

3. **Notifications vendeur**
   - Stock bas → alerte
   - Vente réalisée → notification admin

---

## 6. Parcours — Finances

### Consulter son solde (Mon Solde)
- Solde disponible en gros
- Historique des transactions (filtrable par date, type)
- Bouton "Retirer" vers compte Mobile Money

### Facturation (Facturation)
- Abonnement plateforme Fluxion WiFi
- Historique factures
- Télécharger PDF

### Interopérabilité (Interopérabilité)
- Configurer les agrégateurs de paiement
- Clés API par agrégateur
- Tester la connexion
- Voir les transactions par agrégateur

---

## 7. Parcours — Console RADIUS

1. **Vue d'ensemble** : Utilisateurs connectés, sessions actives
2. **Gestion utilisateurs** : Ajouter/modifier/supprimer des profils RADIUS
3. **Logs** : Historique des connexions, durées, consommation data
4. **Paramètres** : Serveur RADIUS, ports, secret partagé

---

## 8. Parcours — VPN & Accès distant

1. **Configurer VPN** : WireGuard ou SSTP
2. **Connecter un routeur distant** : Générer config VPN, appliquer sur routeur
3. **Monitorer** : Statut connexion VPN, latence, uptime

---

## 9. Parcours — Affiliation

1. **Générer son lien** : Lien unique d'affiliation
2. **Partager** : WhatsApp, Facebook, copier lien
3. **Suivi** : Nombre de filleuls, revenus générés
4. **Gains** : 20% de commission sur chaque abonnement référé
5. **Retrait** : Vers compte Mobile Money

---

## 10. Messages clés de l'interface (vouvoiement)

| Contexte                | Message                                              |
|-------------------------|------------------------------------------------------|
| Bienvenue dashboard     | "Bienvenue sur votre tableau de bord"                |
| Connexion               | "Connectez-vous à votre compte"                      |
| Inscription             | "Créez votre compte Fluxion WiFi"                    |
| Vente réussie           | "Vente enregistrée avec succès"                      |
| Erreur formulaire       | "Veuillez vérifier les champs en rouge"              |
| Solde bas               | "Votre solde est bas. Rechargez pour continuer."     |
| Routeur hors ligne      | "Votre routeur est actuellement hors ligne"          |
| Ticket expiré           | "Ce ticket a expiré"                                 |
| Confirmation action     | "Êtes-vous sûr de vouloir continuer ?"               |
| Succès configuration    | "Votre configuration a été enregistrée"              |
| Bienvenue onboarding    | "Bienvenue ! Configurons votre espace ensemble."     |
| Upgrade                 | "Passez à Fluxion Pro pour débloquer toutes les fonctionnalités" |

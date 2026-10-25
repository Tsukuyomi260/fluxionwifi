# Charte Graphique — Fluxion WiFi

## 1. Palette de couleurs

### Couleurs principales (inspirées du logo)

| Rôle              | Nom             | Hex       | Usage                                      |
|-------------------|-----------------|-----------|---------------------------------------------|
| Primaire          | Bleu Fluxion    | `#2B7FFF` | Boutons, liens, éléments actifs, sidebar active |
| Primaire foncé    | Navy Fluxion    | `#0B1E4D` | Texte sur fond clair du branding, hover boutons |
| Primaire clair    | Bleu pâle       | `#EBF2FF` | Fond des icônes, badges, états hover légers  |

### Couleurs de fond

| Rôle              | Hex       | Usage                                      |
|-------------------|-----------|---------------------------------------------|
| Fond page         | `#F5F7FA` | Arrière-plan général du dashboard           |
| Fond carte        | `#FFFFFF` | Cartes, modals, panels                      |
| Fond sidebar      | `#FFFFFF` | Sidebar navigation (fond blanc, clean)      |
| Fond input        | `#FFFFFF` | Champs de formulaire                        |
| Bordure carte     | `#E8ECF1` | Bordures subtiles des cartes                |
| Bordure input     | `#D1D5DB` | Bordures champs de saisie                   |

### Couleurs de texte

| Rôle              | Hex       | Usage                                      |
|-------------------|-----------|---------------------------------------------|
| Texte principal   | `#1A1D26` | Titres, valeurs importantes                 |
| Texte corps       | `#374151` | Paragraphes, descriptions                   |
| Texte secondaire  | `#6B7280` | Labels, sous-titres, placeholders           |
| Texte désactivé   | `#9CA3AF` | Éléments inactifs                           |

### Couleurs d'état

| Rôle    | Hex       | Fond léger  | Usage                                    |
|---------|-----------|-------------|------------------------------------------|
| Succès  | `#10B981` | `#ECFDF5`   | Confirmation, routeur en ligne, paiement OK |
| Erreur  | `#EF4444` | `#FEF2F2`   | Erreurs, routeur hors ligne, échec paiement |
| Warning | `#F59E0B` | `#FFFBEB`   | Attention, solde bas, expiration proche   |
| Info    | `#2B7FFF` | `#EBF2FF`   | Informations, notifications générales     |

### Couleurs graphiques (charts, donut, barres)

| Série   | Hex       | Usage                       |
|---------|-----------|-----------------------------|
| Série 1 | `#2B7FFF` | Donnée principale (ventes, revenus) |
| Série 2 | `#0B1E4D` | Donnée secondaire           |
| Série 3 | `#93C5FD` | Donnée tertiaire            |
| Série 4 | `#C7D2FE` | Donnée complémentaire       |

---

## 2. Typographie

| Élément           | Font         | Taille  | Poids    |
|-------------------|-------------|---------|----------|
| H1 (page title)   | Inter       | 24px    | Bold 700 |
| H2 (section)      | Inter       | 18px    | Semi 600 |
| H3 (carte title)  | Inter       | 16px    | Semi 600 |
| Body              | Inter       | 14px    | Regular 400 |
| Small / caption    | Inter       | 12px    | Regular 400 |
| Valeur stat        | Inter       | 28px    | Bold 700 |
| Label stat         | Inter       | 13px    | Medium 500 |
| Bouton             | Inter       | 14px    | Medium 500 |

---

## 3. Composants — Style

### Cartes (inspiré DealDeck)
- Fond : blanc `#FFFFFF`
- Bordure : `1px solid #E8ECF1`
- Border-radius : `16px`
- Padding : `24px`
- Shadow : `0 1px 3px rgba(0,0,0,0.04)`
- Pas de shadow forte — style flat et aéré

### Cartes statistiques
- Icône dans un cercle coloré (fond pâle + icône couleur vive)
- Valeur en gros (28px bold)
- Label en dessous (13px, gris secondaire)
- Badge variation (+X% / -X%) en vert ou rouge, petit, arrondi

### Sidebar
- Fond blanc
- Largeur : 260px
- Items : padding 12px 16px, border-radius 12px
- Item actif : fond `#2B7FFF`, texte blanc
- Item inactif : texte `#6B7280`, hover fond `#F5F7FA`
- Sections séparées par label gris uppercase (MENU, FINANCIER, OUTILS)
- Logo Fluxion WiFi en haut
- Bloc "Upgrade Pro" en bas (optionnel, pour plan premium)

### Boutons
- Primaire : fond `#2B7FFF`, texte blanc, border-radius 10px, h-40px
- Primaire hover : fond `#1A6BE6`
- Secondaire : fond blanc, bordure `#D1D5DB`, texte `#374151`
- Danger : fond `#EF4444`, texte blanc
- Disabled : opacity 50%

### Inputs
- Hauteur : 40px
- Border : `1px solid #D1D5DB`
- Border-radius : 10px
- Focus : border `#2B7FFF`, ring `0 0 0 3px #2B7FFF20`
- Placeholder : `#9CA3AF`

### Badges / Tags
- Border-radius : 20px (pill)
- Padding : 4px 12px
- Font-size : 12px
- Variations : couleur de fond pâle + texte couleur vive

---

## 4. Layout

### Desktop (≥1024px)
- Sidebar fixe à gauche (260px)
- Header avec nom réseau + avatar + notifications
- Contenu : grille responsive, max-width fluide
- Gap entre cartes : 20px
- Padding contenu : 24px

### Mobile (<1024px)
- Sidebar masquée (hamburger menu)
- Bottom navigation (5 items : Dashboard, Portail, Tickets, Solde, Plus)
- Cartes empilées en colonne
- Padding contenu : 16px

---

## 5. Iconographie
- Bibliothèque : Lucide React
- Taille standard : 20px dans sidebar, 24px dans cartes stat
- Style : outline (stroke), pas filled
- Icônes dans cercles colorés pour les stats (fond pâle 40x40px)

---

## 6. Mode sombre (futur)
- Prévu mais pas prioritaire
- Le design actuel est 100% light mode
- Variables CSS prêtes pour basculer

---

## 7. Référence visuelle
- Inspiré du design "DealDeck Sales Report" (dashboard SaaS moderne)
- Éléments clés repris : cartes stats avec icônes rondes, graphiques barres/donut, sidebar sectionnée, fond gris clair, style aéré
- Adapté au contexte WiFi / Mobile Money / Afrique

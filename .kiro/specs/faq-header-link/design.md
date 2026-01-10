# Design Document

## Overview

Ajout d'un lien FAQ dans le header et enrichissement significatif du contenu de la FAQ. L'objectif est de créer une FAQ complète et rassurante qui répond à toutes les interrogations des futurs clients et améliore le référencement SEO/IA.

## Architecture

Modification de deux fichiers existants :
- `eolia-frontend/src/components/layout/Header.tsx` - ajout du lien
- `eolia-frontend/src/pages/FAQ.tsx` - enrichissement des questions

## Components and Interfaces

### Header.tsx

Modification du tableau `navLinks` pour inclure la FAQ :

```typescript
const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/calculateur', label: 'Calculateur' },
  { to: '/produits', label: 'Gamme Tulipe' },
  { to: '/faq', label: 'FAQ' },  // Nouveau
  { to: '/espace-client', label: 'Espace Client' },
]
```

### FAQ.tsx - Nouvelles questions à ajouter

La FAQ existante contient déjà 18 questions. On ajoute les questions suivantes avec un ton rassurant et orienté accompagnement :

#### Catégorie "installation" - Questions sur la connexion

| Question | Réponse (ton rassurant) |
|----------|------------------------|
| Comment connecter ma Tulipe à mon installation électrique ? | Rassurez-vous, c'est plus simple qu'il n'y paraît ! L'éolienne se raccorde via un onduleur qui convertit le courant continu en courant alternatif compatible avec votre installation. L'onduleur se connecte ensuite à votre tableau électrique. Un électricien qualifié réalise cette opération en quelques heures. Notre équipe vous accompagne pour trouver un installateur près de chez vous si besoin. |
| L'installation nécessite-t-elle de gros travaux ? | Bonne nouvelle : l'installation d'une Tulipe ne nécessite pas de travaux lourds ! Il faut prévoir une fondation béton pour le mât (environ 1m²), le passage d'un câble jusqu'à votre tableau électrique, et c'est tout. Pas besoin de modifier votre toiture ou votre façade. La plupart des installations sont terminées en 1 à 2 jours. |
| Puis-je installer l'éolienne sur mon toit ? | Nous déconseillons l'installation sur toiture pour plusieurs raisons : les vibrations peuvent se transmettre à la structure, le vent y est souvent plus turbulent, et l'accès pour la maintenance est compliqué. Un mât au sol ou sur un poteau dédié offre de bien meilleures performances et une durée de vie optimale. Contactez-nous pour étudier ensemble la meilleure implantation sur votre terrain. |


#### Catégorie "product" - Questions sur les batteries et la sécurité

| Question | Réponse (ton rassurant) |
|----------|------------------------|
| Puis-je ajouter une batterie pour stocker l'électricité ? | Absolument ! Notre système est 100% compatible avec les batteries de stockage domestiques (Tesla Powerwall, BYD, Huawei, etc.). Vous pouvez ainsi stocker l'énergie produite la nuit ou par vent fort pour l'utiliser quand vous en avez besoin. C'est la solution idéale pour maximiser votre autonomie. Nous pouvons vous conseiller sur le dimensionnement adapté à votre consommation. |
| Est-ce dangereux d'avoir une éolienne chez soi ? | Soyez rassuré : nos éoliennes Tulipe sont conçues pour une sécurité maximale. Elles fonctionnent en basse tension (48V), ce qui élimine tout risque d'électrocution. Le système de freinage automatique arrête les pales en cas de vent trop fort. Les pales en composite sont légères et ne peuvent pas blesser en cas de contact accidentel. Toutes nos installations sont certifiées conformes aux normes électriques françaises (Consuel). |
| Que se passe-t-il en cas de tempête ? | Pas d'inquiétude ! L'éolienne Tulipe est équipée d'un système de freinage automatique qui ralentit puis stoppe les pales lorsque le vent dépasse 25 m/s (90 km/h). Elle est conçue pour résister à des vents de 180 km/h en position arrêtée. En 10 ans, nous n'avons jamais eu de dommage lié aux tempêtes sur nos installations. |
| L'éolienne peut-elle gêner mes voisins ? | La Tulipe est l'une des éoliennes les plus silencieuses du marché : moins de 35 dB à 5 mètres, soit moins qu'une conversation à voix basse. Son design vertical élimine l'effet stroboscopique (ombres portées) qui peut gêner avec les éoliennes horizontales. La plupart de nos clients nous disent que leurs voisins ne remarquent même pas qu'elle tourne ! |
| L'éolienne fonctionne-t-elle la nuit ? | Bien sûr ! Contrairement aux panneaux solaires, l'éolienne produit de l'électricité 24h/24 tant qu'il y a du vent. C'est d'ailleurs souvent la nuit que le vent est le plus régulier. Combinée à une batterie, vous pouvez ainsi couvrir vos besoins même pendant les heures creuses. |
| Quelle est la production réelle d'une éolienne domestique ? | La production dépend principalement du vent sur votre site. En moyenne, une Tulipe 3kW produit entre 3000 et 6000 kWh par an selon l'exposition. C'est l'équivalent de 30 à 60% de la consommation d'un foyer moyen. Notre calculateur en ligne vous donne une estimation personnalisée basée sur les données météo de votre commune. N'hésitez pas à nous contacter pour affiner cette estimation. |

#### Catégorie "admin" - Questions sur les démarches

| Question | Réponse (ton rassurant) |
|----------|------------------------|
| Quelles sont les démarches administratives à effectuer ? | On vous accompagne à chaque étape ! Les démarches sont simples : 1) Déclaration préalable en mairie (formulaire Cerfa, nous vous aidons à le remplir), 2) Attestation Consuel après installation (votre électricien s'en charge), 3) Demande de raccordement si vous souhaitez revendre le surplus. Comptez 2 à 3 mois au total. Notre équipe reste disponible pour répondre à vos questions tout au long du processus. |
| Faut-il prévenir mes voisins avant d'installer une éolienne ? | Ce n'est pas obligatoire légalement, mais nous vous conseillons d'en discuter avec eux par courtoisie. La plupart des voisins sont curieux et enthousiastes ! Vous pouvez leur montrer notre documentation sur le niveau sonore et l'esthétique. En cas de questions, n'hésitez pas à nous mettre en contact avec eux, nous serons ravis de les rassurer. |
| Mon terrain est-il adapté à une éolienne ? | Chaque terrain est unique ! Les critères importants sont : une exposition au vent dominant (généralement ouest/sud-ouest en France), peu d'obstacles à proximité (arbres, bâtiments), et un espace suffisant pour le mât. Notre service de prêt d'anémomètre vous permet de mesurer le vent réel sur votre terrain pendant 1 mois. C'est gratuit et sans engagement. Contactez-nous pour en bénéficier ! |


#### Catégorie "order" - Questions sur l'achat

| Question | Réponse (ton rassurant) |
|----------|------------------------|
| Quel est le retour sur investissement ? | En moyenne, nos clients amortissent leur installation en 8 à 12 ans, selon leur consommation et le potentiel éolien de leur site. Avec la hausse continue des prix de l'électricité, ce délai tend à se réduire. Et surtout, une fois amorti, vous produisez de l'électricité gratuite pendant encore 15 ans minimum ! Nous pouvons vous faire une simulation personnalisée. |
| Proposez-vous un service d'installation ? | Oui ! Nous travaillons avec un réseau d'installateurs partenaires formés à nos produits dans toute la France. Vous pouvez aussi choisir votre propre électricien : nous lui fournissons toute la documentation technique nécessaire. Dans tous les cas, notre équipe technique reste joignable pour accompagner l'installation. |
| Que comprend la garantie ? | Notre garantie est l'une des plus complètes du marché : 5 ans sur les pales et composants mécaniques, 10 ans sur l'alternateur, 2 ans sur l'onduleur. En cas de problème, nous intervenons rapidement. Les pièces détachées sont garanties disponibles pendant 15 ans. Vous êtes entre de bonnes mains ! |

#### Catégorie "maintenance" - Questions sur l'entretien

| Question | Réponse (ton rassurant) |
|----------|------------------------|
| L'éolienne nécessite-t-elle beaucoup d'entretien ? | Très peu ! Un simple contrôle visuel annuel (état des pales, fixations, câbles) suffit. Pas de lubrification nécessaire grâce aux roulements étanches. Comptez 30 minutes par an. Si vous préférez déléguer, nous proposons des contrats de maintenance à partir de 150€/an. |
| Que faire si l'éolienne s'arrête de tourner ? | Pas de panique ! Vérifiez d'abord le disjoncteur dédié et l'onduleur. Si tout semble normal, contactez notre support technique : nous pouvons diagnostiquer la plupart des problèmes à distance. En cas de besoin, nous organisons une intervention rapide. Notre taux de panne est inférieur à 2% par an. |

### Ton général des réponses

Chaque réponse doit :
- Commencer par rassurer ("Rassurez-vous", "Pas d'inquiétude", "Bonne nouvelle", "Soyez rassuré", "Absolument !")
- Expliquer clairement et simplement
- Terminer par une invitation à contacter l'équipe ("Contactez-nous", "Notre équipe reste disponible", "N'hésitez pas à nous appeler")

## Data Models

Pas de nouveau modèle. On utilise l'interface `FAQItem` existante :

```typescript
interface FAQItem {
  question: string
  answer: string
  category: Category
}
```

## Error Handling

Pas de gestion d'erreur spécifique - il s'agit de contenu statique.

## Testing Strategy

Test manuel :
1. Vérifier que le lien FAQ apparaît dans le header desktop et mobile
2. Vérifier que toutes les nouvelles questions s'affichent correctement
3. Vérifier le filtrage par catégorie
4. Vérifier la recherche avec les nouveaux contenus

# Implementation Plan

- [x] 1. Setup projet et structure de base



  - [x] 1.1 Initialiser le projet frontend React/Vite/TypeScript



    - Créer le projet avec `npm create vite@latest eolia-frontend -- --template react-ts`
    - Installer les dépendances: tailwindcss, lucide-react, recharts, framer-motion, react-router-dom, aws-amplify, @stripe/react-stripe-js
    - Configurer Tailwind avec la charte Green Tech (#065f46)
    - _Requirements: 1.1, 1.3_
  - [x] 1.2 Créer la structure de dossiers frontend


    - Créer les dossiers: components/, pages/, context/, services/, data/, types/, config/
    - Créer les sous-dossiers: components/layout/, components/calculator/, components/shop/, components/ambassador/
    - _Requirements: 1.1_

  - [x] 1.3 Initialiser le projet backend Serverless

    - Créer le dossier eolia-backend avec serverless.yml basé sur Hydrolia
    - Configurer les 7 tables DynamoDB, Cognito, S3, API Gateway
    - Installer les dépendances: @aws-sdk/*, uuid, stripe, jsonwebtoken
    - _Requirements: 11.1, 11.2_

- [x] 2. Layout et navigation





  - [x] 2.1 Créer le composant Header avec navigation


    - Logo EOLIA, menu: Accueil, Calculateur, Gamme Tulipe, Diagnostic, Espace Client
    - Menu mobile responsive (hamburger)
    - _Requirements: 1.2, 1.4_
  - [x] 2.2 Créer le composant Footer


    - Liens légaux, contact, réseaux sociaux
    - _Requirements: 1.4_
  - [x] 2.3 Configurer React Router avec toutes les routes


    - Routes publiques et protégées
    - _Requirements: 1.2_

- [x] 3. Page d'accueil




  - [x] 3.1 Créer la page Home avec hero section


    - Hero avec image/vidéo éolienne Tulipe, CTA "Découvrir" et "Calculer ma production"
    - Sections: avantages, comment ça marche, témoignages
    - _Requirements: 1.1_

- [x] 4. Calculateur de production




  - [x] 4.1 Créer les fichiers de données JSON


    - windData.json avec les 12 départements (données vent mensuelles)
    - turbineModels.json avec la courbe de puissance Tulipe
    - _Requirements: 2.1, 2.3_
  - [x] 4.2 Implémenter le calculatorService.ts


    - Fonction d'interpolation linéaire sur la courbe de puissance
    - Scaling linéaire selon la puissance kWc choisie
    - Calcul du Scaling Factor si données anémomètre fournies
    - Bonus grappe +5% si plusieurs éoliennes
    - _Requirements: 2.3, 2.4, 2.6_
  - [x] 4.3 Créer le composant CalculatorForm


    - Select département, select puissance, input nombre d'éoliennes
    - Champs optionnels: vitesse anémomètre (m/s), mois de mesure
    - Bouton "Calculer"
    - _Requirements: 2.1, 2.2, 2.6_
  - [x] 4.4 Créer le composant ResultsDisplay


    - Affichage production annuelle (kWh), économie (€)
    - Indication si données anémomètre utilisées
    - _Requirements: 2.5_
  - [x] 4.5 Créer le composant ProductionChart avec recharts


    - Graphique barres des 12 mois
    - _Requirements: 2.5_

  - [x] 4.6 Assembler la page Calculator

    - Intégrer form, résultats, graphique
    - CTA vers boutique ou anémomètre
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 5. Boutique et catalogue






  - [x] 5.1 Créer le fichier products.json avec le catalogue

    - 5 éoliennes Tulipe (1, 2, 3, 5, 10 kWc) avec prix placeholder
    - 3 forfaits pose (<30m, 30-60m, 60-100m)
    - Onduleurs IMEON/Fronius (placeholder)
    - Pièces détachées (pales, mâts, fixations)
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6_
  - [x] 5.2 Créer le composant ProductCard


    - Image, nom, prix, specs, bouton "Ajouter au panier"
    - _Requirements: 3.2_

  - [x] 5.3 Créer la page Products (catalogue)

    - Filtres par catégorie (éoliennes, onduleurs, accessoires, forfaits)
    - Grille de ProductCards
    - _Requirements: 3.1_

  - [x] 5.4 Créer la page ProductDetail

    - Détails complets, specs, galerie images
    - Sélecteur quantité, ajout panier
    - _Requirements: 3.2_
  - [x] 5.5 Créer la page Partners (IMEON/Fronius)


    - Présentation des partenaires onduleurs
    - Avantages: IA, batteries 20 ans
    - _Requirements: 3.7_

- [x] 6. Panier et checkout



  - [x] 6.1 Créer le CartContext


    - State: items, addItem, removeItem, updateQuantity, clearCart
    - Persistance localStorage
    - Calcul total avec vérification limite 36 kWc
    - _Requirements: 9.1, 3.4_

  - [x] 6.2 Créer le composant CartSidebar

    - Liste des items, quantités, sous-total
    - Bouton "Commander"
    - Message si >36 kWc: "Nous consulter"
    - _Requirements: 9.1, 3.4_

  - [x] 6.3 Créer la page Cart

    - Vue complète du panier
    - _Requirements: 9.1_
  - [x] 6.4 Créer le composant CheckoutForm


    - Formulaire: adresse, type installation (mono/tri), puissance compteur, distance TGBT
    - Validation et calcul forfait pose
    - _Requirements: 3.5_


  - [x] 6.5 Intégrer Stripe PaymentForm
    - PaymentElement Stripe
    - Mention conditions suspensives

    - _Requirements: 9.2, 3.6_
  - [x] 6.6 Créer la page Checkout complète


    - Récapitulatif, formulaire, paiement
    - _Requirements: 3.5, 3.6, 9.2_

- [x] 7. Tunnel anémomètre






  - [x] 7.1 Créer la page Anemometer

    - Explication du prêt gratuit (1 mois, caution 100€)
    - Formulaire de commande simplifié
    - Mention "Bon de retour prépayé inclus"
    - _Requirements: 4.1, 4.2_

  - [x] 7.2 Implémenter le paiement caution Stripe

    - PaymentIntent de 100€
    - Stockage commande type "anemometer_loan"
    - _Requirements: 4.2, 4.3_

- [x] 8. Authentification

  - [x] 8.1 Configurer AWS Amplify côté frontend


    - aws-config.ts avec Cognito User Pool
    - _Requirements: 6.1_
  - [x] 8.2 Créer le AuthContext


    - State: user, isAuthenticated, signIn, signOut, signUp
    - Intégration Amplify Auth
    - _Requirements: 6.1_

  - [x] 8.3 Créer les pages Login et Register

    - Formulaires avec validation
    - Gestion erreurs (email existant, etc.)
    - _Requirements: 6.1_


  - [x] 8.4 Créer la page ConfirmAccount
    - Saisie code de vérification email

    - _Requirements: 6.1_

  - [x] 8.5 Créer le composant ProtectedRoute

    - Redirection si non authentifié
    - _Requirements: 6.1_

- [x] 9. Backend Auth Lambda


  - [x] 9.1 Créer la fonction register
    - Création user Cognito + création affiliate B2C automatique
    - _Requirements: 6.1, 6.3, 7.1_
  - [x] 9.2 Créer les fonctions login, confirmSignUp, getMe




    - Authentification Cognito
    - _Requirements: 6.1_

- [x] 10. Espace client (Dashboard)






  - [x] 10.1 Créer la page Dashboard

    - Infos personnelles, modification profil
    - Liste des adresses
    - Historique commandes
    - _Requirements: 6.2_
  - [x] 10.2 Créer le composant AddressForm


    - Ajout/modification adresse
    - _Requirements: 6.2_

- [x] 11. Backend Orders et Addresses


  - [x] 11.1 Créer les fonctions addresses (CRUD)


    - createAddress, getAddresses, updateAddress, deleteAddress, setDefault
    - _Requirements: 6.2_

  - [x] 11.2 Créer les fonctions orders

    - createOrder, getOrders
    - Gestion type standard et anemometer_loan
    - _Requirements: 9.2, 4.3_

  - [x] 11.3 Créer la fonction createPaymentIntent


    - Intégration Stripe
    - _Requirements: 9.2_

- [x] 12. Programme ambassadeur B2C






  - [x] 12.1 Créer la page Ambassador

    - Présentation du programme, avantages
    - Dashboard si connecté: code parrainage, stats, récompenses
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 12.2 Créer les composants ambassador

    - AmbassadorCodeCard, ReferralsList, RewardsProgress
    - _Requirements: 7.3_

- [x] 13. Programme ambassadeur B2B



  - [x] 13.1 Créer la page B2BRegistration


    - Formulaire: entreprise, SIRET, contact
    - Affichage grille commissions
    - Validation et signature contrat
    - _Requirements: 8.1_

  - [x] 13.2 Créer le composant ContractPreview

    - Aperçu du contrat avant signature
    - _Requirements: 8.2_

  - [x] 13.3 Créer les composants CommissionsTable et CommissionTiers


    - Historique commissions, paliers
    - _Requirements: 8.3, 8.4_

- [x] 14. Backend Affiliates







  - [x] 14.1 Créer les fonctions affiliates

    - registerB2B, getProfile, validateCode
    - _Requirements: 8.1_


  - [x] 14.2 Créer les fonctions referrals
    - createManual, getReferrals

    - _Requirements: 8.4_

  - [x] 14.3 Créer la fonction getCommissions

    - _Requirements: 8.4_
  - [x] 14.4 Créer la Lambda Python generateContract

    - Génération PDF avec fpdf2
    - Upload S3
    - _Requirements: 8.2_

- [x] 15. Pages informatives




  - [x] 15.1 Créer la page HowItWorks



    - Explication technologie éolienne verticale
    - _Requirements: 10.1_
  - [x] 15.2 Créer la page ConsuelProcess



    - Processus raccordement Enedis et Consuel
    - _Requirements: 10.1_
  - [x] 15.3 Créer la page FAQ



    - Questions/réponses avec filtres
    - _Requirements: 10.1_
  - [x] 15.4 Créer la page Diagnostic



    - Formulaire multi-étapes: localisation, support, environnement, hauteur
    - Récapitulatif et CTA contact
    - _Requirements: 5.1, 5.2_
  - [x] 15.5 Créer les pages légales



    - CGV, MentionsLegales, CookiePolicy
    - _Requirements: 10.1_
  - [x] 15.6 Créer le composant CookieBanner


    - Bandeau RGPD avec gestion consentement
    - _Requirements: 10.2_

- [x] 16. Backend notifications




  - [x] 16.1 Créer la fonction sendEmail

    - Templates: confirmation commande, confirmation inscription
    - Intégration AWS SES
    - _Requirements: 6.1, 9.2_

- [x] 17. Tests et validation



  - [x] 17.1 Tester le calculateur avec différentes configurations
    - Vérifier les calculs de production
    - _Requirements: 2.3, 2.4, 2.6_
  - [x] 17.2 Tester le parcours commande complet



    - Panier → Checkout → Paiement Stripe test
    - _Requirements: 9.2_

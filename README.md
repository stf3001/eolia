# EOLIA - Plateforme E-commerce Éoliennes Domestiques

Plateforme web complète pour la vente d'éoliennes domestiques verticales de la gamme Tulipe.

## 🌬️ Fonctionnalités

- **Calculateur de production** - Estimation de la production éolienne par département avec données anémomètre optionnelles, sauvegarde des simulations
- **Boutique en ligne** - Catalogue éoliennes Tulipe (1-10 kWc), onduleurs, accessoires
- **Tunnel de commande** - Checkout avec Stripe, forfaits pose, limite 36 kWc
- **Prêt d'anémomètre** - Location 1 mois avec caution 100€
- **Espace client** - Dashboard optimisé (anémomètre & simulations mis en avant), gestion adresses, historique commandes
- **Programme ambassadeur** - B2C (parrainage) et B2B (commissions)
- **Pages informatives** - FAQ, processus Consuel, diagnostic

## 🏗️ Architecture

```
eolia-frontend/     # React + Vite + TypeScript + Tailwind
eolia-backend/      # Serverless Framework + AWS Lambda + DynamoDB
.kiro/specs/        # Documentation spec-driven development
```

## 🚀 Stack Technique

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts (graphiques)
- Stripe Elements
- AWS Amplify (auth)

### Backend
- Serverless Framework
- AWS Lambda (Node.js 20 + Python 3.11)
- DynamoDB (7 tables)
- Cognito (authentification)
- S3 (contrats PDF)
- SES (emails)
- Stripe (paiements)

## 📦 Installation

### Frontend
```bash
cd eolia-frontend
npm install
npm run dev
```

### Backend
```bash
cd eolia-backend
npm install
serverless deploy --stage dev
```

## 🔧 Configuration

Créer les fichiers `.env` avec :

### Frontend (.env)
```
VITE_API_URL=https://xxx.execute-api.eu-west-1.amazonaws.com
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
VITE_COGNITO_USER_POOL_ID=eu-west-1_xxx
VITE_COGNITO_CLIENT_ID=xxx
```

### Backend (.env)
```
STRIPE_SECRET_KEY=sk_test_xxx
```

## 📄 License

Propriétaire - EOLIA SAS

# Portfolio Moderne - Instructions Copilot

## 📋 Informations du Projet

**Type de projet** : Portfolio Full Stack
**Framework** : Next.js 14 avec Page Router
**Base de données** : SQLite avec Prisma ORM
**Styling** : Tailwind CSS + Framer Motion
**Animations** : AOS (Animate On Scroll)

## 🎯 Objectif

Portfolio moderne pour développeur logiciel avec :
- ✅ Design contemporain et responsive
- ✅ Animations fluides et interactives
- ✅ Interface d'administration complète
- ✅ Base de données SQLite avec Prisma
- ✅ Formulaire de contact fonctionnel
- ✅ Optimisations SEO et performance

## 🛠️ Stack Technique

### Frontend
- React 18 avec TypeScript
- Next.js 14 (Page Router)
- Tailwind CSS pour le styling
- Framer Motion pour les animations
- AOS pour les animations de scroll
- Lucide React pour les icônes

### Backend
- Next.js API Routes
- Prisma ORM
- SQLite (base de données)
- Authentification JWT
- Validation des formulaires

### Développement
- TypeScript avec configuration stricte
- ESLint avec règles Next.js
- Hot reload avec Turbopack
- Prisma Studio pour la base de données

## 📁 Structure

```
src/
├── components/     # Composants React réutilisables
├── pages/          # Pages Next.js (Page Router)
├── lib/            # Utilitaires (Prisma, auth)
└── types/          # Types TypeScript
```

## 🧑‍💻 Règle d'architecture admin

Toutes les pages du back-office (sous `/admin`) doivent toujours inclure le composant `AdminSidebar` pour garantir une navigation cohérente et une expérience utilisateur optimale dans l'administration.

## 🚀 Commandes Importantes

- `npm run dev` - Serveur de développement
- `npx prisma studio` - Interface base de données
- `npm run build` - Build de production

## 🎨 Design System

**Couleurs principales :**
- Primary: Purple (purple-500 à purple-600)  
- Secondary: Blue (blue-500 à blue-600)
- Background: Slate (slate-900, slate-800)

**Animations :**
- AOS pour les entrées en scroll
- Framer Motion pour les interactions
- Transitions fluides sur tous les éléments

## 📋 Fonctionnalités Complétées

- [x] Configuration Next.js avec TypeScript
- [x] Schéma Prisma avec modèles complets
- [x] Composants UI modernes et responsives
- [x] Animations AOS et Framer Motion
- [x] API de contact fonctionnelle
- [x] Seeding de base de données
- [x] Build et déploiement optimisés
- [x] Documentation complète

## 🔧 Configuration Admin

**Accès admin par défaut :**
- Email: admin@portfolio.dev
- Mot de passe: admin123

**Interface admin pour :**
- Gestion des projets
- Gestion des compétences
- Gestion des expériences
- Consultation des messages

## 📈 Optimisations

- SSG (Static Site Generation) avec revalidation
- Optimisation automatique des images Next.js
- Code splitting automatique
- CSS optimisé avec Tailwind
- Métadonnées SEO complètes

---

**Status : ✅ Projet complété et fonctionnel**
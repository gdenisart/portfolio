# 🚀 Portfolio Moderne - Développeur Full Stack

Un portfolio moderne et interactif construit avec **Next.js**, **React**, **TypeScript**, **Prisma**, et **SQLite**. Conçu avec une esthétique contemporaine et des animations fluides pour présenter vos projets et compétences de manière professionnelle.

## ✨ Fonctionnalités

### 🎨 Interface Utilisateur
- **Design moderne et responsive** avec Tailwind CSS
- **Animations fluides** avec AOS (Animate On Scroll) et Framer Motion
- **Thème sombre élégant** avec des dégradés purple/blue
- **Navigation intuitive** avec scroll smooth
- **Optimisé mobile** avec design responsive

### 🛠️ Technologies
- **Frontend** : React 18, Next.js 14 (Page Router), TypeScript
- **Styling** : Tailwind CSS, Framer Motion
- **Backend** : Next.js API Routes
- **Base de données** : SQLite avec Prisma ORM
- **Animations** : AOS, Framer Motion
- **Icons** : Lucide React

### 📱 Sections du Portfolio
1. **Hero** - Présentation principale avec CTA
2. **À propos** - Description personnelle et statistiques
3. **Compétences** - Technologies maîtrisées avec niveaux
4. **Projets** - Showcase des réalisations avec liens
5. **Expérience** - Parcours professionnel en timeline
6. **Contact** - Formulaire de contact fonctionnel

## 🚀 Démarrage rapide

### Installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configuration environnement**
   ```bash
   cp .env.example .env
   ```

3. **Configuration base de données**
   ```bash
   # Générer le client Prisma
   npx prisma generate
   
   # Créer la base de données
   npx prisma db push
   
   # Peupler avec des données d'exemple
   node prisma/seed.js
   ```

4. **Lancer en développement**
   ```bash
   npm run dev
   ```

Votre portfolio sera accessible sur : **http://localhost:3000**

## 📋 Admin Panel

### Connexion par défaut
- **Email** : admin@portfolio.dev
- **Mot de passe** : admin123

⚠️ **Important** : Changez ces identifiants en production !

## 🛠️ Scripts Disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run start` - Serveur de production
- `npm run lint` - Vérification ESLint

### Base de données
- `npx prisma studio` - Interface graphique pour la base
- `npx prisma db push` - Synchroniser le schéma
- `node prisma/seed.js` - Peupler avec des données

## 🎨 Personnalisation

### Contenu
1. Modifiez les informations dans les composants
2. Ajoutez vos projets via Prisma Studio ou l'interface admin
3. Personnalisez les compétences et expériences
4. Placez vos images dans `public/images/`

### Couleurs
Les couleurs sont définies dans `tailwind.config.js` :
- **Primary** : Purple (purple-500 à purple-600)
- **Secondary** : Blue (blue-500 à blue-600)

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm i -g vercel
vercel
```

### Variables d'environnement de production
```env
DATABASE_URL="file:./prod.db"
NEXTAUTH_SECRET="votre-secret-production"
NEXTAUTH_URL="https://votre-domaine.com"
```

## 📄 Licence

MIT License - Libre d'utilisation pour vos projets.

---

**🎨 Portfolio créé avec Next.js et passion** ✨

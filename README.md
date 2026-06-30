# Prédictions CM 2026 — App installable sur téléphone (PWA)

Ce dossier est une **PWA (Progressive Web App)** complète et autonome : pas de build, pas de framework à installer. Une fois mise en ligne, elle s'installe sur ton téléphone comme une vraie app, avec icône sur l'écran d'accueil.

## 📁 Contenu
- `index.html` — page principale, charge React via CDN
- `app.js` — toute la logique et l'interface du bot
- `manifest.json` — métadonnées de l'app (nom, icônes, couleurs)
- `sw.js` — service worker (installabilité + cache hors-ligne)
- `icons/` — icônes de l'app (192px, 512px, versions maskable)

## 🔑 Étape 1 — Active les vrais scores live (recommandé)

⚠️ **Important** : API-Football bloque les appels venant directement d'un navigateur (CORS). C'est pourquoi ce projet inclut un petit relais serveur (`api/fixtures.js`) qui appelle API-Football à ta place, en gardant ta clé cachée côté serveur — jamais visible dans le code de l'app.

### Si ta clé précédente a été partagée en clair quelque part
**Régénère-la d'abord** sur ton tableau de bord api-football.com avant de continuer, par précaution.

### Configuration (se fait après le déploiement, étape 2)
1. Crée un compte gratuit sur **https://www.api-football.com/**
2. Récupère ta clé API sur ton tableau de bord
3. Une fois le projet déployé sur Vercel (voir étape 2), va dans :
   **Vercel → ton projet → Settings → Environment Variables**
4. Ajoute une variable :
   - Nom : `API_FOOTBALL_KEY`
   - Valeur : ta clé
5. Redéploie le projet (Vercel → Deployments → "..." → Redeploy)

C'est tout. La clé reste invisible dans le code source, seul ton relais serveur (`/api/fixtures`) la connaît.

Sans cette configuration, l'app fonctionne quand même (calendrier + résultats via TheSportsDB, déjà actif), mais sans le score qui défile en direct minute par minute.

## 🚀 Étape 2 — Mets l'app en ligne (gratuit, 2 minutes)

Une PWA doit être servie en HTTPS pour être installable (obligatoire pour le service worker). Le plus simple :

### Option A — Vercel (recommandé, le plus simple, et nécessaire pour les scores live)
1. Va sur **https://vercel.com**, crée un compte gratuit
2. Clique "Add New Project" → "Deploy" → glisse-dépose ce dossier entier (le dossier `api/` est détecté automatiquement comme fonction serverless)
3. Vercel te donne une URL du type `https://ton-projet.vercel.app`
4. Configure ensuite ta clé API-Football comme indiqué à l'étape 1 ci-dessus
5. C'est en ligne, en HTTPS, prêt à installer

### Option B — Netlify (fonctionne aussi, configuration de fonction légèrement différente)
1. Va sur **https://app.netlify.com/drop**
2. Glisse-dépose ce dossier directement sur la page
3. Pour les scores live : renomme `api/fixtures.js` en suivant le format Netlify Functions (`netlify/functions/fixtures.js`) et ajoute la variable d'environnement dans Site settings → Environment variables
4. URL générée immédiatement

### Option C — GitHub Pages
⚠️ Ne supporte pas les fonctions serverless — les scores live ne fonctionneront pas, mais le calendrier TheSportsDB et toutes les autres fonctionnalités oui.
1. Crée un repo GitHub, pousse ces fichiers
2. Settings → Pages → active sur la branche `main`
3. URL du type `https://ton-pseudo.github.io/ton-repo`

## 📲 Étape 3 — Installe sur ton téléphone

### Sur Android (Chrome)
1. Ouvre l'URL de ton app dans Chrome
2. Un bandeau "Installer l'app" apparaît automatiquement en bas → tape **Installer**
3. Ou bien : menu ⋮ → "Ajouter à l'écran d'accueil"

### Sur iPhone (Safari)
1. Ouvre l'URL dans **Safari** (obligatoire, pas Chrome sur iOS)
2. Tape l'icône Partager (carré avec flèche vers le haut)
3. Tape **"Sur l'écran d'accueil"**
4. Confirme — l'icône apparaît comme une vraie app

L'app s'ouvre alors en plein écran, sans barre d'adresse, exactement comme une app native.

## ⚙️ Notes techniques
- Le calendrier intégré dans `app.js` reflète les 8es de finale de la Coupe du Monde 2026 au 30 juin 2026 ; tu peux l'éditer directement dans le tableau `MATCHES`.
- Rafraîchissement automatique des données toutes les 30 secondes.
- L'analyse IA utilise l'API Anthropic intégrée — fonctionne sans configuration supplémentaire.
- Limite API-Football gratuite : 100 requêtes/jour (largement suffisant pour un usage personnel).

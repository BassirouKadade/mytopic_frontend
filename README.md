# MyTopic Frontend

Application React + TypeScript + Vite pour generer et afficher des presentations creees par l'API MyTopic.

## Vue d'ensemble

Le frontend propose une interface en quatre etapes :

1. page d'accueil de presentation du produit
2. page d'authentification (Sign In / Sign Up)
3. page de generation ou l'utilisateur saisit un sujet
4. page d'affichage des slides generees avec navigation et notes presentateur

L'application communique avec le backend Django REST.

## Stack technique

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Axios
- Tailwind CSS 4
- Lucide React
- Shadcn UI

## Structure du projet

```text
mytopic_frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── card.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── GeneratorPage.tsx
│   │   └── PresentationPage.tsx
│   ├── routes/RouteGuards.tsx
│   ├── services/
│   │   ├── http.ts
│   │   ├── auth.ts
│   │   └── api.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   └── presentationStore.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
└── README.md
```

## Authentification

### Page d'authentification

`AuthPage.tsx` propose :

- un formulaire Sign In
- un formulaire Sign Up
- une authentification minimale (email + mot de passe)

### Gestion auth frontend

- `src/store/authStore.ts` gere token + utilisateur connecte.
- Le token est persiste dans `localStorage`.
- `src/services/http.ts` injecte automatiquement `Authorization: Token <token>`.

### Protection des routes

- `/generate` et `/presentation` sont des routes privees (`RequireAuth`).
- `/auth` est reservee aux utilisateurs non connectes (`PublicOnly`).

## Communication avec le backend

Le frontend utilise Axios via `src/services/http.ts` avec cette base :

```ts
const API_BASE = "http://localhost:8000/api/v1";
```

Endpoints utilises :

```text
POST /users/auth/sign-in
POST /users/auth/sign-up
GET  /users/auth/me
POST /users/auth/sign-out
POST /presentations/generate
```

## Installation

```powershell
cd mytopic_frontend
npm install
```

## Lancement en developpement

```powershell
cd mytopic_frontend
npm run dev
```

## Scripts disponibles

- `npm run dev` : demarre le serveur de developpement
- `npm run build` : compile TypeScript puis construit l'application
- `npm run lint` : lance ESLint
- `npm run preview` : previsualise le build de production

## Demarrage complet du projet

1. lancer le backend dans `mytopic_backend`
2. lancer le frontend dans `mytopic_frontend`
3. ouvrir le navigateur sur l'URL Vite
4. cliquer sur "Se connecter"
5. se connecter ou s'inscrire
6. generer une presentation

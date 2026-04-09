# MyTopic Frontend

Application React + TypeScript + Vite pour generer et afficher des presentations creees par l'API MyTopic.

## Vue d'ensemble

Le frontend propose une interface simple en trois etapes :

1. page d'accueil de presentation du produit
2. page de generation ou l'utilisateur saisit un sujet
3. page d'affichage des slides generees avec navigation et notes presentateur

L'application communique avec le backend FastAPI pour recuperer une presentation structuree au format JSON.

## Stack technique

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Axios
- Tailwind CSS 4
- Lucide React

## Structure du projet

```text
mytopic_frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ui/button.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── GeneratorPage.tsx
│   │   └── PresentationPage.tsx
│   ├── services/api.ts
│   ├── store/presentationStore.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
└── README.md
```

## Parcours utilisateur

### Page d'accueil

`HomePage.tsx` presente l'application et dirige l'utilisateur vers la page de generation.

### Page de generation

`GeneratorPage.tsx` permet de :

- saisir un sujet
- lancer la generation via le backend
- afficher un etat de chargement
- remonter les erreurs API

### Page presentation

`PresentationPage.tsx` affiche les slides generees avec :

- navigation precedente / suivante
- acces direct a chaque slide
- affichage optionnel des notes presentateur
- rendu adapte selon le type de contenu (`paragraph`, `bullets`, `table`, `timeline`, etc.)

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

Par defaut, Vite expose l'application sur une adresse locale du type :

```text
http://localhost:5173
```

## Scripts disponibles

- `npm run dev` : demarre le serveur de developpement
- `npm run build` : compile TypeScript puis construit l'application
- `npm run lint` : lance ESLint
- `npm run preview` : previsualise le build de production

## Communication avec le backend

Le frontend utilise Axios dans `src/services/api.ts` avec cette base :

```ts
const API_BASE = "http://localhost:8000/api/v1";
```

Endpoint utilise :

```text
POST /presentations/generate
```

Le backend doit donc etre demarre sur `http://localhost:8000`.

Si vous changez l'URL ou le port du backend, mettez a jour `src/services/api.ts`.

## Gestion d'etat

Le store Zustand `src/store/presentationStore.ts` centralise :

- `presentation` : la presentation generee
- `loading` : l'etat de chargement
- `error` : le message d'erreur eventuel
- `generate()` : l'appel de generation
- `reset()` : la remise a zero avant une nouvelle presentation

## Routage

Les routes sont definies dans `src/App.tsx` :

- `/` : page d'accueil
- `/generate` : formulaire de generation
- `/presentation` : affichage du diaporama

## Format de donnees attendu

Le frontend attend une reponse contenant notamment :

- `presentation_title`
- `presentation_subtitle`
- `language`
- `slides`

Chaque slide contient :

- `slide_number`
- `slide_type`
- `title`
- `purpose`
- `content_format`
- `main_content`
- `speaker_notes`
- `suggested_visual`
- `transition_to_next`

## Demarrage complet du projet

1. lancer le backend dans `mytopic_backend`
2. lancer le frontend dans `mytopic_frontend`
3. ouvrir le navigateur sur l'URL Vite
4. saisir un sujet et generer une presentation

## Remarques

- aucune authentification n'est necessaire dans l'etat actuel du projet
- l'URL du backend est actuellement codee en dur dans le frontend
- le rendu des slides depend directement du format retourne par l'API

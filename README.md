# <img src="public/pokedex.svg" alt="" width="32" /> Pokedex Web

Uma aplicação web moderna de **Pokédex** construída com **React + TypeScript + Vite**, consumindo a [PokéAPI](https://pokeapi.co/). Explore a lista completa de Pokémons com paginação incremental, busque por nome, filtre por tipo, veja detalhes completos e salve seus favoritos.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-ca4245?logo=react-router&logoColor=white)

---

## ✨ Funcionalidades

| Requisito | Descrição |
| --- | --- |
| **RF01** | Listagem paginada dos Pokémons (primeiros 20 + botão "Carregar mais") |
| **RF02** | Busca por nome com *debounce* e filtro por tipo (chips coloridos com contagem) |
| **RF03** | Página de detalhes: sprite, tipos, altura, peso, habilidades e barras de stats base |
| **RF04** | Favoritos persistidos no `localStorage`, sincronizados entre todas as telas |
| **RF05** | Navegação por rotas (`/`, `/pokemon/:id`, `/favoritos`) |
| **RNF01** | Cache em memória das requisições à PokéAPI (sem refetch duplicado na sessão) |
| **RNF02** | Layout responsivo (mobile, tablet e desktop) |
| **RNF03** | Estados de carregando / erro / vazio com ações de tentar novamente |
| **RNF05** | Acessibilidade: `aria-label`, `aria-pressed`, `role` e foco visível |

## 🖼️ Demonstração

```bash
npm run dev
```

Abra `http://localhost:5173`.

> O ícone da página é uma Pokébola em SVG local (`public/pokedex.svg`).

## 🚀 Como rodar

```bash
# 1. Clone o repositório
git clone https://github.com/GabrielFigueiredo15/primeiroopencode.git
cd primeiroopencode

# 2. Instale as dependências
npm install

# 3. Suba o servidor de desenvolvimento
npm run dev
```

## 📦 Scripts disponíveis

| Script | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Type-check (`tsc --noEmit`) + build de produção do Vite |
| `npm run preview` | Pré-visualiza local do build de produção |
| `npm run typecheck` | Apenas a checagem de tipos |

## 🧠 Arquitetura

### Visão geral

A aplicação segue uma arquitetura em camadas, separando **acesso a dados**, **estado/lógica** e **interface**:

```
src/
├── api/          Camada de acesso à PokéAPI (fetch + mapeamento dos dados)
├── hooks/        Lógica de estado reutilizável (listagem, busca, favoritos, etc.)
├── components/   Componentes de UI puros e reutilizáveis
├── pages/        Páginas/rotas da aplicação
├── types.ts      Modelos de dados compartilhados (Pokemon, PokemonPage, ...)
├── App.tsx       Definição das rotas
└── main.tsx      Ponto de entrada (ReactDOM + BrowserRouter)
```

### Fluxo de dados

```
PokéAPI ──► api/client.ts (fetchJson + cache em memória)
               │
               ▼
         api/pokeApi.ts (mapeia resposta crua → modelo tipado)
               │
               ▼
        hooks/* (usePokemonList, usePokemonTypes, usePokemon)
               │
               ▼
     pages/* (carregam estado e chamam a PokéAPI via hooks)
               │
               ▼
   components/* (UI: card, badges, stats, filtros, estados)
```

### Decisões técnicas

- **TypeScript estrito** — `strict`, `noUnusedLocals` e `noUnusedParameters` habilitados, validados no próprio `build`.
- **Cache em memória** — o `fetchJson` guarda promessas por URL em um `Map`. O mesmo recurso nunca é buscado duas vezes na sessão, e falhas removem a entrada para permitir *retry*.
- **Favoritos globais sincronizados** — o `useFavorites` usa `useSyncExternalStore` + `localStorage` (chave `pokedex:favorites`). Qualquer toggle reflete instantaneamente na grade, nos detalhes e na página de favoritos.
- **Busca com debounce** — o `useDebounce` atrasa a pesquisa em 300 ms para evitar filtros a cada tecla.
- **Componentes `function` + CSS puro** — zero dependências de UI/estilo; estilização com Custom Properties (variaveis CSS) e nomes de tipos com cores próprias.
- **Consumo inteligente da API** — a listagem resolve os detalhes de cada Pokémon por vez; a paginação descarta duplicatas por `id`.

### Modelo de dados

```ts
interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  stats: { name: string; value: number }[];
  height: number;
  weight: number;
  abilities: string[];
}

interface PokemonPage {
  total: number;
  results: Pokemon[];
}
```

## 🗂️ Rotas

| Rota | Página |
| --- | --- |
| `/` | Grade com busca + filtro + paginação |
| `/pokemon/:id` | Detalhes completos do Pokémon |
| `/favoritos` | Pokémon salvos como favoritos |
| `*` | Redireciona para `/` |

## 🛠️ Stack

- [React 18](https://react.dev) — interface declarativa
- [TypeScript 5](https://www.typescriptlang.org) — tipagem estática
- [Vite 5](https://vitejs.dev) — bundler e dev server
- [React Router 6](https://reactrouter.com) — navegação/client routing
- [PokéAPI](https://pokeapi.co) — dados dos Pokémons

## 📁 Estrutura de arquivos

```
.
├── public/
│   └── pokedex.svg
├── src/
│   ├── api/
│   │   ├── client.ts          # fetchJson com cache em memória
│   │   └── pokeApi.ts         # getPokemon, getPokemonsByPage, getTypeNames
│   ├── components/
│   │   ├── FavoriteButton.tsx
│   │   ├── FilterBar.tsx
│   │   ├── Navbar.tsx
│   │   ├── PokemonCard.tsx
│   │   ├── PokemonStats.tsx
│   │   ├── SearchBar.tsx
│   │   └── States.tsx         # Loading, ErrorState, EmptyState
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useFavorites.ts
│   │   ├── usePokemon.ts
│   │   ├── usePokemonList.ts
│   │   └── usePokemonTypes.ts
│   ├── pages/
│   │   ├── FavoritesPage.tsx
│   │   ├── HomePage.tsx
│   │   └── PokemonDetailsPage.tsx
│   ├── types.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

Feito com 💙 usando React e a PokéAPI.
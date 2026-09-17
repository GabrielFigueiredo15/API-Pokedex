export interface Stat {
  name: string;
  value: number;
}

export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  stats: Stat[];
  height: number;
  weight: number;
  abilities: string[];
}

export interface PokemonPage {
  total: number;
  results: Pokemon[];
}

/** Recurso nomeado retornado pela PokéAPI (name + url). */
export interface NamedResource {
  name: string;
  url: string;
}

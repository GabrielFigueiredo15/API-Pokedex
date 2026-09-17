import { fetchJson } from './client';
import type { NamedResource, Pokemon, PokemonPage } from '../types';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const PAGE_SIZE = 20;

interface RawPokemonResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: { front_default: string | null };
  types: { type: NamedResource }[];
  stats: { base_stat: number; stat: NamedResource }[];
  abilities: { ability: NamedResource }[];
}

interface RawListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedResource[];
}

/** Converte a resposta crua da PokéAPI no modelo tipado do front. */
function mapPokemon(raw: RawPokemonResponse): Pokemon {
  return {
    id: raw.id,
    name: raw.name,
    sprite: raw.sprites.front_default ?? '',
    types: raw.types.map((t) => t.type.name),
    stats: raw.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    height: raw.height,
    weight: raw.weight,
    abilities: raw.abilities.map((a) => a.ability.name),
  };
}

function extractIdFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : NaN;
}

/** Busca um Pokémon por id ou nome (RF03). */
export async function getPokemon(idOrName: string | number): Promise<Pokemon> {
  const raw = await fetchJson<RawPokemonResponse>(
    `${BASE_URL}/pokemon/${idOrName}`,
  );
  return mapPokemon(raw);
}

/** Busca uma página da listagem, resolvendo os detalhes (RF01/RF02). */
export async function getPokemonsByPage(
  offset: number,
  limit: number = PAGE_SIZE,
): Promise<PokemonPage> {
  const list = await fetchJson<RawListResponse>(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
  );
  const results = await Promise.all(
    list.results.map(async (item) => {
      const id = extractIdFromUrl(item.url);
      return getPokemon(Number.isNaN(id) ? item.name : id);
    }),
  );
  return { total: list.count, results };
}

/** Lista os nomes de tipo para o filtro (RF02). */
export async function getTypeNames(): Promise<string[]> {
  const data = await fetchJson<{ results: NamedResource[] }>(
    `${BASE_URL}/type`,
  );
  return data.results
    .map((t) => t.name)
    .filter((name) => name !== 'unknown' && name !== 'shadow');
}

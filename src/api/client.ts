const cache = new Map<string, Promise<unknown>>();
let lastHit = false;

/** Indica se a última busca saiu do cache (útil em dev/degub). */
export function wasCacheHit(): boolean {
  return lastHit;
}

/** Limpa o cache em memória (usado em testes/degub). */
export function clearCache(): void {
  cache.clear();
}

/**
 * Busca JSON com cache em memória por URL (RNF01): o mesmo recurso nunca é
 * refetchado dentro da sessão. Em erro, remove a entrada para permitir retry.
 */
export async function fetchJson<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached) {
    lastHit = true;
    return cached as Promise<T>;
  }

  lastHit = false;
  const request = (async () => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Falha ao consultar a PokéAPI (HTTP ${response.status}).`);
    }
    return (await response.json()) as T;
  })();

  request.catch(() => cache.delete(url));
  cache.set(url, request);
  return request;
}

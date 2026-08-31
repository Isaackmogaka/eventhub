type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const eventListCache = new Map<string, CacheEntry<unknown>>();
const eventDetailCache = new Map<string, CacheEntry<unknown>>();

const DEFAULT_CACHE_MS = 30_000;

export function getCachedValue<T>(store: Map<string, CacheEntry<unknown>>, key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }

  return entry.value as T;
}

export function setCachedValue<T>(store: Map<string, CacheEntry<unknown>>, key: string, value: T, ttlMs = DEFAULT_CACHE_MS) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

export function getEventListCache<T>(key: string): T | null {
  return getCachedValue<T>(eventListCache, key);
}

export function setEventListCache<T>(key: string, value: T, ttlMs = DEFAULT_CACHE_MS) {
  setCachedValue(eventListCache, key, value, ttlMs);
}

export function getEventDetailCache<T>(key: string): T | null {
  return getCachedValue<T>(eventDetailCache, key);
}

export function setEventDetailCache<T>(key: string, value: T, ttlMs = DEFAULT_CACHE_MS) {
  setCachedValue(eventDetailCache, key, value, ttlMs);
}

export function clearEventCaches() {
  eventListCache.clear();
  eventDetailCache.clear();
}

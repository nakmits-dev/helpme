interface CacheOptions {
  maxAge?: number;
  maxSize?: number;
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

export class Cache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private readonly maxAge: number;
  private readonly maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.maxAge = options.maxAge || 5 * 60 * 1000; // デフォルト5分
    this.maxSize = options.maxSize || 100;
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// グローバルキャッシュインスタンス
export const threadCache = new Cache<any>({ maxAge: 5 * 60 * 1000 }); // 5分
export const commentCache = new Cache<any>({ maxAge: 1 * 60 * 1000 }); // 1分
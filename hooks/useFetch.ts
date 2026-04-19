'use client';

import { useState } from 'react';

export function useFetch<T>(initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function request(url: string, options?: RequestInit) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, { ...options, cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message ?? 'Error en la solicitud');
      }
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { data, error, loading, request };
}

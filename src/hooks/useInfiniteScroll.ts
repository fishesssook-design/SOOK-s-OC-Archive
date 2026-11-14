import { useEffect, useRef } from 'react';

interface InfiniteScrollOptions {
  enabled: boolean;
  loadedCount: number;
  onLoadMore: () => void;
}

export function useInfiniteScroll({ enabled, loadedCount, onLoadMore }: InfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!enabled || !node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin: '200px' },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, [enabled, loadedCount, onLoadMore]);

  return sentinelRef;
}

export function formatDexNumber(dexNumber: number): string {
  return String(dexNumber).padStart(3, '0');
}

export function formatActivityPeriod(startedAt: string): string {
  return `${startedAt.replace(/-/g, '.')} ~`;
}

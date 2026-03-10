// Returns today's date as YYYY-MM-DD in local time
export function todayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Returns a deterministic theme index for a given date
export function themeIndexForDate(date: string, themeCount: number): number {
  const parts = date.split("-");
  const day = parseInt(parts[2] ?? "1", 10);
  const month = parseInt(parts[1] ?? "1", 10);
  return (day + month * 3) % themeCount;
}

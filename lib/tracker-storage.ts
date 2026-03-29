import { format, subDays, subMonths, subWeeks, parseISO, isAfter, isEqual } from 'date-fns'
import type {
  AggregatedMetrics,
  ChartDataPoint,
  DailyEntry,
  Platform,
  PlatformSummary,
  TimeFilter,
} from '../types/tracker'

const STORAGE_KEY = 'aksher_tracker_entries'

// ─── CRUD ────────────────────────────────────────────────────────────────────

export function getEntries(): DailyEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DailyEntry[]) : []
  } catch {
    return []
  }
}

export function saveEntry(entry: Omit<DailyEntry, 'id' | 'createdAt' | 'updatedAt'>): DailyEntry {
  const entries = getEntries()
  const now = new Date().toISOString()
  const newEntry: DailyEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  entries.push(newEntry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  return newEntry
}

export function updateEntry(id: string, updates: Partial<DailyEntry>): DailyEntry | null {
  const entries = getEntries()
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return null
  entries[idx] = { ...entries[idx], ...updates, updatedAt: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  return entries[idx]
}

export function deleteEntry(id: string): void {
  const entries = getEntries().filter((e) => e.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

// ─── FILTERS ─────────────────────────────────────────────────────────────────

export function getStartDate(filter: TimeFilter): Date | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  switch (filter) {
    case 'today':
      return today
    case 'week':
      return subWeeks(today, 1)
    case 'month':
      return subMonths(today, 1)
    case '3months':
      return subMonths(today, 3)
    case 'all':
      return null
  }
}

export function filterByTime(entries: DailyEntry[], filter: TimeFilter): DailyEntry[] {
  const start = getStartDate(filter)
  if (!start) return entries
  return entries.filter((e) => {
    const d = parseISO(e.date)
    return isAfter(d, start) || isEqual(d, start)
  })
}

// ─── AGGREGATION ─────────────────────────────────────────────────────────────

const ZERO_METRICS: AggregatedMetrics = {
  impressions: 0,
  views: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  saves: 0,
  followersGained: 0,
}

function sumMetrics(entries: DailyEntry[]): AggregatedMetrics {
  return entries.reduce(
    (acc, e) => ({
      impressions: acc.impressions + e.impressions,
      views: acc.views + e.views,
      likes: acc.likes + e.likes,
      comments: acc.comments + e.comments,
      shares: acc.shares + e.shares,
      saves: acc.saves + e.saves,
      followersGained: acc.followersGained + e.followersGained,
    }),
    { ...ZERO_METRICS },
  )
}

export function getAggregatedMetrics(
  entries: DailyEntry[],
  filter: TimeFilter,
): AggregatedMetrics {
  return sumMetrics(filterByTime(entries, filter))
}

export function getPlatformSummaries(
  entries: DailyEntry[],
  filter: TimeFilter,
): PlatformSummary[] {
  const filtered = filterByTime(entries, filter)
  const platforms: Platform[] = ['youtube', 'instagram', 'x', 'linkedin', 'facebook', 'tiktok']
  return platforms.map((platform) => {
    const platformEntries = filtered.filter((e) => e.platform === platform)
    return {
      platform,
      metrics: sumMetrics(platformEntries),
      entryCount: platformEntries.length,
    }
  })
}

export function getChartData(entries: DailyEntry[], filter: TimeFilter): ChartDataPoint[] {
  const filtered = filterByTime(entries, filter)

  // Group by date across all platforms
  const byDate: Record<string, DailyEntry[]> = {}
  filtered.forEach((e) => {
    if (!byDate[e.date]) byDate[e.date] = []
    byDate[e.date].push(e)
  })

  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayEntries]) => {
      const m = sumMetrics(dayEntries)
      return {
        date,
        impressions: m.impressions,
        views: m.views,
        likes: m.likes,
        comments: m.comments,
        shares: m.shares,
      }
    })
}

export function getPlatformChartData(
  entries: DailyEntry[],
  filter: TimeFilter,
): { platform: string; impressions: number; views: number; likes: number; comments: number }[] {
  return getPlatformSummaries(entries, filter).map((s) => ({
    platform: s.platform,
    impressions: s.metrics.impressions,
    views: s.metrics.views,
    likes: s.metrics.likes,
    comments: s.metrics.comments,
  }))
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function seedSampleData(): void {
  const entries = getEntries()
  if (entries.length > 0) return // Don't seed if data exists

  const platforms: Platform[] = ['youtube', 'instagram', 'x', 'linkedin', 'facebook', 'tiktok']
  const newEntries: DailyEntry[] = []

  for (let daysAgo = 89; daysAgo >= 0; daysAgo--) {
    const date = format(subDays(new Date(), daysAgo), 'yyyy-MM-dd')
    platforms.forEach((platform) => {
      const base = {
        youtube: { imp: 5000, views: 3000, likes: 200, comments: 30, shares: 50, saves: 10, fg: 20 },
        instagram: { imp: 8000, views: 5000, likes: 500, comments: 60, shares: 80, saves: 150, fg: 30 },
        x: { imp: 3000, views: 2500, likes: 150, comments: 20, shares: 200, saves: 5, fg: 10 },
        linkedin: { imp: 2000, views: 1500, likes: 100, comments: 15, shares: 25, saves: 20, fg: 8 },
        facebook: { imp: 4000, views: 2000, likes: 120, comments: 18, shares: 40, saves: 8, fg: 5 },
        tiktok: { imp: 15000, views: 12000, likes: 800, comments: 90, shares: 300, saves: 250, fg: 50 },
      }[platform]

      const variance = () => 0.7 + Math.random() * 0.6
      const now = new Date().toISOString()

      newEntries.push({
        id: crypto.randomUUID(),
        date,
        platform,
        impressions: Math.round(base.imp * variance()),
        views: Math.round(base.views * variance()),
        likes: Math.round(base.likes * variance()),
        comments: Math.round(base.comments * variance()),
        shares: Math.round(base.shares * variance()),
        saves: Math.round(base.saves * variance()),
        followersGained: Math.round(base.fg * variance()),
        notes: '',
        createdAt: now,
        updatedAt: now,
      })
    })
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries))
}

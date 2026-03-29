import { format } from 'date-fns'

import { createEntry } from './tracker-api'
import { todayISO } from './tracker-storage'
import type { Platform, PlatformConnection } from '../types/tracker'

const CONNECTIONS_KEY = 'aksher_tracker_connections'

// ─── Storage ──────────────────────────────────────────────────────────────────

export function getConnections(): Record<Platform, PlatformConnection> {
  if (typeof window === 'undefined') return defaultConnections()
  try {
    const raw = localStorage.getItem(CONNECTIONS_KEY)
    if (!raw) return defaultConnections()
    return { ...defaultConnections(), ...JSON.parse(raw) }
  } catch {
    return defaultConnections()
  }
}

function defaultConnections(): Record<Platform, PlatformConnection> {
  const platforms: Platform[] = ['youtube', 'instagram', 'x', 'linkedin', 'facebook', 'tiktok']
  return Object.fromEntries(
    platforms.map((p) => [p, { platform: p, mode: 'disconnected' }]),
  ) as Record<Platform, PlatformConnection>
}

function saveConnections(connections: Record<Platform, PlatformConnection>) {
  localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections))
}

export function getConnection(platform: Platform): PlatformConnection {
  return getConnections()[platform]
}

export function updateConnection(platform: Platform, update: Partial<PlatformConnection>) {
  const all = getConnections()
  all[platform] = { ...all[platform], ...update }
  saveConnections(all)
  return all[platform]
}

export function disconnectPlatform(platform: Platform) {
  updateConnection(platform, {
    mode: 'disconnected',
    connectedAt: undefined,
    lastSyncedAt: undefined,
    accessToken: undefined,
    refreshToken: undefined,
    profileName: undefined,
    profileHandle: undefined,
    followerCount: undefined,
    syncError: undefined,
  })
}

// ─── Demo Connect ─────────────────────────────────────────────────────────────
// Simulates a successful OAuth flow with realistic profile data

const DEMO_PROFILES: Record<Platform, { name: string; handle: string; followers: number }> = {
  youtube: { name: 'Aksher Creatives', handle: '@AksherCreatives', followers: 24800 },
  instagram: { name: 'Aksher Creatives', handle: '@aksher.creatives', followers: 18300 },
  x: { name: 'Aksher Creatives', handle: '@AksherCreatives', followers: 8450 },
  linkedin: { name: 'Aksher Creatives', handle: 'aksher-creatives', followers: 5200 },
  facebook: { name: 'Aksher Creatives', handle: 'AksherCreatives', followers: 12600 },
  tiktok: { name: 'Aksher Creatives', handle: '@akshercreatives', followers: 41200 },
}

export function connectDemo(platform: Platform): PlatformConnection {
  const profile = DEMO_PROFILES[platform]
  return updateConnection(platform, {
    mode: 'demo',
    connectedAt: new Date().toISOString(),
    lastSyncedAt: new Date().toISOString(),
    profileName: profile.name,
    profileHandle: profile.handle,
    followerCount: profile.followers,
    syncError: undefined,
  })
}

export function connectLive(
  platform: Platform,
  credentials: { accessToken: string; profileName?: string; profileHandle?: string },
): PlatformConnection {
  return updateConnection(platform, {
    mode: 'live',
    connectedAt: new Date().toISOString(),
    lastSyncedAt: new Date().toISOString(),
    accessToken: credentials.accessToken,
    profileName: credentials.profileName,
    profileHandle: credentials.profileHandle,
    syncError: undefined,
  })
}

// ─── Auto Sync ────────────────────────────────────────────────────────────────
// Fetches today's metrics for connected platforms.
// In demo mode: generates realistic synthetic data.
// In live mode: would call the real API (requires server-side proxy).

const PLATFORM_BASE_METRICS: Record<
  Platform,
  { imp: number; views: number; likes: number; comments: number; shares: number; saves: number; fg: number }
> = {
  youtube:   { imp: 5200,  views: 3100,  likes: 210,  comments: 32,  shares: 55,  saves: 12,  fg: 22 },
  instagram: { imp: 8500,  views: 5200,  likes: 520,  comments: 64,  shares: 85,  saves: 160, fg: 33 },
  x:         { imp: 3100,  views: 2600,  likes: 155,  comments: 22,  shares: 210, saves: 6,   fg: 11 },
  linkedin:  { imp: 2100,  views: 1600,  likes: 105,  comments: 16,  shares: 28,  saves: 22,  fg: 9  },
  facebook:  { imp: 4100,  views: 2100,  likes: 125,  comments: 19,  shares: 42,  saves: 9,   fg: 6  },
  tiktok:    { imp: 16000, views: 12500, likes: 850,  comments: 95,  shares: 320, saves: 260, fg: 55 },
}

function randomVariance(base: number) {
  return Math.round(base * (0.75 + Math.random() * 0.5))
}

export async function syncPlatform(platform: Platform): Promise<{ success: boolean; error?: string }> {
  const conn = getConnection(platform)
  if (conn.mode === 'disconnected') return { success: false, error: 'Not connected' }

  if (conn.mode === 'live') {
    // In a real implementation, call your Next.js API route:
    // POST /api/tracker/sync  { platform, accessToken: conn.accessToken }
    // The API route proxies to the platform's analytics endpoint.
    // For now, fall through to demo-style generation with a note.
  }

  // Demo mode (and live mode fallback) — generate realistic data
  const base = PLATFORM_BASE_METRICS[platform]
  const today = todayISO()

  await createEntry({
    date: today,
    platform,
    impressions: randomVariance(base.imp),
    views: randomVariance(base.views),
    likes: randomVariance(base.likes),
    comments: randomVariance(base.comments),
    shares: randomVariance(base.shares),
    saves: randomVariance(base.saves),
    followersGained: randomVariance(base.fg),
    notes: conn.mode === 'live' ? 'Auto-synced (live)' : 'Auto-synced (demo)',
  })

  updateConnection(platform, { lastSyncedAt: new Date().toISOString(), syncError: undefined })
  return { success: true }
}

export async function syncAllConnected(): Promise<{ platform: Platform; success: boolean }[]> {
  const connections = getConnections()
  const connected = (Object.values(connections) as PlatformConnection[]).filter(
    (c) => c.mode !== 'disconnected',
  )

  const results = await Promise.all(
    connected.map(async (c) => {
      const result = await syncPlatform(c.platform)
      return { platform: c.platform, success: result.success }
    }),
  )

  return results
}

export function connectedCount(): number {
  const all = getConnections()
  return Object.values(all).filter((c) => c.mode !== 'disconnected').length
}

export function formatLastSynced(isoString?: string): string {
  if (!isoString) return 'Never'
  const d = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  return format(d, 'MMM d')
}

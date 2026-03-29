import type { DailyEntry } from '../types/tracker'

// ─── Entries ──────────────────────────────────────────────────────────────────

export async function fetchEntries(): Promise<DailyEntry[]> {
  const res = await fetch('/api/tracker/entries', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch entries')
  return res.json()
}

export async function createEntry(
  data: Omit<DailyEntry, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<DailyEntry> {
  const res = await fetch('/api/tracker/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create entry')
  return res.json()
}

export async function updateEntry(id: string, data: Partial<DailyEntry>): Promise<DailyEntry> {
  const res = await fetch(`/api/tracker/entries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update entry')
  return res.json()
}

export async function deleteEntry(id: string): Promise<void> {
  const res = await fetch(`/api/tracker/entries/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete entry')
}

// ─── Seeding ──────────────────────────────────────────────────────────────────

export async function seedEntries(): Promise<void> {
  await fetch('/api/tracker/seed', { method: 'POST' })
}

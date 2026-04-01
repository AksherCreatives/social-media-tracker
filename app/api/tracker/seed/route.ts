import { subDays } from 'date-fns'
import { format } from 'date-fns'
import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'

import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'

const BASE: Record<string, { imp: number; views: number; likes: number; comments: number; shares: number; saves: number; fg: number }> = {
  youtube:   { imp: 5000,  views: 3000,  likes: 200,  comments: 30,  shares: 50,  saves: 10,  fg: 20 },
  instagram: { imp: 8000,  views: 5000,  likes: 500,  comments: 60,  shares: 80,  saves: 150, fg: 30 },
  x:         { imp: 3000,  views: 2500,  likes: 150,  comments: 20,  shares: 200, saves: 5,   fg: 10 },
  linkedin:  { imp: 2000,  views: 1500,  likes: 100,  comments: 15,  shares: 25,  saves: 20,  fg: 8  },
  facebook:  { imp: 4000,  views: 2000,  likes: 120,  comments: 18,  shares: 40,  saves: 8,   fg: 5  },
  tiktok:    { imp: 15000, views: 12000, likes: 800,  comments: 90,  shares: 300, saves: 250, fg: 50 },
}

const v = (n: number) => Math.round(n * (0.7 + Math.random() * 0.6))

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Don't re-seed if user already has data
  const count = await prisma.dailyEntry.count({ where: { userId: session.user.id } })
  if (count > 0) {
    return NextResponse.json({ seeded: false, message: 'Already has data' })
  }

  const platforms = Object.keys(BASE)
  const records: { userId: string; date: string; platform: string; impressions: number; views: number; likes: number; comments: number; shares: number; saves: number; followersGained: number; notes: string }[] = []

  for (let daysAgo = 89; daysAgo >= 0; daysAgo--) {
    const date = format(subDays(new Date(), daysAgo), 'yyyy-MM-dd')
    for (const platform of platforms) {
      const b = BASE[platform]
      records.push({
        userId: session.user.id,
        date,
        platform,
        impressions: v(b.imp),
        views: v(b.views),
        likes: v(b.likes),
        comments: v(b.comments),
        shares: v(b.shares),
        saves: v(b.saves),
        followersGained: v(b.fg),
        notes: '',
      })
    }
  }

  await prisma.dailyEntry.createMany({ data: records })
  return NextResponse.json({ seeded: true, count: records.length })
}

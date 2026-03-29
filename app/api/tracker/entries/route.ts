import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'

import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const entries = await prisma.dailyEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(entries)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { date, platform, impressions, views, likes, comments, shares, saves, followersGained, notes } = body

    const entry = await prisma.dailyEntry.create({
      data: {
        userId: session.user.id,
        date,
        platform,
        impressions: Number(impressions) || 0,
        views: Number(views) || 0,
        likes: Number(likes) || 0,
        comments: Number(comments) || 0,
        shares: Number(shares) || 0,
        saves: Number(saves) || 0,
        followersGained: Number(followersGained) || 0,
        notes: notes || '',
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (err) {
    console.error('[entries POST]', err)
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 })
  }
}

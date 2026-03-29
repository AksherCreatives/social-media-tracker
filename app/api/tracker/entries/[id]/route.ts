import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'

import { authOptions } from '../../../../../lib/auth'
import { prisma } from '../../../../../lib/prisma'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify ownership
  const owned = await prisma.dailyEntry.findFirst({
    where: { id: params.id, userId: session.user.id },
  })
  if (!owned) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const body = await req.json()
    const { date, platform, impressions, views, likes, comments, shares, saves, followersGained, notes } = body

    const updated = await prisma.dailyEntry.update({
      where: { id: params.id },
      data: {
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

    return NextResponse.json(updated)
  } catch (err) {
    console.error('[entries PUT]', err)
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify ownership
  const owned = await prisma.dailyEntry.findFirst({
    where: { id: params.id, userId: session.user.id },
  })
  if (!owned) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.dailyEntry.delete({ where: { id: params.id } })
  return new NextResponse(null, { status: 204 })
}

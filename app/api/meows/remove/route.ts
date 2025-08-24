import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { Meow, AuditEvent } from '@/lib/models'
import { authorized } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    
    const user = authorized(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { meow } = body

    await Meow.updateOne(
      { _id: meow._id, user: user._id },
      { $set: { deactivated: true } }
    )

    // Create audit event
    const auditEvent = new AuditEvent({
      text: `${user.username} removed meow: "${meow.text}"`
    })
    await auditEvent.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing meow:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
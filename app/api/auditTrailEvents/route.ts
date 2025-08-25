import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { AuditEvent } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();

    const events = await AuditEvent.find({
      $or: [{ deactivated: null }, { deactivated: false }],
    })
      .sort('-created')
      .exec();

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching audit events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

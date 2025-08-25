import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Meow, AuditEvent } from '@/lib/models';
import { authorized, generateToken } from '@/lib/auth';
import moment from 'moment';

export async function GET() {
  try {
    await dbConnect();

    const meows = await Meow.find({
      $or: [{ deactivated: null }, { deactivated: false }],
    })
      .sort('-created')
      .exec();

    return NextResponse.json(meows);
  } catch (error) {
    console.error('Error fetching meows:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const user = authorized(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { newMeow } = body;

    // Check if login was within 7 days
    const currentTime = moment();
    const lastLogin = moment(user.lastLogin);

    if (moment.duration(currentTime.diff(lastLogin)).asDays() > 7) {
      return NextResponse.json(
        { error: 'Too long ago login' },
        { status: 400 }
      );
    }

    const meow = new Meow({
      text: newMeow,
      user: user._id,
      username: user.username,
    });

    await meow.save();

    // Create audit event
    const auditEvent = new AuditEvent({
      text: `${user.username} made a new meow: "${newMeow}"`,
    });
    await auditEvent.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating meow:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

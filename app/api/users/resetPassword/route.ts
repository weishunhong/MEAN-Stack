import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models';
import { hashPassword } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { resetEmail } = body;

    const user = await User.findOne({ email: resetEmail });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    const newPassword = Math.random().toString(36).substr(2, 5);
    console.log('New Password: ' + newPassword);

    const hashedPassword = await hashPassword(newPassword);

    await User.updateOne(
      { email: resetEmail },
      { $set: { password: hashedPassword } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

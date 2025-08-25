import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models';
import { comparePassword, generateToken } from '@/lib/auth';
import moment from 'moment';

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { username, password } = body;

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
    }

    // Update last login
    user.lastLogin = moment().format();
    await user.save();

    const token = generateToken({
      _id: user._id,
      username: user.username,
      email: user.email,
      lastLogin: user.lastLogin,
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error signing in:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

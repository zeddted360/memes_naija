import { user } from '@/models/model';
import { connectDB } from '@/utils/connectDB';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const authorId = req.nextUrl.searchParams?.get('author');

  try {
    connectDB;
    const result = await user.findOne({ _id: authorId })  ;
    if (!result) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: result }, { status: 300 });
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json(
      { message: 'Internal server error ' },
      { status: 500 }
    );
  }
};

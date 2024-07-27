import { post } from '@/models/model';
import { connectDB } from '@/utils/connectDB';
import { NextResponse, NextRequest } from 'next/server';

export const POST = async (req: NextRequest, context: any) => {
  const { media } = await req.json();
  const { params } = context;
  const { _id } = params;

  try {
    connectDB();
    const result = await post.findOne({ _id });
    result.media = media;
    await result.save();
    return NextResponse.json({ message: 'file added' });
  } catch (err: any) {
    return NextResponse.json({ message: 'Internal server error' });
  }
};

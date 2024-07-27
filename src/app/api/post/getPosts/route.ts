

import { post } from '@/models/model';
import { connectDB } from '@/utils/connectDB';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    connectDB();
    const searchParams = request.nextUrl?.searchParams;
    const query = searchParams?.toString().slice(0, -1);
    const words = query.replace(/\+/g, ' ');

    if (!query) {
      const result = await post.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ message: result }, { status: 200 });
    }

    const regexQuery = new RegExp(words, 'gim');

    const filteredResult = await post
      .find({ $or: [{ title: regexQuery }, { content: regexQuery }] })
      .sort({ createdAt: -1 });
    if (filteredResult.length === 0 ) {
       return NextResponse.json(
         {
           message: [
             {
               _id:'no match',
               title: "There are no match for this search",
               content: "No resource found",
             },
           ],
           words,
         },
         { status: 200 }
       );
    }
    return NextResponse.json(
      { message: filteredResult, words },
      { status: 200 }
    )
    
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
};

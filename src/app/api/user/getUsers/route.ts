import { user } from "@/models/model";
import { connectDB } from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest) => {
    
    try {
        await connectDB();
        const res = await user.find({});

        return NextResponse.json({ message: res }, { status: 200 });
    } catch (error:any) {
        console.log(error.message)
        return NextResponse.json({ message: 'internal server error' }, { status: 200 });

    }
}
 
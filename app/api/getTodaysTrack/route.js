import { connectDB } from "@/lib/connectDB";
import FoodTrackModel from "@/schema/track";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const start = new Date();
        start.setHours(0, 0, 0, 0); // 00:00:00 today

        const end = new Date();
        end.setHours(23, 59, 59, 999); // 23:59:59 today

        const allTrack = await FoodTrackModel.find({
            createdAt: { $gte: start, $lte: end }
        });

        return NextResponse.json({ allTrack });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
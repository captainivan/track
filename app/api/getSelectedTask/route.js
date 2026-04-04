import { connectDB } from "@/lib/connectDB";
import FoodTrackModel from "@/schema/track";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { date } = await req.json();

    try {
        await connectDB();

        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        const allTrack = await FoodTrackModel.find({
            createdAt: { $gte: start, $lte: end }
        });

        return NextResponse.json({ allTrack });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
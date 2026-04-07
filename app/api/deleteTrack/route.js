import { connectDB } from "@/lib/connectDB";
import FoodTrackModel from "@/schema/track";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
    await connectDB();

    try {
        const { id } = await req.json();

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid or missing ID" },
                { status: 400 }
            );
        }

        // Delete document
        const deleted = await FoodTrackModel.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { message: "Item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "success",
            deleted
        });

    } catch (error) {
        console.error("Delete error:", error);

        return NextResponse.json(
            { message: "failure", error: error.message },
            { status: 500 }
        );
    }
}
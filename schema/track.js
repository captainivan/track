import mongoose from "mongoose"

const FoodTrack = new mongoose.Schema({
    data: {
        type: Array,
        required: true
    }
}, { timestamps: true }) 

const FoodTrackModel = mongoose.models.FoodTrack || mongoose.model("FoodTrack", FoodTrack);

export default FoodTrackModel;
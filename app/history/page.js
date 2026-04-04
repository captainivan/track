"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from '../components/NavBar';
import Navigation from '../components/Navigation';
import { Search, CalendarDays, UtensilsCrossed, Flame, Star, ChevronDown, ChevronUp, Beef, Wheat, Droplets, Leaf, Activity, GlassWater, IceCream2, Dumbbell, Sandwich, Pizza, Cookie, Salad, Camera } from "lucide-react";

const TEAL = "#0D9488"
const TEAL_LIGHT = "#CCFBF1"

const FOOD_TYPE_COLORS = {
    "Healthy": { bg: "#DCFCE7", text: "#16A34A", icon: Salad },
    "Junk": { bg: "#FEE2E2", text: "#DC2626", icon: Pizza },
    "Snack": { bg: "#FEF9C3", text: "#CA8A04", icon: Cookie },
    "Meal": { bg: "#CCFBF1", text: "#0D9488", icon: UtensilsCrossed },
    "Beverage": { bg: "#DBEAFE", text: "#2563EB", icon: GlassWater },
    "Sweet": { bg: "#FCE7F3", text: "#DB2777", icon: IceCream2 },
    "High Protein": { bg: "#EDE9FE", text: "#7C3AED", icon: Dumbbell },
    "Fast Food": { bg: "#FFEDD5", text: "#EA580C", icon: Sandwich },
}

function FoodCard({ food }) {
    const [open, setOpen] = useState(false);
    const typeColor = FOOD_TYPE_COLORS[food.foodType] || { bg: TEAL_LIGHT, text: TEAL, icon: UtensilsCrossed };
    const TypeIcon = typeColor.icon;

    return (
        <div className="w-full rounded-3xl mb-3 overflow-hidden bg-white"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>

            <div className="flex items-center gap-3 p-3">
                <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0"
                    style={{ background: typeColor.bg }}>
                    <TypeIcon className="w-7 h-7" style={{ color: typeColor.text }} />
                    <span className="text-[8px] font-bold mt-1" style={{ color: typeColor.text }}>
                        {food.foodType}
                    </span>
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-800 leading-tight truncate">{food.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Flame className="w-3 h-3" style={{ color: "#F59E0B" }} />
                        <span className="text-xs font-semibold text-gray-500">{food.nutrition.calories_kcal} kcal</span>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs text-gray-400">{food.isProcessed ? "Processed" : "Natural"}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mt-1.5">
                        {[...Array(5)].map((_, s) => (
                            <Star key={s} className="w-3 h-3"
                                style={{ color: s < food.healthRating ? "#F59E0B" : "#E5E7EB", fill: s < food.healthRating ? "#F59E0B" : "#E5E7EB" }} />
                        ))}
                        <span className="text-[10px] text-gray-400 ml-1">{food.healthRating}/5</span>
                    </div>
                </div>

                <button onClick={() => setOpen(!open)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: open ? TEAL : "#F1F5F9" }}>
                    {open ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
            </div>

            {open && (
                <div className="px-4 pb-4 flex flex-col gap-4 border-t border-gray-50 pt-3">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Nutrition</p>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: "Protein", value: food.nutrition.protein_g, unit: "g", color: "#0D9488", icon: Beef },
                                { label: "Carbs", value: food.nutrition.carbs_g, unit: "g", color: "#6366F1", icon: Wheat },
                                { label: "Fat", value: food.nutrition.fat_g, unit: "g", color: "#EF4444", icon: Droplets },
                                { label: "Fiber", value: food.nutrition.fiber_g, unit: "g", color: "#22C55E", icon: Leaf },
                                { label: "Sugar", value: food.nutrition.sugar_g, unit: "g", color: "#EC4899", icon: Activity },
                                { label: "Calories", value: food.nutrition.calories_kcal, unit: "kcal", color: "#F59E0B", icon: Flame },
                            ].map(m => (
                                <div key={m.label} className="flex flex-col gap-1 p-2.5 rounded-2xl" style={{ background: "#F8FAFC" }}>
                                    <m.icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                                    <p className="font-black text-sm text-gray-800 leading-none mt-0.5">
                                        {m.value}<span className="text-[9px] font-medium text-gray-400 ml-0.5">{m.unit}</span>
                                    </p>
                                    <p className="text-[9px] text-gray-400 font-semibold">{m.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Items</p>
                        <div className="flex flex-col gap-1.5">
                            {food.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: "#F8FAFC" }}>
                                    <p className="text-xs font-semibold text-gray-700">{item.itemName}</p>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: TEAL_LIGHT, color: TEAL }}>
                                        {item.itemWeight_g}g
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tags</p>
                        <div className="flex flex-wrap gap-1.5">
                            {food.tags.map((tag, i) => (
                                <span key={i} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                                    style={{ background: TEAL_LIGHT, color: TEAL }}>{tag}</span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1 px-3 py-2 rounded-2xl flex flex-col items-center"
                            style={{
                                background: food.shouldHaveMore === "yes" ? "#DCFCE7" :
                                    food.shouldHaveMore === "no" ? "#FEE2E2" : TEAL_LIGHT
                            }}>
                            <p className="text-[10px] font-bold uppercase"
                                style={{ color: food.shouldHaveMore === "yes" ? "#16A34A" : food.shouldHaveMore === "no" ? "#DC2626" : TEAL }}>
                                {food.shouldHaveMore === "yes" ? "Eat More" : food.shouldHaveMore === "no" ? "Limit" : "Perfect"}
                            </p>
                            <p className="text-[9px] text-gray-400 mt-0.5">Recommendation</p>
                        </div>
                        <div className="flex-1 px-3 py-2 rounded-2xl flex flex-col items-center" style={{ background: "#F8FAFC" }}>
                            <p className="text-[10px] font-bold" style={{ color: TEAL }}>{Math.round(food.confidence * 100)}%</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">AI Confidence</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function History() {
    const [date, setDate] = useState("")
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem("Authentication") !== "true") {
            router.push("/");
        }
    }, []);

    const handleSearch = async () => {
        if (!date) return;
        setLoading(true);
        setSearched(true);
        const api = await fetch("/api/getSelectedTask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date })
        });
        const res = await api.json();
        const allFoods = res.allTrack?.flatMap(t => t.data) || [];
        setTracks(allFoods);
        setLoading(false);
    };

    const formatDate = (d) => {
        if (!d) return "";
        return new Date(d).toLocaleDateString("en-IN", {
            day: "numeric", month: "long", year: "numeric"
        });
    }

    return (
        <div className="h-screen w-full font-sans flex flex-col" style={{ background: "#F0FDFA" }}>
            <NavBar />

            <div className="flex-1 overflow-y-auto px-5 pt-3 pb-4 flex flex-col gap-4"
                style={{ scrollbarWidth: "none" }}>

                {/* heading */}
                <div>
                    <h2 className="font-extrabold text-xl" style={{ color: TEAL }}>History</h2>
                    <p className="text-gray-400 text-xs mt-0.5">Search meals by date</p>
                </div>

                {/* date picker */}
                <div className="w-full rounded-3xl p-4 bg-white flex flex-col gap-3"
                    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl"
                        style={{ background: "#F8FAFC", border: `1.5px solid ${TEAL_LIGHT}` }}>
                        <CalendarDays className="w-4 h-4 shrink-0" style={{ color: TEAL }} />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="flex-1 bg-transparent text-sm font-semibold text-gray-700 outline-none"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={!date}
                        className="w-full py-3.5 rounded-2xl text-white font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-40"
                        style={{
                            background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                            boxShadow: "0 8px 24px rgba(13,148,136,0.35)"
                        }}
                    >
                        <Search className="w-4 h-4" />
                        Search
                    </button>
                </div>

                {/* results */}
                {searched && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-sm text-gray-700">
                                {formatDate(date)}
                            </h3>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                style={{ background: TEAL_LIGHT, color: TEAL }}>
                                {tracks.length} meal{tracks.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        {loading ? (
                            <div className="w-full rounded-2xl p-6 flex items-center justify-center bg-white">
                                <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                                    style={{ borderColor: TEAL }} />
                            </div>
                        ) : tracks.length === 0 ? (
                            <div className="w-full rounded-2xl p-8 flex flex-col items-center gap-3 bg-white"
                                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                    style={{ background: TEAL_LIGHT }}>
                                    <Camera className="w-6 h-6" style={{ color: TEAL }} />
                                </div>
                                <p className="text-gray-400 text-sm font-semibold">No meals found</p>
                                <p className="text-gray-300 text-xs">Nothing tracked on this date</p>
                            </div>
                        ) : (
                            tracks.map((food, i) => <FoodCard key={i} food={food} />)
                        )}
                    </div>
                )}

            </div>

            <Navigation />
        </div>
    );
}
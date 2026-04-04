"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from '../components/NavBar';
import Navigation from '../components/Navigation';
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"
import {
    Flame, Beef, Wheat, Star, Camera, ChevronDown, ChevronUp,
    Leaf, Droplets, Activity, Salad, Pizza, Cookie,
    UtensilsCrossed, GlassWater, IceCream2, Dumbbell, Sandwich
} from "lucide-react";

const GOALS = { protein: 70, calories: 2000, carbs: 300 }
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

function DonutChart({ value, goal, label, color, icon: Icon }) {
    const pct = Math.min((value / goal) * 100, 100)
    const data = [{ value: pct }]

    return (
        <div className="flex flex-col items-center gap-1 p-3 rounded-3xl flex-1"
            style={{ background: "#111827" }}>
            <p className="text-gray-400 text-[9px] font-semibold uppercase tracking-widest">{label}</p>
            <div className="relative">
                <RadialBarChart
                    width={90} height={90} cx={45} cy={45}
                    innerRadius={28} outerRadius={40}
                    data={data} startAngle={90}
                    endAngle={90 - (pct / 100) * 360}
                >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: "#1f2937" }} dataKey="value"
                        angleAxisId={0} fill={color} cornerRadius={8} />
                </RadialBarChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white font-black text-sm leading-none">{value}</span>
                    <span className="text-gray-500 text-[8px]">/{goal}</span>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <Icon className="w-3 h-3" style={{ color }} />
                <p className="text-[9px] font-semibold" style={{ color }}>{Math.round(pct)}%</p>
            </div>
        </div>
    )
}

function FoodCard({ food }) {
    const [open, setOpen] = useState(false);
    const typeColor = FOOD_TYPE_COLORS[food.foodType] || { bg: TEAL_LIGHT, text: TEAL, icon: UtensilsCrossed };
    const TypeIcon = typeColor.icon;

    return (
        <div className="w-full rounded-3xl mb-3 overflow-hidden bg-white"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>

            {/* MAIN ROW */}
            <div className="flex items-center gap-3 p-3">

                {/* Food type icon block */}
                <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0"
                    style={{ background: typeColor.bg }}>
                    <TypeIcon className="w-7 h-7" style={{ color: typeColor.text }} />
                    <span className="text-[8px] font-bold mt-1" style={{ color: typeColor.text }}>
                        {food.foodType}
                    </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-800 leading-tight truncate">{food.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Flame className="w-3 h-3" style={{ color: "#F59E0B" }} />
                        <span className="text-xs font-semibold text-gray-500">{food.nutrition.calories_kcal} kcal</span>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs font-semibold text-gray-400">
                            {food.isProcessed ? "Processed" : "Natural"}
                        </span>
                    </div>
                    <div className="flex items-center gap-0.5 mt-1.5">
                        {[...Array(5)].map((_, s) => (
                            <Star key={s} className="w-3 h-3"
                                style={{ color: s < food.healthRating ? "#F59E0B" : "#E5E7EB", fill: s < food.healthRating ? "#F59E0B" : "#E5E7EB" }} />
                        ))}
                        <span className="text-[10px] text-gray-400 ml-1">{food.healthRating}/5</span>
                    </div>
                </div>

                {/* dropdown toggle */}
                <button onClick={() => setOpen(!open)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all"
                    style={{ background: open ? TEAL : "#F1F5F9" }}>
                    {open
                        ? <ChevronUp className="w-4 h-4 text-white" />
                        : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
            </div>

            {/* DROPDOWN */}
            {open && (
                <div className="px-4 pb-4 flex flex-col gap-4 border-t border-gray-50 pt-3">

                    {/* Macros */}
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
                                <div key={m.label} className="flex flex-col gap-1 p-2.5 rounded-2xl"
                                    style={{ background: "#F8FAFC" }}>
                                    <m.icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                                    <p className="font-black text-sm text-gray-800 leading-none mt-0.5">
                                        {m.value}<span className="text-[9px] font-medium text-gray-400 ml-0.5">{m.unit}</span>
                                    </p>
                                    <p className="text-[9px] text-gray-400 font-semibold">{m.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Items</p>
                        <div className="flex flex-col gap-1.5">
                            {food.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl"
                                    style={{ background: "#F8FAFC" }}>
                                    <p className="text-xs font-semibold text-gray-700">{item.itemName}</p>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                        style={{ background: TEAL_LIGHT, color: TEAL }}>
                                        {item.itemWeight_g}g
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vitamins */}
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Vitamins</p>
                        <div className="flex flex-wrap gap-2">
                            {food.vitamins.map((v, i) => (
                                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                                    style={{ background: "#F0FDFA", border: `1px solid ${TEAL_LIGHT}` }}>
                                    <Leaf className="w-3 h-3" style={{ color: TEAL }} />
                                    <p className="text-[10px] font-semibold text-gray-600">{v.name}</p>
                                    <p className="text-[10px] text-gray-400">{v.amount_mg}mg</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tags</p>
                        <div className="flex flex-wrap gap-1.5">
                            {food.tags.map((tag, i) => (
                                <span key={i} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                                    style={{ background: TEAL_LIGHT, color: TEAL }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div className="flex gap-2">
                        <div className="flex-1 px-3 py-2 rounded-2xl flex flex-col items-center"
                            style={{
                                background: food.shouldHaveMore === "yes" ? "#DCFCE7" :
                                    food.shouldHaveMore === "no" ? "#FEE2E2" : TEAL_LIGHT
                            }}>
                            <p className="text-[10px] font-bold uppercase tracking-wide"
                                style={{
                                    color: food.shouldHaveMore === "yes" ? "#16A34A" :
                                        food.shouldHaveMore === "no" ? "#DC2626" : TEAL
                                }}>
                                {food.shouldHaveMore === "yes" ? "Eat More" :
                                    food.shouldHaveMore === "no" ? "Limit" : "Perfect"}
                            </p>
                            <p className="text-[9px] text-gray-400 mt-0.5">Recommendation</p>
                        </div>

                        <div className="flex-1 px-3 py-2 rounded-2xl flex flex-col items-center"
                            style={{ background: "#F8FAFC" }}>
                            <p className="text-[10px] font-bold" style={{ color: TEAL }}>
                                {Math.round(food.confidence * 100)}%
                            </p>
                            <p className="text-[9px] text-gray-400 mt-0.5">AI Confidence</p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default function Dashboard() {
    const router = useRouter();
    const [nutrition, setNutrition] = useState({ calories: 0, protein: 0, carbs: 0 });
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (localStorage.getItem("Authentication") !== "true") {
            router.push("/");
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const api = await fetch("/api/getTodaysTrack");
                const res = await api.json();
                if (res.allTrack?.length > 0) {
                    setTracks(res.allTrack);
                    let calories = 0, protein = 0, carbs = 0;
                    res.allTrack.forEach(track => {
                        track.data.forEach(food => {
                            calories += food.nutrition.calories_kcal || 0;
                            protein += food.nutrition.protein_g || 0;
                            carbs += food.nutrition.carbs_g || 0;
                        });
                    });
                    setNutrition({
                        calories: Math.round(calories),
                        protein: Math.round(protein),
                        carbs: Math.round(carbs)
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalMeals = tracks.reduce((acc, t) => acc + t.data.length, 0);
    const avgHealth = tracks.length > 0
        ? (tracks.reduce((acc, t) => acc + t.data.reduce((a, f) => a + f.healthRating, 0), 0) / totalMeals).toFixed(1)
        : 0;

    return (
        <div className="h-screen w-full font-sans flex flex-col" style={{ background: "#F0FDFA" }}>
            <NavBar />

            <div className="flex-1 overflow-y-auto px-5 pt-3 pb-4 flex flex-col gap-4"
                style={{ scrollbarWidth: "none" }}>

                {/* greeting */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-extrabold text-xl" style={{ color: TEAL }}>Today's Nutrition</h2>
                        <p className="text-gray-400 text-xs mt-0.5">Track your daily intake</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex flex-col items-center px-3 py-2 rounded-2xl bg-white"
                            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                            <p className="font-black text-base text-gray-800 leading-none">{totalMeals}</p>
                            <p className="text-[9px] text-gray-400 font-semibold mt-0.5">Meals</p>
                        </div>
                        <div className="flex flex-col items-center px-3 py-2 rounded-2xl bg-white"
                            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                            <div className="flex items-center gap-0.5">
                                <p className="font-black text-base text-gray-800 leading-none">{avgHealth}</p>
                                <Star className="w-3 h-3" style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                            </div>
                            <p className="text-[9px] text-gray-400 font-semibold mt-0.5">Avg</p>
                        </div>
                    </div>
                </div>

                {/* charts */}
                <div className="flex gap-2 w-full">
                    <DonutChart value={nutrition.protein} goal={GOALS.protein} label="Protein" color="#0D9488" icon={Beef} />
                    <DonutChart value={nutrition.calories} goal={GOALS.calories} label="Calories" color="#F59E0B" icon={Flame} />
                    <DonutChart value={nutrition.carbs} goal={GOALS.carbs} label="Carbs" color="#6366F1" icon={Wheat} />
                </div>

                {/* today's meals */}
                <div>
                    <h3 className="font-bold text-sm text-gray-700 mb-3">Today's Meals</h3>

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
                            <p className="text-gray-400 text-sm font-semibold">No meals tracked yet</p>
                            <p className="text-gray-300 text-xs">Scan your food to get started</p>
                        </div>
                    ) : (
                        tracks.map((track, i) =>
                            track.data.map((food, j) => (
                                <FoodCard key={`${i}-${j}`} food={food} />
                            ))
                        )
                    )}
                </div>

            </div>

            <Navigation />
        </div>
    );
}
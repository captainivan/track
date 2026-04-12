"use client"
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import NavBar from '../components/NavBar';
import Navigation from '../components/Navigation';
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"
import { Flame, Beef, Wheat, Star, Camera, ChevronDown, ChevronUp, Leaf, Droplets, Activity, Salad, Pizza, Cookie, UtensilsCrossed, GlassWater, IceCream2, Dumbbell, Sandwich, Trash2, Lightbulb } from "lucide-react";

const GOALS = { protein: 70, calories: 2000, carbs: 300 }
const TEAL = "#0D9488"

const FOOD_TYPE_COLORS = {
    "Healthy": { bg: "#14532D", text: "#4ADE80", icon: Salad },
    "Junk": { bg: "#7F1D1D", text: "#FCA5A5", icon: Pizza },
    "Snack": { bg: "#713F12", text: "#FCD34D", icon: Cookie },
    "Meal": { bg: "#134E4A", text: "#5EEAD4", icon: UtensilsCrossed },
    "Beverage": { bg: "#1E3A5F", text: "#93C5FD", icon: GlassWater },
    "Sweet": { bg: "#831843", text: "#F9A8D4", icon: IceCream2 },
    "High Protein": { bg: "#3B0764", text: "#C4B5FD", icon: Dumbbell },
    "Fast Food": { bg: "#7C2D12", text: "#FDBA74", icon: Sandwich },
}

function DonutChart({ value, goal, label, color, icon: Icon }) {
    const pct = Math.min((value / goal) * 100, 100)
    const data = [{ value: pct }]
    const containerRef = useRef(null);
    const [size, setSize] = useState(90);

    useEffect(() => {
        const update = () => {
            if (containerRef.current) setSize(containerRef.current.offsetWidth);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const r1 = size * 0.31;
    const r2 = size * 0.44;

    return (
        <div className="flex flex-col items-center gap-1 p-2 rounded-3xl flex-1 min-w-0"
            style={{ background: "#161B27", border: "1px solid #1F2937" }}>
            <p className="font-semibold uppercase tracking-widest"
                style={{ fontSize: "clamp(7px, 1.8vw, 10px)", color: "#6B7280" }}>{label}</p>
            <div className="relative w-full" ref={containerRef}>
                <RadialBarChart
                    width={size} height={size}
                    cx={size / 2} cy={size / 2}
                    innerRadius={r1} outerRadius={r2}
                    data={data} startAngle={90}
                    endAngle={90 - (pct / 100) * 360}
                >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: "#1F2937" }} dataKey="value"
                        angleAxisId={0} fill={color} cornerRadius={6} />
                </RadialBarChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white font-black leading-none"
                        style={{ fontSize: "clamp(10px, 3vw, 16px)" }}>{value}</span>
                    <span style={{ fontSize: "clamp(7px, 1.8vw, 10px)", color: "#4B5563" }}>/{goal}</span>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <Icon style={{ color, width: "clamp(9px, 2vw, 13px)", height: "clamp(9px, 2vw, 13px)" }} />
                <p className="font-semibold" style={{ color, fontSize: "clamp(7px, 1.8vw, 10px)" }}>
                    {Math.round(pct)}%
                </p>
            </div>
        </div>
    )
}

const handleTrashClick = async (id, onDelete) => {
    const confirmDelete = confirm("Are you sure you want to delete this meal?");
    if (!confirmDelete) return;
    const api = await fetch("/api/deleteTrack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });
    const res = await api.json();
    if (res.message === "success") {
        onDelete();
    } else {
        alert("Something went wrong");
    }
};

function ItemRow({ item }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-2xl overflow-hidden" style={{ background: "#1F2937" }}>
            {/* item header */}
            <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "#D1D5DB" }}>{item.itemName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-semibold" style={{ color: "#F59E0B" }}>
                            {item.itemCalories_kcal} kcal
                        </span>
                        <span style={{ color: "#374151" }}>·</span>
                        <span className="text-[10px] font-semibold" style={{ color: "#0D9488" }}>
                            {item.itemProtein_g}g protein
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "#134E4A", color: "#5EEAD4" }}>
                        {item.itemWeight_g}g
                    </span>
                    <button onClick={() => setOpen(!open)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                        style={{ background: open ? TEAL : "#2D3748" }}>
                        {open
                            ? <ChevronUp className="w-3 h-3 text-white" />
                            : <ChevronDown className="w-3 h-3" style={{ color: "#6B7280" }} />}
                    </button>
                </div>
            </div>

            {/* item detail dropdown */}
            {open && (
                <div className="px-3 pb-3 pt-1" style={{ borderTop: "1px solid #2D3748" }}>
                    <div className="grid grid-cols-3 gap-1.5 mt-2">
                        {[
                            { label: "Calories", value: item.itemCalories_kcal, unit: "kcal", color: "#F59E0B", icon: Flame },
                            { label: "Protein", value: item.itemProtein_g, unit: "g", color: "#0D9488", icon: Beef },
                            { label: "Carbs", value: item.itemCarbs_g, unit: "g", color: "#6366F1", icon: Wheat },
                            { label: "Fat", value: item.itemFat_g, unit: "g", color: "#EF4444", icon: Droplets },
                            { label: "Fiber", value: item.itemFiber_g, unit: "g", color: "#22C55E", icon: Leaf },
                            { label: "Sugar", value: item.itemSugar_g, unit: "g", color: "#EC4899", icon: Activity },
                        ].map(m => (
                            <div key={m.label} className="flex flex-col gap-0.5 p-2 rounded-xl"
                                style={{ background: "#161B27" }}>
                                <m.icon className="w-3 h-3" style={{ color: m.color }} />
                                <p className="font-black text-xs leading-none mt-0.5" style={{ color: "#F9FAFB" }}>
                                    {m.value}<span className="text-[8px] font-medium ml-0.5" style={{ color: "#6B7280" }}>{m.unit}</span>
                                </p>
                                <p className="text-[8px] font-semibold" style={{ color: "#6B7280" }}>{m.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function FoodCard({ food, id, onDelete, model }) {

    const [open, setOpen] = useState(false);
    const typeColor = FOOD_TYPE_COLORS[food.foodType] || { bg: "#134E4A", text: "#5EEAD4", icon: UtensilsCrossed };
    const TypeIcon = typeColor.icon;

    return (
        <div className="w-full rounded-3xl mb-3 overflow-hidden"
            style={{ background: "#161B27", border: "1px solid #1F2937", boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>

            {/* MAIN ROW */}
            <div className="flex items-center gap-3 p-3">
                <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0"
                    style={{ background: typeColor.bg }}>
                    <TypeIcon className="w-7 h-7" style={{ color: typeColor.text }} />
                    <span className="text-[8px] font-bold mt-1" style={{ color: typeColor.text }}>
                        {food.foodType}
                    </span>
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm leading-tight truncate" style={{ color: "#F9FAFB" }}>{food.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Flame className="w-3 h-3" style={{ color: "#F59E0B" }} />
                        <span className="text-xs font-semibold" style={{ color: "#9CA3AF" }}>{food.nutrition.calories_kcal} kcal</span>
                        <span style={{ color: "#374151" }}>·</span>
                        <span className="text-xs font-semibold" style={{ color: "#6B7280" }}>
                            {food.isProcessed ? "Processed" : "Natural"}
                        </span>
                    </div>
                    <div className="flex items-center gap-0.5 mt-1.5">
                        {[...Array(5)].map((_, s) => (
                            <Star key={s} className="w-3 h-3"
                                style={{ color: s < food.healthRating ? "#F59E0B" : "#374151", fill: s < food.healthRating ? "#F59E0B" : "#374151" }} />
                        ))}
                        <span className="text-[10px] ml-1" style={{ color: "#6B7280" }}>{food.healthRating}/5</span>
                    </div>
                </div>

                <button onClick={() => setOpen(!open)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all"
                    style={{ background: open ? TEAL : "#1F2937" }}>
                    {open
                        ? <ChevronUp className="w-4 h-4 text-white" />
                        : <ChevronDown className="w-4 h-4" style={{ color: "#6B7280" }} />}
                </button>
            </div>

            {/* DROPDOWN */}
            {open && (
                <div className="px-4 pb-4 flex flex-col gap-4 pt-3"
                    style={{ borderTop: "1px solid #1F2937" }}>

                    {/* Tip */}
                    {food.tip && (
                        <div className="flex items-start gap-2 px-3 py-2.5 rounded-2xl"
                            style={{ background: "#1A2535", border: "1px solid #1E3A5F" }}>
                            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#93C5FD" }} />
                            <p className="text-xs font-medium" style={{ color: "#93C5FD" }}>{food.tip}</p>
                        </div>
                    )}

                    {/* Nutrition */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#4B5563" }}>Nutrition</p>
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
                                    style={{ background: "#1F2937" }}>
                                    <m.icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                                    <p className="font-black text-sm leading-none mt-0.5" style={{ color: "#F9FAFB" }}>
                                        {m.value}<span className="text-[9px] font-medium ml-0.5" style={{ color: "#6B7280" }}>{m.unit}</span>
                                    </p>
                                    <p className="text-[9px] font-semibold" style={{ color: "#6B7280" }}>{m.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Items — each with its own dropdown */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#4B5563" }}>Items</p>
                        <div className="flex flex-col gap-2">
                            {food.items.map((item, i) => (
                                <ItemRow key={i} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* Vitamins */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#4B5563" }}>Vitamins</p>
                        <div className="flex flex-wrap gap-2">
                            {food.vitamins.map((v, i) => (
                                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                                    style={{ background: "#0D2B29", border: "1px solid #134E4A" }}>
                                    <Leaf className="w-3 h-3" style={{ color: "#5EEAD4" }} />
                                    <p className="text-[10px] font-semibold" style={{ color: "#D1D5DB" }}>{v.name}</p>
                                    <p className="text-[10px]" style={{ color: "#6B7280" }}>{v.amount_mg}mg</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#4B5563" }}>Tags</p>
                        <div className="flex flex-wrap gap-1.5">
                            {food.tags.map((tag, i) => (
                                <span key={i} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                                    style={{ background: "#134E4A", color: "#5EEAD4" }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div className="flex gap-2">
                        <div className="flex-1 px-3 py-2 rounded-2xl flex flex-col items-center"
                            style={{
                                background: food.shouldHaveMore === "yes" ? "#14532D" :
                                    food.shouldHaveMore === "no" ? "#7F1D1D" : "#134E4A"
                            }}>
                            <p className="text-[10px] font-bold uppercase tracking-wide"
                                style={{
                                    color: food.shouldHaveMore === "yes" ? "#4ADE80" :
                                        food.shouldHaveMore === "no" ? "#FCA5A5" : "#5EEAD4"
                                }}>
                                {food.shouldHaveMore === "yes" ? "Eat More" :
                                    food.shouldHaveMore === "no" ? "Limit" : "Perfect"}
                            </p>
                            <p className="text-[9px] mt-0.5" style={{ color: "#6B7280" }}>Recommendation</p>
                        </div>
                        <div className="flex-1 px-3 py-2 rounded-2xl flex flex-col items-center"
                            style={{ background: "#1F2937" }}>
                            <p className="text-[10px] font-bold" style={{ color: TEAL }}>
                                {Math.round(food.confidence * 100)}%
                            </p>
                            <p className="text-[9px] mt-0.5" style={{ color: "#6B7280" }}>AI Confidence</p>
                        </div>
                    </div>

                    {/* Delete */}
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                            style={{ background: "#1F2937", border: "1px solid #2D3748" }}>
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#5EEAD4" }} />
                            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#5EEAD4" }}>
                                {model || "MODEL not found"}
                            </span>
                        </div>
                        <button
                            onClick={() => handleTrashClick(id, onDelete)}
                            className="group flex items-center gap-2 px-3 py-2 rounded-xl transition-all active:scale-95"
                            style={{ background: "rgba(127,29,29,0.15)", border: "1px solid rgba(239,68,68,0.25)" }}>
                            <Trash2 className="w-4 h-4 transition-all group-hover:scale-110" style={{ color: "#F87171" }} />
                        </button>
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

    const fetchData = async () => {
        try {
            const api = await fetch("/api/getTodaysTrack");
            const res = await api.json();
            console.log(res);

            if (res.allTrack?.length > 0) {
                setTracks(res.allTrack.reverse());
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
            } else {
                setTracks([]);
                setNutrition({ calories: 0, protein: 0, carbs: 0 });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const totalMeals = tracks.reduce((acc, t) => acc + t.data.length, 0);
    const avgHealth = tracks.length > 0
        ? (tracks.reduce((acc, t) => acc + t.data.reduce((a, f) => a + f.healthRating, 0), 0) / totalMeals).toFixed(1)
        : 0;

    return (
        <div className="h-screen w-full font-sans flex flex-col" style={{ background: "#0B0F1A" }}>
            <NavBar />

            <div className="flex-1 overflow-y-auto px-5 pt-3 pb-4 flex flex-col gap-4"
                style={{ scrollbarWidth: "none" }}>

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-extrabold text-xl" style={{ color: "#5EEAD4" }}>Today's Nutrition</h2>
                        <p className="text-xs mt-0.5" style={{ color: "#4B5563" }}>Track your daily intake</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex flex-col items-center px-3 py-2 rounded-2xl"
                            style={{ background: "#161B27", border: "1px solid #1F2937" }}>
                            <p className="font-black text-base leading-none" style={{ color: "#F9FAFB" }}>{totalMeals}</p>
                            <p className="text-[9px] font-semibold mt-0.5" style={{ color: "#6B7280" }}>Meals</p>
                        </div>
                        <div className="flex flex-col items-center px-3 py-2 rounded-2xl"
                            style={{ background: "#161B27", border: "1px solid #1F2937" }}>
                            <div className="flex items-center gap-0.5">
                                <p className="font-black text-base leading-none" style={{ color: "#F9FAFB" }}>{avgHealth}</p>
                                <Star className="w-3 h-3" style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                            </div>
                            <p className="text-[9px] font-semibold mt-0.5" style={{ color: "#6B7280" }}>Avg</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 w-full">
                    <DonutChart value={nutrition.protein} goal={GOALS.protein} label="Protein" color="#0D9488" icon={Beef} />
                    <DonutChart value={nutrition.calories} goal={GOALS.calories} label="Calories" color="#F59E0B" icon={Flame} />
                    <DonutChart value={nutrition.carbs} goal={GOALS.carbs} label="Carbs" color="#6366F1" icon={Wheat} />
                </div>

                <div>
                    <h3 className="font-bold text-sm mb-3" style={{ color: "#D1D5DB" }}>Today's Meals</h3>
                    {loading ? (
                        <div className="w-full rounded-2xl p-6 flex items-center justify-center"
                            style={{ background: "#161B27" }}>
                            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                                style={{ borderColor: TEAL }} />
                        </div>
                    ) : tracks.length === 0 ? (
                        <div className="w-full rounded-2xl p-8 flex flex-col items-center gap-3"
                            style={{ background: "#161B27", border: "1px solid #1F2937" }}>
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                style={{ background: "#134E4A" }}>
                                <Camera className="w-6 h-6" style={{ color: "#5EEAD4" }} />
                            </div>
                            <p className="text-sm font-semibold" style={{ color: "#6B7280" }}>No meals tracked yet</p>
                            <p className="text-xs" style={{ color: "#374151" }}>Scan your food to get started</p>
                        </div>
                    ) : (
                        tracks.map((track, i) =>
                            track.data.map((food, j) => (
                                <FoodCard key={`${i}-${j}`} food={food} id={track._id} model={track.model} onDelete={fetchData} />
                            ))
                        )
                    )}
                </div>
            </div>

            <Navigation />
        </div>
    );
}
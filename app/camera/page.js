"use client"
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from '../components/NavBar';
import Navigation from '../components/Navigation';
import { ArrowRight, Camera, ImageIcon, Sparkles, MessageSquarePlus, X } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";

const TEAL = "#0D9488";
const TEAL_GRAD = "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)";
const TEAL_SHADOW = "0 8px 24px rgba(13,148,136,0.35)";

export default function CameraPage() {
    const router = useRouter();
    const galleryRef = useRef(null);
    const cameraRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [textswitch, setTextSwitch] = useState(false);
    const [text, setText] = useState("");

    useEffect(() => {
        if (localStorage.getItem("Authentication") !== "true") {
            router.push("/");
        }
    }, []);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
    };

    const handleAnalyze = async () => {
        setLoading(true);
        const base64 = await new Promise((resolve) => {
            fetch(preview)
                .then(r => r.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result.split(",")[1]);
                    reader.readAsDataURL(blob);
                });
        });

        const api = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base64Image: base64, text: text })
        });
        const res = await api.json();
        localStorage.setItem("lastScan", JSON.stringify(res.analysis[0]));
        router.push("/dashboard");
        setLoading(false);
    }

    return (
        <div className="h-screen w-full relative overflow-hidden font-sans flex flex-col"
            style={{ background: "#0B0F1A" }}>

            <NavBar />

            <div className="flex-1 flex flex-col px-6 gap-4 pt-4 pb-4 overflow-y-auto"
                style={{ scrollbarWidth: "none" }}>

                {/* Heading + toggle */}
                <div className="w-full flex items-center justify-between">
                    <div>
                        <h2 className="font-extrabold text-xl" style={{ color: "#5EEAD4" }}>Scan your meal</h2>
                        <p className="text-xs mt-0.5" style={{ color: "#4B5563" }}>Take a photo or upload from gallery</p>
                    </div>

                    <button
                        onClick={() => setTextSwitch(!textswitch)}
                        className="flex items-center gap-2 px-3 py-2 rounded-2xl transition-all"
                        style={{
                            background: textswitch ? "#134E4A" : "#161B27",
                            border: `1.5px solid ${textswitch ? TEAL : "#1F2937"}`
                        }}
                    >
                        <MessageSquarePlus className="w-3.5 h-3.5" style={{ color: textswitch ? "#5EEAD4" : "#6B7280" }} />
                        <span className="text-[11px] font-bold" style={{ color: textswitch ? "#5EEAD4" : "#6B7280" }}>
                            Add Note
                        </span>
                    </button>
                </div>

                {/* Preview */}
                {preview ? (
                    <div className="w-full rounded-3xl overflow-hidden relative"
                        style={{ height: "260px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                        <img src={preview} alt="preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full"
                            style={{ background: "rgba(13,148,136,0.3)", backdropFilter: "blur(8px)", border: "1px solid rgba(94,234,212,0.3)" }}>
                            <Sparkles className="w-3 h-3" style={{ color: "#5EEAD4" }} />
                            <span className="text-[10px] font-semibold" style={{ color: "#5EEAD4" }}>Ready to analyze</span>
                        </div>
                        <button
                            onClick={() => setPreview(null)}
                            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
                        >
                            <X className="w-3.5 h-3.5 text-white" />
                        </button>
                    </div>
                ) : (
                    <div
                        className="w-full rounded-3xl flex flex-col items-center justify-center gap-3 relative overflow-hidden"
                        style={{ height: "260px", background: "#0D1F1E", border: `2px dashed #134E4A` }}
                    >
                        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
                            style={{ background: TEAL }} />
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10"
                            style={{ background: TEAL }} />
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center z-10"
                            style={{ background: TEAL_GRAD, boxShadow: TEAL_SHADOW }}>
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-sm font-semibold z-10" style={{ color: "#6B7280" }}>No image selected</p>
                        <p className="text-xs z-10" style={{ color: "#374151" }}>Supports JPG, PNG, WEBP</p>
                    </div>
                )}

                {/* Note input */}
                {textswitch && (
                    <div className="w-full rounded-2xl overflow-hidden"
                        style={{
                            border: `1.5px solid #134E4A`,
                            background: "#161B27",
                            boxShadow: TEAL_SHADOW
                        }}>
                        <div className="flex items-center gap-2 px-4 py-2"
                            style={{ background: "#0D2B29", borderBottom: "1px solid #134E4A" }}>
                            <MessageSquarePlus className="w-3.5 h-3.5" style={{ color: "#5EEAD4" }} />
                            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#5EEAD4" }}>
                                Additional Note
                            </span>
                        </div>
                        <textarea
                            rows={3}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="e.g. This was my lunch, extra spicy, no oil used..."
                            className="w-full px-4 py-3 text-sm outline-none resize-none"
                            style={{
                                background: "#161B27",
                                color: "#D1D5DB",
                                caretColor: TEAL,
                            }}
                        />
                        {text.length > 0 && (
                            <div className="flex items-center justify-between px-4 py-2"
                                style={{ borderTop: "1px solid #1F2937" }}>
                                <span className="text-[10px]" style={{ color: "#4B5563" }}>{text.length} characters</span>
                                <button onClick={() => setText("")}
                                    className="text-[10px] font-bold" style={{ color: "#5EEAD4" }}>
                                    Clear
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Buttons */}
                <div className="w-full flex gap-3">
                    <button
                        onClick={() => galleryRef.current.click()}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 active:scale-95 transition-transform"
                        style={{ borderColor: "#134E4A", background: "#0D2B29", color: "#5EEAD4" }}
                    >
                        <ImageIcon className="w-4 h-4" />
                        <span className="font-bold text-sm">Gallery</span>
                    </button>
                    <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />

                    <button
                        onClick={() => cameraRef.current.click()}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl active:scale-95 transition-transform text-white"
                        style={{ background: TEAL_GRAD, boxShadow: TEAL_SHADOW }}
                    >
                        <Camera className="w-4 h-4" />
                        <span className="font-bold text-sm">Camera</span>
                    </button>
                    <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImage} />
                </div>

                {/* Analyze */}
                {preview && (
                    <button
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold tracking-widest uppercase text-sm active:scale-95 transition-transform"
                        style={{ background: TEAL_GRAD, boxShadow: TEAL_SHADOW }}
                        onClick={handleAnalyze}
                        disabled={loading}
                    >
                        {loading ? (
                            <Spinner className="size-6" />
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Analyze Food
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                )}

            </div>

            <Navigation />
        </div>
    );
}
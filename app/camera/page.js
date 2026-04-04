"use client"
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from '../components/NavBar';
import Navigation from '../components/Navigation';
import { ArrowRight, Camera, ImageIcon, Sparkles } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";

const TEAL = "#0D9488";
const TEAL_LIGHT = "#CCFBF1";
const TEAL_GRAD = "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)";
const TEAL_SHADOW = "0 8px 24px rgba(13,148,136,0.35)";

export default function CameraPage() {
    const router = useRouter();
    const galleryRef = useRef(null);
    const cameraRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false)

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
            body: JSON.stringify({ base64Image: base64 })
        });
        const res = await api.json();
        console.log(res);
        alert("Analysis completed")
        setLoading(false);
    }

    return (
        <div className="h-screen w-full relative overflow-hidden font-sans flex flex-col" style={{ background: "#F0FDFA" }}>

            <NavBar />

            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">

                {/* Heading */}
                <div className="w-full">
                    <h2 className="font-extrabold text-xl" style={{ color: TEAL }}>Scan your meal</h2>
                    <p className="text-gray-400 text-xs mt-0.5">Take a photo or upload from gallery</p>
                </div>

                {/* Preview */}
                {preview ? (
                    <div className="w-full rounded-3xl overflow-hidden shadow-xl relative" style={{ height: "300px" }}>
                        <img src={preview} alt="preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            <Sparkles className="w-3 h-3 text-white" />
                            <span className="text-white text-[10px] font-semibold">Ready to analyze</span>
                        </div>
                    </div>
                ) : (
                    <div
                        className="w-full rounded-3xl flex flex-col items-center justify-center gap-3 relative overflow-hidden"
                        style={{ height: "300px", background: TEAL_LIGHT, border: `2px dashed #5EEAD4` }}
                    >
                        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30" style={{ background: TEAL }} />
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20" style={{ background: TEAL }} />

                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center z-10"
                            style={{ background: TEAL_GRAD, boxShadow: TEAL_SHADOW }}
                        >
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-gray-500 text-sm font-semibold z-10">No image selected</p>
                        <p className="text-gray-400 text-xs z-10">Supports JPG, PNG, WEBP</p>
                    </div>
                )}

                {/* Buttons */}
                <div className="w-full flex gap-3">
                    <button
                        onClick={() => galleryRef.current.click()}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 active:scale-95 transition-transform"
                        style={{ borderColor: TEAL, background: TEAL_LIGHT, color: TEAL }}
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
                    >
                        {loading ?
                            (
                                <Spinner className="size-6"  />
                            ) :
                            (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Analyze Food
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )
                        }
                    </button>
                )}

            </div>

            <Navigation />
        </div>
    );
}
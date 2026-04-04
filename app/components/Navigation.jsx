"use client"
import { Home, Camera, History } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const Navigation = () => {
    const router = useRouter();
    const pathname = usePathname();

    const tabs = [
        { name: "dashboard", icon: Home, label: "Home" },
        { name: "camera", icon: Camera, label: "Scan" },
        { name: "history", icon: History, label: "History" },
    ];

    return (
        <div className="px-5 pb-8 pt-2">
            <div
                className="w-full flex items-center justify-around p-1.5 rounded-[2rem]"
                style={{
                    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                    boxShadow: "0 8px 32px rgba(13,148,136,0.4)",
                }}
            >
                {tabs.map((e, i) => {
                    const isActive = pathname === `/${e.name}`;
                    return (
                        <button
                            key={i}
                            onClick={() => router.push(`/${e.name}`)}
                            className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-[1.6rem] transition-all duration-300 ${
                                isActive ? "bg-white px-7 shadow-md" : "px-5 active:scale-90"
                            }`}
                        >
                            <e.icon
                                strokeWidth={isActive ? 2.5 : 1.6}
                                className={`w-5 h-5 transition-all duration-300 ${isActive ? "text-[#0D9488]" : "text-white"}`}
                            />
                            {isActive && (
                                <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "#0D9488" }}>
                                    {e.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Navigation;
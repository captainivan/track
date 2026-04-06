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
        <div className="px-5 pb-8 pt-2 bg-[#0b0f1a]">
            <div
                className="w-full flex items-center justify-around p-1.5 rounded-[2rem] border border-white/5 backdrop-blur-md"
                style={{
                    background: "rgba(17, 24, 39, 0.7)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                }}
            >
                {tabs.map((e, i) => {
                    const isActive = pathname === `/${e.name}`;
                    return (
                        <button
                            key={i}
                            onClick={() => router.push(`/${e.name}`)}
                            className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-[1.6rem] transition-all duration-300 ${
                                isActive
                                    ? "bg-[#111827] px-7 shadow-lg scale-105"
                                    : "px-5 active:scale-90 hover:scale-95"
                            }`}
                        >
                            <e.icon
                                strokeWidth={isActive ? 2.5 : 1.6}
                                className={`w-5 h-5 transition-all duration-300 ${
                                    isActive ? "text-teal-400" : "text-gray-400"
                                }`}
                            />
                            {isActive && (
                                <span className="text-[9px] font-bold tracking-widest uppercase text-teal-400">
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
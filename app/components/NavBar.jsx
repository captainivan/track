import { Menu } from 'lucide-react'

const NavBar = () => {
    return (
        <div className="flex items-center justify-between px-6 pt-8 pb-3">

            {/* Menu */}
            <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#CCFBF1" }}>
                <Menu className="w-5 h-5" style={{ color: "#0D9488" }} />
            </button>

            {/* Logo */}
            <div className="flex flex-col items-center">
                <h1
                    className="font-black tracking-widest leading-none"
                    style={{
                        fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
                        fontSize: "1.5rem",
                        letterSpacing: "0.25em",
                        color: "#0D9488"
                    }}
                >
                    NUTRIX
                </h1>
                <span className="text-[8px] tracking-[0.3em] font-semibold" style={{ color: "#5EEAD4" }}>
                    SNAP · SCAN · EAT
                </span>
            </div>

            {/* Avatar */}
            <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                style={{
                    background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                    boxShadow: "0 4px 12px rgba(13,148,136,0.35)"
                }}
            >
                L
            </div>

        </div>
    )
}

export default NavBar
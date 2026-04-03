"use client"
import { Eye, EyeClosed, EyeOff } from 'lucide-react';
import { useState } from "react";

export default function Home() {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSingIn = () =>{
    if(username == process.env.USERNAME && password == process.env.PASSWORD){

    }else{
      alert("Invalid credentials")
    }
  }

  return (
    <div className="h-screen w-full bg-[#FFA600] relative overflow-hidden font-sans">

      {/* Ambient glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-yellow-300 opacity-30 rounded-full blur-3xl pointer-events-none" />

      {/* TOP SECTION */}
      <div className="h-[42%] w-full flex flex-col items-center justify-center gap-2 relative z-10">
        <h1
          className="text-white font-black uppercase"
          style={{
            fontSize: "2.6rem",
            fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
            textShadow: "0 2px 20px rgba(0,0,0,0.15)",
            letterSpacing: "0.3em",
          }}
        >
          NUTRIX
        </h1>
        <p
          className="text-white/80 text-xs font-medium uppercase"
          style={{ letterSpacing: "0.45em" }}
        >
          SNAP · SCAN · EAT
        </p>
      </div>

      {/* BOTTOM CARD */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white px-7 pt-9 pb-10 flex flex-col gap-5"
        style={{
          borderTopLeftRadius: "2.5rem",
          borderTopRightRadius: "2.5rem",
          minHeight: "50%",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Heading */}
        <div className="mb-1">
          <h2
            className="text-gray-900 font-bold"
            style={{ fontSize: "1.6rem", fontFamily: "'Bebas Neue', 'Arial Black', sans-serif", letterSpacing: "0.05em" }}
          >
            Welcome back
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">Sign in to continue your journey</p>
        </div>

        {/* Username field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 tracking-widest uppercase">Username</label>
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 focus-within:border-[#FFA600] focus-within:bg-orange-50 transition-all">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <input
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              type="text"
              placeholder="your_username"
              className="bg-transparent text-gray-800 placeholder-gray-300 text-sm flex-1 outline-none"
            />
          </div>
        </div>

        {/* Password field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 tracking-widest uppercase">Password</label>
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 focus-within:border-[#FFA600] focus-within:bg-orange-50 transition-all">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              type={show ? "text" : "password"}
              placeholder="••••••••"
              className="bg-transparent text-gray-800 placeholder-gray-300 text-sm flex-1 outline-none"
            />
            {show
              ? <Eye onClick={() => setShow(!show)} className="w-4 h-4 text-gray-400 cursor-pointer" />
              : <EyeClosed onClick={() => setShow(!show)} className="w-4 h-4 text-gray-400 cursor-pointer" />
            }
          </div>
        </div>

        {/* Sign in button */}
        <button
          className="w-full py-4 rounded-2xl text-white font-bold tracking-widest uppercase text-sm mt-1 active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(135deg, #FFA600 0%, #FF7A00 100%)",
            boxShadow: "0 8px 24px rgba(255,166,0,0.4)",
            letterSpacing: "0.15em",
          }}
          onClick={handleSingIn}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
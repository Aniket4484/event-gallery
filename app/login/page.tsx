"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      toast.error("चुकीचा Email किंवा Password");
    } else {
      toast.success("स्वागत आहे! 🪷");
      router.push("/admin/dashboard");
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-marathi-gradient dark:bg-marathi-dark lotus-bg flex flex-col">
      {/* Mandap colour stripe at very top */}
      <div className="mandap-border w-full" />

      {/* Decorative corner rangoli blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-maroon-700/10 dark:bg-maroon-700/20 blur-3xl" />
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gold-500/10 dark:bg-gold-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-saffron-500/10 dark:bg-saffron-700/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-maroon-800/10 dark:bg-maroon-800/20 blur-3xl" />
      </div>

      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Main card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Logo block */}
          <div className="text-center mb-8">
            {/* Floral ornament */}
            <div className="text-4xl mb-3 animate-float">🪷</div>
            <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-maroon-800 dark:text-gold-400 tracking-wide">
              WeddingSnaps
            </h1>
            <p className="text-gold-600 dark:text-gold-500 font-script text-xl mt-1">
              शुभ विवाह
            </p>
            <p className="text-maroon-500 dark:text-maroon-300 text-sm mt-1 tracking-widest uppercase">
              Maharashtrian Wedding Gallery
            </p>
          </div>

          {/* Card */}
          <div className="paithani-card bg-ivory/95 dark:bg-maroon-950/95 backdrop-blur-xl p-8 shadow-gold-lg">
            {/* Inner gold top border */}
            <div className="h-0.5 bg-gradient-to-r from-maroon-600 via-gold-400 to-saffron-500 rounded-full mb-6" />

            <h2 className="font-serif text-xl font-semibold text-maroon-800 dark:text-gold-300 mb-6 text-center">
              Photographer Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-maroon-700 dark:text-gold-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl
                      border-2 border-gold-200 dark:border-maroon-700
                      bg-white/80 dark:bg-maroon-900/80
                      text-maroon-900 dark:text-gold-100
                      placeholder-maroon-300 dark:placeholder-maroon-600
                      focus:outline-none focus:border-gold-500 dark:focus:border-gold-500
                      transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-maroon-700 dark:text-gold-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 rounded-xl
                      border-2 border-gold-200 dark:border-maroon-700
                      bg-white/80 dark:bg-maroon-900/80
                      text-maroon-900 dark:text-gold-100
                      placeholder-maroon-300 dark:placeholder-maroon-600
                      focus:outline-none focus:border-gold-500 dark:focus:border-gold-500
                      transition-all duration-200 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-maroon-400 hover:text-maroon-600 dark:hover:text-gold-400 transition-colors"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-white tracking-wide
                  bg-gradient-to-r from-maroon-700 via-maroon-600 to-saffron-600
                  hover:from-maroon-800 hover:to-saffron-700
                  disabled:opacity-60 disabled:pointer-events-none
                  shadow-maroon hover:shadow-maroon-lg
                  transition-all duration-300 hover:scale-[1.02]
                  diya-glow text-sm"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  "🪔  Sign In to Dashboard"
                )}
              </button>
            </form>

            <div className="h-0.5 bg-gradient-to-r from-maroon-600 via-gold-400 to-saffron-500 rounded-full mt-6" />
          </div>

          <p className="text-center text-xs text-maroon-400 dark:text-maroon-600 mt-5">
            WeddingSnaps ✿ Secure Admin Portal
          </p>
        </motion.div>
      </div>

      {/* Bottom mandap stripe */}
      <div className="mandap-border w-full" />
    </div>
  );
}

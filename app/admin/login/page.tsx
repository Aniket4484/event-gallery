"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Welcome back!");
      router.push("/admin/dashboard");
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-wedding-gradient dark:bg-dark-wedding-gradient flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Decorative circles */}
      <div className="fixed top-[-100px] left-[-100px] w-80 h-80 rounded-full bg-rose-200/30 dark:bg-rose-900/20 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-100px] right-[-100px] w-80 h-80 rounded-full bg-champagne-200/30 dark:bg-champagne-900/20 blur-3xl pointer-events-none" />

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 shadow-romantic mb-4 ring-pulse"
            >
              <Heart className="w-8 h-8 text-white fill-white" />
            </motion.div>
            <h1 className="font-script text-4xl text-rose-500 dark:text-rose-400">WeddingSnaps</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Photographer Admin Portal
            </p>
          </div>

          {/* Card */}
          <div className="glass-card rounded-3xl p-8 shadow-romantic">
            <h2 className="font-serif text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
              Sign In
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 transition-all"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" loading={isLoading} className="w-full" size="lg">
                Sign In to Dashboard
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
            WeddingSnaps Admin Panel • Secure Photography Management
          </p>
        </motion.div>
      </div>
    </div>
  );
}

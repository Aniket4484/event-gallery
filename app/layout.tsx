import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "WeddingSnaps — Beautiful Wedding Galleries",
    template: "%s | WeddingSnaps",
  },
  description:
    "Share wedding memories instantly. Photographers upload in real-time, guests view via QR code.",
  keywords: ["wedding", "photography", "gallery", "sharing", "QR code"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="font-sans antialiased">
        <SessionProvider>
          <ThemeProvider>
            <QueryProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  className: "dark:bg-gray-800 dark:text-white",
                  style: { borderRadius: "12px", boxShadow: "0 4px 30px rgba(0,0,0,0.15)" },
                }}
              />
            </QueryProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

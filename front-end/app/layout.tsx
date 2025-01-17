import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/contexts/game-context";
import { SocketProvider } from "@/contexts/socket-io.context";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guess Game",
  description: "Guess Multiplier",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GameProvider>
        <SocketProvider>
          <body className={inter.className}>{children}</body>
          <Toaster richColors position="top-center" />
        </SocketProvider>
      </GameProvider>
    </html>
  );
}

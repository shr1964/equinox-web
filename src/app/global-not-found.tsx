import { Inter, JetBrains_Mono } from "next/font/google";
import { NotFoundPage } from "@/components/organisms/not-found-page";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const jetbrains = JetBrains_Mono({ variable: "--font-mono-jb", subsets: ["latin"], display: "swap" });

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${jetbrains.variable}`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <body className="min-h-full flex flex-col">
        <NotFoundPage />
      </body>
    </html>
  );
}

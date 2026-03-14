import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "@/components/layout/Header";
import BackgroundAnimation from "@/components/layout/BackgroundAnimation";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "FamilyTrip Planner",
  description: "家族旅行の計画と振り返りをサポートするプラットフォーム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body className={`${notoSansJP.className} min-h-screen flex flex-col bg-transparent`}>
          <BackgroundAnimation />
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}

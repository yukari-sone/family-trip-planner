import Link from "next/link";
import { Plane, Search, User } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-[#1A2B4C] text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold font-flight tracking-wider hover:opacity-80 transition-opacity">
          <Plane className="w-6 h-6 text-[#00A4E5]" />
          <span>FAMILYTRIP PLANNER</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/trips" className="flex items-center gap-2 hover:text-[#00A4E5] transition-colors">
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">探す</span>
          </Link>
          <Link href="/mypage" className="flex items-center gap-2 hover:text-[#00A4E5] transition-colors">
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">マイページ</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

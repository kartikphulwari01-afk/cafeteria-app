'use client';

import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, UtensilsCrossed } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f0f14]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="glass-panel p-6 rounded-2xl sticky top-24">
          <h2 className="text-xl font-bold mb-6 text-white">Admin Panel</h2>
          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition text-muted-foreground hover:text-white">
              <LayoutDashboard className="w-5 h-5" />
              Orders Dashboard
            </Link>
            <Link href="/admin/menu" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition text-muted-foreground hover:text-white">
              <UtensilsCrossed className="w-5 h-5" />
              Manage Menu
            </Link>
          </nav>
        </div>
      </aside>
      
      <main className="flex-1 glass-panel p-6 md:p-8 rounded-2xl min-h-[60vh]">
        {children}
      </main>
    </div>
  );
}

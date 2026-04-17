'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { LifeBuoy, LogOut, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { signOut as nextAuthSignOut } from 'next-auth/react';

export default function SettingsPage() {
  const { user, logout } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    logout();
    await nextAuthSignOut({ redirect: false });
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and support.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Support Section */}
        <Link 
          href="/settings/support"
          className="group flex items-center justify-between bg-[#15151a] border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-colors shadow-sm hover:-translate-y-1"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <LifeBuoy className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">Help & Support</h3>
              <p className="text-sm text-muted-foreground">Contact our team, report issues, and get help</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-primary transition-colors" />
        </Link>

        {/* Logout Section */}
        <button 
          onClick={handleLogout}
          className="w-full group flex items-center justify-between bg-[#15151a] border border-white/10 rounded-2xl p-6 hover:border-red-500/50 transition-colors shadow-sm hover:-translate-y-1"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white text-lg group-hover:text-red-400 transition-colors">Logout</h3>
              <p className="text-sm text-muted-foreground">Sign out of your active session</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-red-400 transition-colors" />
        </button>
      </div>
    </div>
  );
}

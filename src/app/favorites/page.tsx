'use client';

import React from 'react';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useUserStore } from '@/store/userStore';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { mockMenu } from '@/lib/mockData';
import { Heart, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { user } = useUserStore();
  const { favoriteIds } = useFavoriteStore();
  
  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4 max-w-4xl mx-auto flex items-center justify-center">
        <div className="text-center py-20 bg-[#15151a] rounded-3xl border border-white/10 w-full">
          <Heart className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Login Required</h3>
          <p className="text-muted-foreground mb-6">Please login to view your favorites.</p>
          <Link href="/auth/login" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(255,90,0,0.3)]">
            Login <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const favoriteItems = mockMenu.filter(item => favoriteIds.includes(item.id));

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Your Favorites</h1>
          <p className="text-muted-foreground">The items you love the most.</p>
        </div>
      </div>

      {favoriteItems.length === 0 ? (
        <div className="text-center py-20 bg-[#15151a] rounded-3xl border border-white/10">
          <Heart className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No favorites yet 💔</h3>
          <p className="text-muted-foreground mb-6">You haven't added any items to your favorites.</p>
          <Link href="/menu" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(255,90,0,0.3)]">
            Explore Menu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteItems.map((item, idx) => (
            <MenuItemCard key={item.id} item={item} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

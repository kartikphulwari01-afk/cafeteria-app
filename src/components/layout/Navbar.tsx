'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu as MenuIcon, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useSystemStore } from '@/store/systemStore';
import { useUserStore } from '@/store/userStore';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { Button } from '@/components/ui/Button';
import { LiveClock } from '@/components/ui/LiveClock';

export const Navbar = () => {
  const { totalItems, isDrawerOpen, setDrawerOpen } = useCartStore();
  const { isOpen } = useSystemStore();
  const { user, login, logout } = useUserStore();
  const pathname = usePathname();

  if (pathname?.includes('/auth')) {
    return null; 
  }

  const handleAuth = () => {
    if (user) {
      logout();
    } else {
      login({ uid: 'mock_uid', name: 'John Doe', email: 'john@example.com', role: 'user' });
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-30 glass border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/home" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black">C</span>
              Cafeteria
            </Link>
            
            <div className="hidden md:flex items-center gap-4">
              <Link href="/menu" className="text-sm font-medium text-muted-foreground hover:text-white transition">Menu</Link>
              {user?.role === 'admin' ? (
                <Link href="/admin" className="text-sm font-medium text-primary hover:text-primary-hover transition">Admin Dashboard</Link>
              ) : user ? (
                <>
                  <Link href="/orders" className="text-sm font-medium text-muted-foreground hover:text-white transition">My Orders</Link>
                  <Link href="/favorites" className="text-sm font-medium text-muted-foreground hover:text-white transition">Favorites</Link>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 mr-2">
              <LiveClock />
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  {isOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>

            {user ? (
              <div className="flex items-center gap-4 border-l border-white/10 pl-4">
                <span className="hidden sm:flex flex-col items-start gap-0.5 text-sm font-medium">
                  <span className="flex items-center gap-2 text-white">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                      <User className="w-3 h-3 text-primary" />
                    </span>
                    {user.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground ml-7 font-bold">
                    Role: {user.role === 'admin' ? 'Admin' : 'Student'}
                  </span>
                </span>
                <Link href="/settings" className="p-2 text-muted-foreground hover:bg-white/10 hover:text-white rounded-full transition ml-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </Link>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden sm:inline-flex bg-primary hover:bg-primary-hover text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-[0_0_15px_rgba(255,90,0,0.3)]">
                Login
              </Link>
            )}

            <button 
              className="relative p-2 text-white hover:bg-white/10 rounded-full transition ml-2"
              onClick={() => setDrawerOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems() > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full pointer-events-none transform translate-x-1 -translate-y-1">
                  {totalItems()}
                </span>
              )}
            </button>
            
            <button className="md:hidden p-2 text-white hover:bg-white/10 rounded-full">
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

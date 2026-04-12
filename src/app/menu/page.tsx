'use client';

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { MenuItem } from "@/lib/mockData";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { Search, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const CATEGORIES = [
  "Breakfast & Drinks",
  "Snacks & Sandwiches",
  "Finger Foods & Noodles",
  "Pizza",
  "South Indian",
  "Mini Meals & Rice",
  "Desserts & Bakery"
];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems, totalPrice, setDrawerOpen } = useCartStore();

  useEffect(() => {
    const fetchItems = async () => {
      const menus = await api.getMenuItems();
      setItems(menus);
      setIsLoading(false);
    };
    fetchItems();
  }, []);

  // Handle scroll spy
  useEffect(() => {
    const handleScroll = () => {
      if (searchQuery) return; // Don't scroll spy when searching

      const sections = CATEGORIES.map(category => document.getElementById(category.replace(/\s+/g, '-').toLowerCase()));
      const scrollPosition = window.scrollY + 200; // offset for sticky header

      let currentCategory = CATEGORIES[0];
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          currentCategory = CATEGORIES[i];
          break;
        }
      }
      setActiveCategory(currentCategory);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [searchQuery]);

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    const element = document.getElementById(category.replace(/\s+/g, '-').toLowerCase());
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 150; // Offset for headers
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const isSearching = searchQuery.trim().length > 0;
  const filteredItems = isSearching ? items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) : items;

  return (
    <div className="relative min-h-screen pb-32">
      {/* Search Header */}
      <div className="bg-[#0f0f14] pt-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-black mb-6 text-white tracking-tight">Cravings, <span className="text-primary">Satisfied.</span></h1>
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search for dishes, categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#15151a] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Sticky Categories Navigation */}
      {!isSearching && (
        <div className="sticky top-16 z-20 bg-[#0f0f14]/90 backdrop-blur-xl border-b border-white/5 py-4 mt-6">
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 sm:px-8 max-w-7xl mx-auto">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap border ${
                  activeCategory === category 
                    ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(255,90,0,0.4)]' 
                    : 'bg-transparent border-white/10 text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu Content */}
      <div className="px-4 sm:px-8 max-w-7xl mx-auto mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-44 rounded-3xl bg-white/5 animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : isSearching ? (
          <div>
            <h2 className="text-xl font-bold mb-6 text-white">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <MenuItemCard key={item.id} item={item} index={index} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-muted-foreground">
                  No items found matching "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {CATEGORIES.map(category => {
              const categoryItems = items.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={category} id={category.replace(/\s+/g, '-').toLowerCase()} className="scroll-mt-40">
                  <h2 className="text-2xl font-bold mb-6 text-white pb-2 border-b border-white/10">{category}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryItems.map((item, index) => (
                      <MenuItemCard key={item.id} item={item} index={index} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button for Cart */}
      <AnimatePresence>
        {totalItems() > 0 && (
          <motion.div 
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-96 z-40"
          >
            <button 
              onClick={() => setDrawerOpen(true)}
              className="w-full bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-4 flex items-center justify-between shadow-[0_10px_40px_rgba(255,90,0,0.5)] border border-white/20 group hover:brightness-110 transition-all duration-300"
            >
              <div className="flex flex-col text-left text-white">
                <span className="text-sm font-bold uppercase tracking-wider">{totalItems()} item{totalItems() !== 1 ? 's' : ''} added</span>
                <span className="text-xl font-black">₹{totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-white bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md group-hover:bg-white/30 transition">
                View Cart <ShoppingBag className="w-5 h-5 ml-1" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

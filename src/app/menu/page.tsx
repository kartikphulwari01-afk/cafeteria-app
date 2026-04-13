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
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-3xl bg-[#15151a] border border-white/5 skeleton h-[180px]">
                 <div className="w-1/3 rounded-2xl bg-white/5"></div>
                 <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-3">
                      <div className="h-5 bg-white/10 rounded w-3/4"></div>
                      <div className="h-3 bg-white/5 rounded w-full"></div>
                      <div className="h-3 bg-white/5 rounded w-5/6"></div>
                    </div>
                    <div className="flex justify-between items-center">
                       <div className="h-6 bg-white/10 rounded w-16"></div>
                       <div className="h-8 w-8 bg-white/10 rounded-full"></div>
                    </div>
                 </div>
              </div>
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



    </div>
  );
}

'use client';

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { MenuItem } from "@/lib/mockData";
import { Check, X, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminMenuManagement() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '', price: 0, category: 'Breakfast & Drinks', description: '', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600', isAvailable: true, isPopular: false, isVeg: true, tags: []
  });

  const fetchItems = async () => {
    setIsLoading(true);
    const menus = await api.getMenuItems();
    setItems(menus);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const toggleAvailability = async (item: MenuItem) => {
    setItems(items.map(i => i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i));
    await api.updateMenuItem(item.id, { isAvailable: !item.isAvailable });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter(i => i.id !== id));
      await api.deleteMenuItem(id);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', price: 0, category: 'Breakfast & Drinks', description: '', imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600', isAvailable: true, isPopular: false, isVeg: true, tags: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Update
      const updatedItem = { ...formData } as MenuItem;
      setItems(items.map(i => i.id === editingId ? updatedItem : i));
      await api.updateMenuItem(editingId, updatedItem);
    } else {
      // Add
      const addedItem = await api.addMenuItem(formData as Omit<MenuItem, 'id'>);
      setItems([...items, addedItem]);
    }
    setIsModalOpen(false);
  };

  if (isLoading && items.length === 0) {
    return <div className="py-20 text-center animate-pulse">Loading menu...</div>;
  }

  return (
    <div>
      <div className="mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Menu</h1>
          <p className="text-muted-foreground">Add, edit, or remove cafeteria items.</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2 shadow-[0_0_15px_rgba(255,90,0,0.3)]">
          <Plus className="w-5 h-5" /> Add Item
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-muted-foreground text-sm uppercase tracking-wider bg-white/5">
              <th className="py-4 font-medium px-4">Item</th>
              <th className="py-4 font-medium px-4">Category</th>
              <th className="py-4 font-medium px-4">Price</th>
              <th className="py-4 font-medium px-4">Status</th>
              <th className="py-4 font-medium px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="py-3 px-4 flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded object-cover" />
                  <span className="font-medium text-white">{item.name}</span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{item.category}</td>
                <td className="py-3 px-4 font-medium text-white">₹{item.price}</td>
                <td className="py-3 px-4">
                  <button onClick={() => toggleAvailability(item)} className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded transition ${item.isAvailable ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}>
                    {item.isAvailable ? <><Check className="w-3 h-3" /> Available</> : <><X className="w-3 h-3" /> Out of Stock</>}
                  </button>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openEditModal(item)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded transition">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#15151a] border border-white/10 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-muted-foreground mb-1">Price (₹)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-muted-foreground mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white">
                    <option>Breakfast & Drinks</option>
                    <option>Snacks & Sandwiches</option>
                    <option>Finger Foods & Noodles</option>
                    <option>Pizza</option>
                    <option>South Indian</option>
                    <option>Mini Meals & Rice</option>
                    <option>Desserts & Bakery</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Description</label>
                <textarea required rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white"></textarea>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Image URL</label>
                <input required type="url" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isAvailable} onChange={e => setFormData({...formData, isAvailable: e.target.checked})} className="w-5 h-5 rounded border-white/20" />
                  <span className="text-white text-sm">Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isPopular} onChange={e => setFormData({...formData, isPopular: e.target.checked})} className="w-5 h-5 rounded border-white/20" />
                  <span className="text-white text-sm">Popular</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-white bg-white/5 hover:bg-white/10 transition">Cancel</button>
                <Button type="submit" className="px-6 shadow-[0_0_15px_rgba(255,90,0,0.3)]">{editingId ? 'Save Changes' : 'Create Item'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

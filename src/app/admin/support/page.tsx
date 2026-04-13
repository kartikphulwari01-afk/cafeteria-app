'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { CheckCircle2, Trash2 } from "lucide-react";

const ALLOWED_EMAILS = [
  'kartikphulwari01@gmail.com',
  'aryanchaturvedi2006@gmail.com'
];

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  userId: string | null;
  isRead: boolean;
  createdAt: any;
}

export default function SupportAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const { user } = useUserStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.email || !ALLOWED_EMAILS.includes(user.email)) {
      router.push('/auth/login');
      return;
    }
    
    const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactMessage[];
      setMessages(data);
      setIsLoading(false);
    }, (error) => {
      console.error("Error listening to messages:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, router]);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await updateDoc(doc(db, "contactMessages", messageId), {
        isRead: true
      });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteDoc(doc(db, "contactMessages", messageId));
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  const unreadMessages = messages.filter(m => !m.isRead);
  const readMessages = messages.filter(m => m.isRead);

  const renderMessageCard = (message: ContactMessage) => (
    <div 
      key={message.id} 
      className={`border rounded-2xl p-6 flex flex-col justify-between gap-4 transition-all ${
        !message.isRead 
          ? 'border-orange-500/50 bg-orange-500/5 shadow-[0_0_15px_rgba(255,90,0,0.1)]' 
          : 'border-white/10 bg-white/5 opacity-70'
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-tight">{message.name}</span>
            <span className="text-sm text-primary font-medium">{message.email}</span>
            {message.userId && <span className="text-xs text-white/30 font-mono mt-1">UID: {message.userId.slice(0, 8)}</span>}
          </div>
          {!message.isRead && (
            <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(255,90,0,0.4)]">
              NEW
            </span>
          )}
        </div>
        
        <div className="mb-4 text-sm text-white/80 bg-black/40 p-4 rounded-xl border border-white/5">
          {message.message}
        </div>
        
        <div className="text-xs text-white/40 font-medium">
          {message.createdAt?.toDate ? message.createdAt.toDate().toLocaleString() : 'Just now'}
        </div>
      </div>

      <div className="flex gap-3 mt-2 border-t border-white/10 pt-4">
        {!message.isRead && (
          <button 
            onClick={() => handleMarkAsRead(message.id)} 
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 text-black font-bold rounded-lg transition-all text-sm"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark as Read
          </button>
        )}
        <button 
          onClick={() => handleDelete(message.id)} 
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-lg transition-all border border-red-500/20 text-sm"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Support Messages</h1>
        <p className="text-muted-foreground">Manage user feedback, questions, and support tickets.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
          <span className="text-5xl mb-4 block">🎉</span>
          <h2 className="text-2xl font-bold text-white mb-2">You're all caught up!</h2>
          <p className="text-muted-foreground">There are no support messages right now.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {unreadMessages.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                 Unread Messages
                 <span className="bg-orange-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">{unreadMessages.length}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unreadMessages.map(renderMessageCard)}
              </div>
            </div>
          )}

          {readMessages.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 opacity-70">
                 Read Messages
                 <span className="bg-white/10 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">{readMessages.length}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {readMessages.map(renderMessageCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

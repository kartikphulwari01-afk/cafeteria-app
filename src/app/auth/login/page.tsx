'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, User as UserIcon, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginRole, setLoginRole] = useState<'student' | 'admin'>('student');
  const { login } = useUserStore();
  const router = useRouter();

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const isAdmin = loginRole === 'admin';
      login({
        uid: (isAdmin ? 'admin_' : 'user_') + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0] || (isAdmin ? 'Admin User' : 'Student Buddy'),
        email: email,
        role: isAdmin ? 'admin' : 'user'
      });
      setIsLoading(false);
      router.push(isAdmin ? '/admin' : '/menu');
    }, 1500);
  };
  const handleSocialLogin = async (provider: string) => {
  if (provider !== 'google') return;

  try {
    setIsLoading(true);

    const { auth } = await import('@/lib/firebase');
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');

    const googleProvider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;

    const isAdmin = loginRole === 'admin';

    login({
      uid: user.uid,
      name: user.displayName || (isAdmin ? 'Admin User' : 'Student Buddy'),
      email: user.email || '',
      role: isAdmin ? 'admin' : 'user'
    }
  );

    router.push(isAdmin ? '/admin' : '/menu');

  } catch (error) {
    console.error("Google Login Error:", error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black p-4">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full mix-blend-screen filter blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass shadow-2xl rounded-3xl p-8 sm:p-10 border border-white/10 relative overflow-hidden backdrop-blur-2xl">
          {/* Accent glow line at top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(255,90,0,0.4)]"
            >
              <span className="text-2xl font-black text-black">C</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Hello {loginRole === 'admin' ? 'Admin' : 'Buddy'} 👋</h1>
            <p className="text-muted-foreground text-sm font-medium">Welcome back, please sign in to continue</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-white/10">
            <button 
              type="button"
              onClick={() => setLoginRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${loginRole === 'student' ? 'bg-primary text-white shadow-[0_0_10px_rgba(255,90,0,0.3)]' : 'text-muted-foreground hover:text-white'}`}
            >
              <UserIcon className="w-4 h-4" /> Student
            </button>
            <button 
              type="button"
              onClick={() => setLoginRole('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${loginRole === 'admin' ? 'bg-primary text-white shadow-[0_0_10px_rgba(255,90,0,0.3)]' : 'text-muted-foreground hover:text-white'}`}
            >
              <Shield className="w-4 h-4" /> Admin
            </button>
          </div>

          <div className="space-y-4 mb-8">
            <button 
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 glass-panel hover:bg-white/10 text-white font-medium rounded-xl transition duration-300 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative px-4 text-xs font-semibold text-muted-foreground uppercase bg-[#15151a]">
              Or continue with email
            </div>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-5">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  placeholder="Email or Username" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full rounded-xl py-6 text-base font-bold shadow-[0_0_20px_rgba(255,90,0,0.3)] hover:shadow-[0_0_30px_rgba(255,90,0,0.5)]" isLoading={isLoading}>
              Sign In as {loginRole === 'admin' ? 'Admin' : 'Student'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

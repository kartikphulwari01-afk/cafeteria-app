'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, User as UserIcon, Shield } from 'lucide-react';

import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { signIn, signOut as nextAuthSignOut, useSession } from 'next-auth/react';

const ALLOWED_ADMIN_EMAILS = [
  'kartikphulwari01@gmail.com',
  'aryanchaturvedi2006@gmail.com'
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginRole, setLoginRole] = useState<'student' | 'admin'>('student');
  const [isSignup, setIsSignup] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<{size: string, x: number, y: number, delay: number}[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useUserStore();
  const router = useRouter();
  const { data: session, status } = useSession();

  // NextAuth Session Sync
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const storedRole = localStorage.getItem('loginRole') || 'student';
      const isAdmin = storedRole === 'admin';

      if (isAdmin && session.user.email && !ALLOWED_ADMIN_EMAILS.includes(session.user.email)) {
        nextAuthSignOut({ redirect: false });
        setErrorMessage('Access Denied: Not an Admin');
        return;
      }

      login({
        uid: (session.user as any).uid || session.user.email || 'google-user',
        name: session.user.name || (isAdmin ? 'Admin User' : 'Student Buddy'),
        email: session.user.email || '',
        role: isAdmin ? 'admin' : 'user'
      });

      const uName = session.user.name || (isAdmin ? 'Admin User' : 'Student Buddy');
      setWelcomeName(uName);
      setShowWelcome(true);
      setTimeout(() => {
        router.push(isAdmin ? '/admin' : '/home');
      }, 2000);
    }
  }, [status, session, login, router]);

  useEffect(() => {
    setMounted(true);
    setParticles(
      Array.from({ length: 6 }).map(() => ({
        size: (Math.random() * 8 + 4) + 'px',
        x: Math.random() * 80,
        y: Math.random() * 100,
        delay: Math.random() * 5
      }))
    );
  }, []);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (loginRole === 'admin' && !ALLOWED_ADMIN_EMAILS.includes(email)) {
      setErrorMessage('Access Denied: Not an Admin');
      return;
    }

    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const isAdmin = loginRole === 'admin';
      
      login({
        uid: user.uid,
        name: user.displayName || email.split('@')[0],
        email: user.email || email,
        role: isAdmin ? 'admin' : 'user'
      });
      
      const uName = user.displayName || email.split('@')[0];
      setWelcomeName(uName);
      setShowWelcome(true);
      setTimeout(() => {
        router.push(isAdmin ? '/admin' : '/home');
      }, 2000);
      
    } catch (error: any) {
      let msg = 'Invalid email or password.';
      if (error.code === 'auth/user-not-found') msg = 'User not found. Please check your email.';
      else if (error.code === 'auth/wrong-password') msg = 'Incorrect password.';
      else if (error.code === 'auth/invalid-email') msg = 'Invalid email format.';
      else if (error.code === 'auth/invalid-credential') msg = 'Invalid credentials. Please double check your email and password.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (loginRole === 'admin' && !ALLOWED_ADMIN_EMAILS.includes(email)) {
      setErrorMessage('Access Denied: Not authorized as admin');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const isAdmin = loginRole === 'admin';

      login({
        uid: user.uid,
        name: user.displayName || email.split('@')[0],
        email: user.email || email,
        role: isAdmin ? 'admin' : 'user'
      });

      const uName = user.displayName || email.split('@')[0];
      setWelcomeName(uName);
      setShowWelcome(true);
      setTimeout(() => {
        router.push(isAdmin ? '/admin' : '/home');
      }, 2000);
      
    } catch (error: any) {
      let msg = 'Failed to create account.';
      if (error.code === 'auth/email-already-in-use') msg = 'Email already in use.';
      else if (error.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
      else if (error.code === 'auth/invalid-email') msg = 'Invalid email format.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    if (provider !== 'google') return;
    setErrorMessage('');
    setIsLoading(true);
    
    // Store selected role for when NextAuth redirects back
    localStorage.setItem('loginRole', loginRole);
    
    try {
      await signIn('google'); // window.location.href not available statically, so we rely on default callback
    } catch (error) {
      console.error("NextAuth Login Error:", error);
      setErrorMessage('Failed to login with Google. Please try again.');
      setIsLoading(false);
    }
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const parallaxX = useTransform(smoothX, [0, 1920], [-15, 15]);
  const parallaxY = useTransform(smoothY, [0, 1080], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  if (showWelcome) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center min-h-screen bg-black selection:bg-primary/30 selection:text-white relative overflow-hidden"
      >
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 bg-[url('/cafebuddy-login-bg.png')] bg-cover bg-center opacity-40 blur-sm scale-110 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-orange-400 mb-6 drop-shadow-[0_0_20px_rgba(255,120,0,0.4)]"
          >
            Namaste 🙏
          </motion.h1>
          
          <motion.h2 
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            className="text-2xl md:text-3xl font-bold text-white mb-4"
          >
            {welcomeName}, welcome back
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
            className="text-muted-foreground text-lg mb-8"
          >
            Your food is just a few clicks away
          </motion.p>

          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 1, ease: 'easeInOut' }}
            className="h-1.5 w-24 bg-primary mx-auto rounded-full shadow-[0_0_15px_rgba(255,120,0,0.5)] origin-center"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex min-h-screen bg-black overflow-hidden relative selection:bg-primary/30 selection:text-white"
      onMouseMove={handleMouseMove}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes shine {
          0% { transform: translateX(-150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
      `}} />

      {/* LEFT SIDE: Visual Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-end p-16 overflow-hidden z-20 pointer-events-auto">
        <motion.div 
           initial={{ opacity: 0, scale: 1 }}
           animate={{ opacity: 1, scale: 1.05 }}
           transition={{ 
             opacity: { duration: 1.2, ease: 'easeOut' },
             scale: { duration: 10, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }
           }}
           style={{ x: parallaxX, y: parallaxY }}
           className="absolute inset-[-5%] z-0 origin-center"
        >
          <div className="absolute inset-0 bg-[url('/cafebuddy-login-bg.png')] bg-cover bg-center"></div>
          {/* Smooth blend overlay instead of harsh split */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.9) 100%)' }}></div>
        </motion.div>
        
        {/* Floating Elements & Subtle Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/30 rounded-full mix-blend-screen filter blur-[150px] animate-float opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] bg-orange-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>

        {/* Cinematic food emojis */}
        <div className="absolute top-[20%] left-[10%] text-5xl opacity-20 animate-float drop-shadow-[0_0_15px_rgba(255,120,0,0.3)] select-none">🍔</div>
        <div className="absolute top-[40%] right-[15%] text-6xl opacity-20 animate-float drop-shadow-[0_0_15px_rgba(255,120,0,0.3)] select-none" style={{ animationDelay: '1.5s' }}>🍟</div>
        <div className="absolute bottom-[35%] left-[20%] text-5xl opacity-20 animate-float drop-shadow-[0_0_15px_rgba(255,120,0,0.3)] select-none" style={{ animationDelay: '3s' }}>🥤</div>
        <div className="absolute top-[60%] right-[30%] text-4xl opacity-20 animate-float drop-shadow-[0_0_15px_rgba(255,120,0,0.3)] select-none" style={{ animationDelay: '4.5s' }}>🍕</div>

        {/* Light Particle Glow effect */}
        {mounted && particles.map((p, i) => (
          <div key={i} className="absolute bg-orange-400 rounded-full opacity-[0.15] animate-float mix-blend-screen" 
               style={{ 
                 width: p.size, height: p.size,
                 top: p.y + '%', left: p.x + '%',
                 animationDelay: p.delay + 's', filter: 'blur(2px)'
               }}>
          </div>
        ))}

        <div className="relative z-10 text-left">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
           >
             <h2 className="text-5xl lg:text-5xl xl:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
               Eat Smart,<br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 drop-shadow-lg">Order Faster</span>
             </h2>
             <p className="text-white/80 text-lg font-medium max-w-md leading-relaxed border-l-2 border-primary pl-5">
               Browse the full menu, place orders instantly, and track your meal in real time — all from one premium dashboard.
             </p>
           </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 relative z-10">
        {/* Mobile Background Effects */}
        <div className="absolute inset-0 z-0 lg:hidden">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full mix-blend-screen filter blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[120px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="relative z-10 w-full max-w-[440px] perspective-1000"
        >
          {/* Premium Glassmorphism Wrapper */}
          <div 
            className="rounded-[32px] p-8 sm:p-12 relative overflow-hidden transition-all duration-300"
            style={{
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              backgroundColor: 'rgba(21, 21, 26, 0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 0 40px rgba(255, 120, 0, 0.15)'
            }}
          >
            {/* Accent glow line at top */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>

            <div className="relative z-10 text-center mb-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(255,90,0,0.5)] rotate-3 hover:rotate-0 transition-all duration-300"
              >
                <span className="text-2xl font-black text-black select-none">CB</span>
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center justify-center gap-2">
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
                >
                  Hello {loginRole === 'admin' ? 'Admin' : 'Buddy'}
                </motion.span>
                
                <motion.span
                  className="inline-block text-4xl leading-none"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3 }}
                >
                  👋
                </motion.span>
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                {isSignup ? 'Create an account to get started' : 'Welcome back, please sign in to continue'}
              </p>
            </div>

            {/* Role Toggle sliding pill */}
            <div className="relative flex bg-black/40 rounded-xl p-1 mb-8 border border-white/5 shadow-inner">
              <motion.div 
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-lg shadow-[0_0_15px_rgba(255,90,0,0.4)] z-0"
                animate={{ x: loginRole === 'student' ? 0 : '100%' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
              <button 
                type="button"
                onClick={() => setLoginRole('student')}
                className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-colors duration-300 ${loginRole === 'student' ? 'text-black' : 'text-muted-foreground hover:text-white'}`}
              >
                <UserIcon className="w-4 h-4" /> Student
              </button>
              <button 
                type="button"
                onClick={() => setLoginRole('admin')}
                className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-colors duration-300 ${loginRole === 'admin' ? 'text-black' : 'text-muted-foreground hover:text-white'}`}
              >
                <Shield className="w-4 h-4" /> Admin
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium text-center"
              >
                {errorMessage}
              </motion.div>
            )}

            <form onSubmit={isSignup ? handleSignup : handleManualLogin} className="space-y-6 relative z-10">
              <div className="space-y-4">
                <div className="relative group transition-transform duration-300 focus-within:scale-[1.02]">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                  <input 
                    type="email" 
                    placeholder="Email or Username" 
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 flex-1 pl-12 pr-4 text-white placeholder:text-transparent focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(255,120,0,0.3)] transition-all duration-300 peer"
                    required
                  />
                  <label className="absolute left-12 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-sm transition-all duration-300 peer-focus:-top-2 peer-focus:left-4 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#15151a] peer-focus:px-2 peer-focus:font-semibold peer-valid:-top-2 peer-valid:left-4 peer-valid:text-xs peer-valid:text-primary peer-valid:bg-[#15151a] peer-valid:px-2 pointer-events-none rounded-sm">
                    Email or Username
                  </label>
                </div>
                <div className="relative group transition-transform duration-300 focus-within:scale-[1.02]">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-transparent focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(255,120,0,0.3)] transition-all duration-300 peer"
                    required
                  />
                  <label className="absolute left-12 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-sm transition-all duration-300 peer-focus:-top-2 peer-focus:left-4 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#15151a] peer-focus:px-2 peer-focus:font-semibold peer-valid:-top-2 peer-valid:left-4 peer-valid:text-xs peer-valid:text-primary peer-valid:bg-[#15151a] peer-valid:px-2 pointer-events-none rounded-sm">
                    Password
                  </label>
                </div>
              </div>

              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative px-4 text-xs font-black text-white/30 uppercase tracking-widest bg-transparent">
                  <span className="bg-[#15151a]/95 px-3 py-2 rounded-full border border-white/5">Or</span>
                </div>
              </div>

              <div className="mt-2 text-center w-full">
                <button 
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl transition duration-300 disabled:opacity-50 group hover:scale-[1.03] active:scale-[0.97] hover:brightness-110"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

              <div className="mt-8">
                <Button 
                  type="submit" 
                  className="w-full rounded-xl py-6 text-base font-bold shadow-[0_0_20px_rgba(255,90,0,0.2)] hover:shadow-[0_0_30px_rgba(255,90,0,0.5)] hover:scale-[1.03] active:scale-[0.97] hover:brightness-110 transition-all duration-300 overflow-hidden relative group" 
                  isLoading={isLoading}
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  {isSignup ? 'Sign Up' : 'Sign In'} as {loginRole === 'admin' ? 'Admin' : 'Student'}
                </Button>
              </div>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => { setIsSignup(!isSignup); setErrorMessage(''); }}
                  className="text-sm font-semibold text-muted-foreground hover:text-white transition-colors"
                >
                  {isSignup 
                    ? 'Already have an account? Login' 
                    : "Don't have an account? Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function LiveClock() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('en-GB'));
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(255,90,0,0.15)]">
      <Clock className="w-3.5 h-3.5 text-primary/80 animate-[pulse_2s_ease-in-out_infinite]" />
      <span className="text-sm font-bold tracking-wider text-white">
        {time}
      </span>
    </div>
  );
}

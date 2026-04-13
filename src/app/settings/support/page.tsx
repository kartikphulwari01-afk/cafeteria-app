'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useUserStore } from '@/store/userStore';

export default function SupportPage() {
  const { user } = useUserStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await addDoc(collection(db, "contactMessages"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        userId: user?.uid || null,
        isRead: false,
        createdAt: serverTimestamp()
      });
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Submission failed:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">How can we help?</h1>
        <p className="text-muted-foreground text-lg">Send us a message or reach out using the details below.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#15151a] border border-white/10 rounded-3xl p-8 h-fit"
        >
          <h2 className="text-2xl font-bold text-white mb-8">Contact Information</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/50 mb-1">Email Us</p>
                <div className="space-y-1">
                  <a href="mailto:kartikphulwari01@gmail.com" className="block text-white hover:text-primary transition-colors font-medium">kartikphulwari01@gmail.com</a>
                  <a href="mailto:aryanchaturvedi2006@gmail.com" className="block text-white hover:text-primary transition-colors font-medium">aryanchaturvedi2006@gmail.com</a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/50 mb-1">Call Us</p>
                <div className="space-y-1">
                  <a href="tel:+917877080919" className="block text-white hover:text-blue-400 transition-colors font-medium">+91 78770 80919</a>
                  <a href="tel:+919368644137" className="block text-white hover:text-blue-400 transition-colors font-medium">+91 93686 44137</a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/50 mb-1">Visit Us</p>
                <p className="text-white font-medium max-w-xs leading-relaxed">
                  University Cafeteria
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Email Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <form onSubmit={handleSubmit} className="bg-[#15151a] border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Send us a message</h2>
            
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-white/70 mb-2">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white/70 mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="john@university.edu"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-white/70 mb-2">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="How can we help you today?"
                ></textarea>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full h-12 text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(255,90,0,0.3)] hover:shadow-[0_0_30px_rgba(255,90,0,0.5)] transition-all flex items-center justify-center"
                >
                  {status === 'loading' ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</>
                  ) : status === 'success' ? (
                    'Message Sent!'
                  ) : status === 'error' ? (
                    'Failed to send. Try again.'
                  ) : (
                    <><Send className="w-5 h-5 mr-2" /> Send Message</>
                  )}
                </Button>
              </div>
              
              {status === 'success' && (
                <p className="text-center text-green-400 text-sm font-medium mt-4">Message sent successfully 🚀</p>
              )}
              {status === 'error' && (
                <p className="text-center text-red-400 text-sm font-medium mt-4">Something went wrong, try again</p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

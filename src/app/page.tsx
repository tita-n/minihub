'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, MessageCircle, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Connect. Share. <span className="text-primary">Evolve.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            MiniHub is a high-performance community platform built for clarity and speed. 
            Experience a clean, distraction-free environment for meaningful discussions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={user ? "/feed" : "/auth"}
              className="group flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-red-700 transition-all transform hover:scale-105"
            >
              {user ? "Go to Feed" : "Get Started Now"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-primary" />}
              title="Lightning Fast"
              description="Built with Next.js and Firebase for instant load times and zero cold starts."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-primary" />}
              title="Secure"
              description="Production-grade security rules and authentication protect your data."
            />
            <FeatureCard 
              icon={<MessageCircle className="w-6 h-6 text-primary" />}
              title="Real-time"
              description="Engage in live discussions with real-time feed updates and comments."
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-10 text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} MiniHub. Built for the modern web.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 bg-secondary rounded-2xl border border-border text-left hover:border-primary/50 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}

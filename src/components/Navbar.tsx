'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, LayoutDashboard } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';

export default function Navbar() {
  const { user, profile, isAdmin } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-secondary/80 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          MiniHub
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/feed" className="text-sm hover:text-primary transition-colors">
                Feed
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-sm flex items-center gap-1 hover:text-primary transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
                <User className="w-4 h-4 text-primary" />
                <span className="text-xs max-w-[100px] truncate">{user.email}</span>
              </div>
              <button
                onClick={() => signOut(auth)}
                className="p-2 hover:text-primary transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link 
              href="/auth" 
              className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/feed');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-secondary rounded-xl shadow-2xl border border-border">
        <h1 className="text-3xl font-bold text-center text-primary">
          MiniHub
        </h1>
        <h2 className="text-xl text-center text-foreground">
          {isLogin ? 'Welcome Back' : 'Join the Community'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 mt-1 bg-muted border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 mt-1 bg-muted border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-foreground"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-primary rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

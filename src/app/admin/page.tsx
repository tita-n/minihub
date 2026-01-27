'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  collection, 
  onSnapshot, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { Post, Comment } from '@/types';
import { Trash2 } from 'lucide-react';

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/feed');
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    if (!isAdmin) return;

    const unsubPosts = onSnapshot(collection(db, 'posts'), (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
    });

    const unsubComments = onSnapshot(collection(db, 'comments'), (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment)));
    });

    return () => {
      unsubPosts();
      unsubComments();
    };
  }, [isAdmin]);

  const handleDeletePost = async (id: string) => {
    if (confirm('Admin: Delete this post?')) {
      await deleteDoc(doc(db, 'posts', id));
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (confirm('Admin: Delete this comment?')) {
      await deleteDoc(doc(db, 'comments', id));
    }
  };

  if (authLoading || !isAdmin) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 space-y-10">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Manage Posts ({posts.length})</h2>
          <div className="bg-secondary rounded-xl border border-border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-4">Author</th>
                  <th className="p-4">Content</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-muted/50">
                    <td className="p-4 truncate max-w-[150px]">{post.authorEmail}</td>
                    <td className="p-4 truncate max-w-[300px]">{post.content}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4 ml-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Manage Comments ({comments.length})</h2>
          <div className="bg-secondary rounded-xl border border-border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-4">Author</th>
                  <th className="p-4">Content</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comments.map(comment => (
                  <tr key={comment.id} className="hover:bg-muted/50">
                    <td className="p-4 truncate max-w-[150px]">{comment.authorEmail}</td>
                    <td className="p-4 truncate max-w-[300px]">{comment.content}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4 ml-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  doc, 
  getDoc, 
  onSnapshot,
  collection,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { Post, Comment } from '@/types';
import { createComment, deleteComment } from '@/lib/firebase/firestore';
import { Trash2, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function PostDetailPage() {
  const { id } = useParams();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const postRef = doc(db, 'posts', id as string);
    const unsubscribePost = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() } as Post);
      } else {
        router.push('/feed');
      }
      setLoading(false);
    });

    const q = query(
      collection(db, 'comments'),
      where('postId', '==', id),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    });

    return () => {
      unsubscribePost();
      unsubscribeComments();
    };
  }, [id, router]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !id) return;

    setSubmitting(true);
    try {
      await createComment(id as string, user.uid, user.email || 'Anonymous', newComment.trim());
      setNewComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm('Delete this comment?')) {
      try {
        await deleteComment(commentId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading || authLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!post) return null;

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 space-y-8">
        <Link 
          href="/feed" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Link>

        {/* Post Detail */}
        <div className="bg-secondary p-6 rounded-xl border border-border">
          <div className="mb-4">
            <p className="font-semibold text-primary">{post.authorEmail}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(post.createdAt)} ago
            </p>
          </div>
          <p className="text-lg text-foreground whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Add Comment */}
        <div className="bg-secondary p-4 rounded-xl border border-border">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              className="flex-1 bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="p-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold px-2">Comments</h3>
          {comments.map((comment) => (
            <div key={comment.id} className="bg-secondary p-4 rounded-xl border border-border group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-semibold text-primary">{comment.authorEmail}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(comment.createdAt)} ago
                  </p>
                </div>
                {(user?.uid === comment.authorId || isAdmin) && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="p-1 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-sm text-foreground">{comment.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-muted-foreground py-4 text-sm">No comments yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}

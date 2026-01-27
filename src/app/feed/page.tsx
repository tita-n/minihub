'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { Post } from '@/types';
import { createPost, deletePost, updatePost } from '@/lib/firebase/firestore';
import { Trash2, MessageSquare, Send, Edit } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function FeedPage() {
  const { user, profile, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Post));
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !user) return;

    setSubmitting(true);
    try {
      await createPost(user.uid, user.email || 'Anonymous', newPost.trim());
      setNewPost('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditing(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editContent.trim()) return;

    setEditing(true);
    try {
      await updatePost(editingPost.id, editContent.trim());
      setEditing(false);
      setEditingPost(null);
      setEditContent('');
    } catch (err) {
      console.error(err);
      alert('Error updating post: ' + (err as Error).message);
    } finally {
      setEditing(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditingPost(null);
    setEditContent('');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 space-y-8">
        {/* Create Post */}
        <div className="bg-secondary p-4 rounded-xl border border-border">
          <form onSubmit={handleCreatePost} className="space-y-4">
            <textarea
              className="w-full bg-muted border border-border rounded-lg p-3 text-foreground focus:ring-1 focus:ring-primary focus:outline-none min-h-[100px] resize-none"
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newPost.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Post
              </button>
            </div>
          </form>
        </div>

        {/* Edit Post Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-secondary rounded-xl border border-border p-6 w-full max-w-lg">
              <h3 className="text-lg font-semibold mb-4">Edit Post</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <textarea
                  className="w-full bg-muted border border-border rounded-lg p-3 text-foreground focus:ring-1 focus:ring-primary focus:outline-none min-h-[120px] resize-none"
                  placeholder="What's on your mind?"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editing || !editContent.trim()}
                    className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {editing ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-secondary p-6 rounded-xl border border-border group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-primary">{post.authorEmail}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt))} ago
                  </p>
                </div>
                {(user?.uid === post.authorId || isAdmin) && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      title="Edit post"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-foreground whitespace-pre-wrap mb-6">{post.content}</p>
              
              <div className="flex items-center gap-4 border-t border-border pt-4">
                <Link 
                  href={`/post/${post.id}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  View Comments
                </Link>
              </div>
            </div>
          ))}
          
          {posts.length === 0 && (
            <p className="text-center text-muted-foreground py-10">No posts yet. Be the first to share something!</p>
          )}
        </div>
      </main>
    </div>
  );
}

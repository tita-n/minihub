import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  updateDoc,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';
import { Post, Comment } from '@/types';

// Posts
export const createPost = async (authorId: string, authorEmail: string, content: string) => {
  if (!content.trim()) {
    throw new Error('Post content cannot be empty');
  }
  return addDoc(collection(db, 'posts'), {
    authorId,
    authorEmail,
    content: content.trim(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
};

export const updatePost = async (postId: string, content: string) => {
  if (!content.trim()) {
    throw new Error('Post content cannot be empty');
  }
  return updateDoc(doc(db, 'posts', postId), {
    content: content.trim(),
    updatedAt: Date.now(),
  });
};

export const deletePost = async (postId: string) => {
  return deleteDoc(doc(db, 'posts', postId));
};

// Comments
export const createComment = async (postId: string, authorId: string, authorEmail: string, content: string) => {
  if (!content.trim()) {
    throw new Error('Comment content cannot be empty');
  }
  return addDoc(collection(db, 'comments'), {
    postId,
    authorId,
    authorEmail,
    content: content.trim(),
    createdAt: Date.now(),
  });
};

export const deleteComment = async (commentId: string) => {
  return deleteDoc(doc(db, 'comments', commentId));
};

export const getCommentsByPost = (postId: string, callback: (comments: Comment[]) => void) => {
  const q = query(
    collection(db, 'comments'),
    where('postId', '==', postId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot: any) => {
    const comments = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Comment));
    callback(comments);
  });
};

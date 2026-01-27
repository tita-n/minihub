export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  createdAt: number;
}

export interface Post {
  id: string;
  authorId: string;
  authorEmail: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorEmail: string;
  content: string;
  createdAt: number;
}

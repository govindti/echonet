export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  is_active: boolean;
  role_id: number;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  level: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  user_id: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  version: number;
  comments: Comment[];
  user: User;
}

export interface PostWithMetaData extends Post {
  comment_count: number;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  comments: Comment[];
  user: User;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
}

export interface FeedParams {
  limit?: number;
  offset?: number;
  sort?: "asc" | "desc";
  tags?: string;
  search?: string;
  since?: string;
  until?: string;
}

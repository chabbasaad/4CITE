export interface User {
    id: number;
    name: string;
    avatar?: string;
    is_following?: boolean;
  }
  
  export interface Media {
    id: number;
    media_path: string;
    media_type: string;
  }
  
  export interface Comment {
    id: number;
    content: string;
    user: User;
    created_at: string;
  }
  
  export interface Post {
    id: number;
    title: string;
    content: string;
    user?: User;
    media?: Media[];
    comments: Comment[];
    created_at: string;
    likes_count?: number;
    is_liked?: boolean;
  }
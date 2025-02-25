export interface Comment {
    id: number;
    content: string;
    user: {
      id: number;
      name: string;
    };
    created_at: string;
  }
  
  export interface Post {
    id: number;
    title: string;
    content: string;
    image_path: string | null;
    video_path: string | null;
    created_at: string;
    comments: Comment[];
  }
  
  export interface Profile {
    id: number;
    name: string;
    email: string;
    profile_type: string;
    role: string;
    posts_count: number; 
    followers_count: number; 
    following_count: number; 
    is_following?: boolean;
    posts: Post[];
  }
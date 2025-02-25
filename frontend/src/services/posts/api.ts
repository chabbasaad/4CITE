import { instance } from '../instance';
import { Post } from './entities';
import { PostSchemaType } from './schemas';

interface LikeResponse {
  message: string;
  likes_count: number;
  is_liked: boolean;
}

export const getPosts = async (): Promise<Post[]> => {
  const response = await instance.get<Post[]>('/posts');
  return response.data;
};

export const createPost = async (payload: PostSchemaType) => {
  const response = await instance.post('/posts', payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updatePost = async (id: number, payload: { title?: string; content?: string }) => {
  const response = await instance.put(`/posts/${id}`, payload);
  return response.data;
};

export const deletePost = async (id: number) => {
  const response = await instance.delete(`/posts/${id}`);
  return response.data;
};

export const createComment = async (postId: string, content: string) => {
  const response = await instance.post('/comments', { post_id: postId, content });
  return response.data;
};

export const likePost = async (postId: number): Promise<LikeResponse> => {
  const response = await instance.post<LikeResponse>(`/posts/${postId}/like`);
  return response.data;
};

export const unlikePost = async (postId: number): Promise<LikeResponse> => {
  const response = await instance.post<LikeResponse>(`/posts/${postId}/unlike`);
  return response.data;
};

export const toggleLike = async (postId: number): Promise<LikeResponse> => {
  const response = await instance.post<LikeResponse>(`/posts/${postId}/toggle-like`);
  return response.data;
};

export const followButton = async (isFollowing: boolean, userId: number) => {
  await instance.post(`users/${userId}/${isFollowing ? 'unfollow' : 'follow'}`);
};
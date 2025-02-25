import { useQuery } from '@tanstack/react-query';
import { instance } from '../instance';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
}

export const useGetComments = (postId: number) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await instance.get<Comment[]>(`/comments/post/${postId}`);
      return response.data;
    },
  });
};
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { instance } from '../instance';

interface CreateCommentData {
  post_id: number;
  content: string;
}

export interface CommentResult {
    id: number;
    user_id: number;
    post_id: number;
    content: string;
    created_at: string;
    updated_at: string;
  }

export const useCreateComment = ({ onSuccess, onError }: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommentData) => {
      const response = await instance.post<CommentResult>('/comments', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate queries to refetch data

      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
};
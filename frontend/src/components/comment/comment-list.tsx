import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { Comment } from '@/services/posts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { useCreateComment } from '@/services/comments/mutations';
import { useAuthStore } from '@/store/auth-store';

interface CommentListProps {
  comments: Comment[];
  postId: number;
  onAddComment?: (comment: Comment) => void;
}

export function CommentList({ comments, postId }: CommentListProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting] = useState(false);
  const [myComment, setMyComment] = useState<Comment[]>(comments);
    const {mutate} = useCreateComment();
    const {user} = useAuthStore();



const handleSubmit = () => { 
    // props 
    mutate({post_id : postId, content : newComment},
        {onSuccess: (comment ) =>{
                setNewComment("");
                setMyComment((prev) => [{
                    content:comment.content,
                    id: comment.id,
                    user: {
                        id: user?.id??0,
                        name: user?.name??"",
                       
                    },
                    created_at: comment.created_at,
                    __typename: 'Comment'
                },...prev])
        }}
    )
};

  return (
    <div className="space-y-4">
      <div  className="flex gap-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[60px] flex-1"
        />
        <Button 
          onClick={handleSubmit}
          size="sm" 
          disabled={isSubmitting || !newComment.trim() }
          className="self-end"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        <div className="space-y-4">
          {myComment.map((comment, index) => (
            <div key={comment.id}>
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                  <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">{comment.user.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                </div>
              </div>
              {index < comments.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-muted-foreground">No comments yet</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
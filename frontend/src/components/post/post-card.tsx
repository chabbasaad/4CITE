import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Delete, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Post, useDeletePost, Comment, toggleLike, updatePost } from '@/services/posts';
import { CommentList } from '../comment/comment-list';
import { useAuthStore } from '@/store/auth-store';
import { FollowButton } from '../user/follow-button';
import { Link } from 'react-router-dom';
import { UpdatePostDialog } from './update-post-dialog';
import { useToast } from '@/hooks/use-toast';

interface PostCardProps {
  post: Post;
  hideFollowButton?: boolean; 
}

export function PostCard({ post, hideFollowButton = false }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>(post.comments);
  const [localPost, setLocalPost] = useState(post);
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const { mutate: deletePost } = useDeletePost();
  const { toast } = useToast();
  const { user: currentUser } = useAuthStore();

  const handleUpdatePost = async (id: number, data: { title: string; content: string }) => {
    try {
      const updatedPost = await updatePost(id, data);
      setLocalPost(updatedPost);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleLikeToggle = async (id: number) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please login to like posts",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await toggleLike(id);
      setIsLiked(response.is_liked);
      setLikesCount(response.likes_count);
      setLocalPost(prev => ({
        ...prev,
        is_liked: response.is_liked,
        likes_count: response.likes_count
      }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update like status",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async (mediaPath: string) => {
    try {
      const fileName = mediaPath.split('/').pop();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/media/download/${fileName}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Media downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download media",
        variant: "destructive"
      });
    }
  };

  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`, // Adjust if token isn't needed
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = imageUrl.split('/').pop() || 'downloaded-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
  
      console.log('Download successful');
    } catch (error) {
      console.error('Error during download:', error);
    }
  };
  
  

  const { id, user, created_at, media } = localPost;

  const handleAddComment = (newComment: Comment) => {
    setLocalComments((prev) => [newComment, ...prev]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${user?.id}`}>
                <h3 className="font-semibold">{user?.name}</h3>
              </Link>
              { !hideFollowButton && currentUser && user?.id && currentUser.id !== user?.id && (
                <FollowButton
                  userId={user?.id}
                  initialIsFollowing={user?.is_following ?? false}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">{localPost.title}</h2>
          <p className="text-gray-600">{localPost.content}</p>
          {media && media.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  {item.media_type.startsWith('image/') ? (
                   <img
                   src={`${import.meta.env.VITE_URL}/${item.media_path}`}
                   alt="Media content"
                   className="object-cover w-full h-full"
                   onClick={() => downloadImage(`${import.meta.env.VITE_URL}/${item.media_path}`)}
                 />
                  ) : (
                    <video
                      src={`${import.meta.env.VITE_URL}/${item.media_path}`}
                      controls
                      className="object-cover w-full h-full"
                    />
                  )}
                  {/* <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDownload(item.media_path)}
                  > */}
  
                    {/* <Download className="h-4 w-4" />
                  </Button> */}



                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col border-t p-4">
          <div className="flex items-center gap-4 w-full mb-4">
            <Button
              onClick={() => handleLikeToggle(id)}
              variant={isLiked ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4" />
              {localComments.length} Comments
            </Button>
            {currentUser?.id === user?.id && (
              <div className="flex gap-2 ml-auto">
                <UpdatePostDialog post={localPost} onUpdate={handleUpdatePost} />
                <Button
                  onClick={() => deletePost(id)}
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                >
                  <Delete className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {showComments && (
            <div className="w-full">
              <CommentList
                comments={localComments}
                postId={id}
                onAddComment={handleAddComment}
              />
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
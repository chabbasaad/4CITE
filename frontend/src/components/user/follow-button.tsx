import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFollow } from '@/services/posts';

interface FollowButtonProps {
  userId: number;
  initialIsFollowing: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({ userId, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const { mutate,isPending } = useFollow();

  const handleFollowAction = async () => {
  
    mutate({
      userId,
      isFollowing,
    },{onSuccess : () =>{
        setIsFollowing(!isFollowing);
    }})
  };

  return (
    <Button
      variant={isFollowing ? "secondary" : "default"}
      size="sm"
      onClick={handleFollowAction}
      disabled={isPending}
      className={cn(
        "gap-2 transition-all duration-200",
        isFollowing ? "bg-secondary hover:bg-secondary/80" : "bg-primary hover:bg-primary/90",
        isPending && "opacity-50 cursor-not-allowed"
      )}
    >
      {isFollowing ? (
        <>
          <UserMinus className="h-4 w-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}
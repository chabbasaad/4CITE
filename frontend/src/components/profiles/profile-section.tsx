interface StatsSectionProps {
    followers: number;
    following: number;
    posts: number;
  }
  
  export function StatsSection({ followers, following, posts }: StatsSectionProps) {
    return (
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="bg-card rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">{followers.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Followers</div>
        </div>
        <div className="bg-card rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">{following} </div>
          <div className="text-sm text-muted-foreground">Following</div>
        </div>
        <div className="bg-card rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">{posts}</div>
          <div className="text-sm text-muted-foreground">Posts</div>
        </div>
      </div>
    );
  }
import { motion } from "framer-motion";
import { LogOut, User, Bell, Users, MessageSquare ,  Crown, PenTool} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreatePostDialog } from "@/components/post/create-post-dialog";
import { useState } from "react";
import { PostList } from "@/components/post/post-list";
import {  useNavigate } from "react-router-dom";


const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export function UserDashboard() {

  const [CreatePost , setCreatePost] = useState<boolean>(false); 

  const navigate = useNavigate();
 const GotoProfile =  () => { navigate(`/profile/${user?.id}`); };

  const { user, logout } = useAuthStore();


   // Dynamically generate stats array from user data
   const stats = [
    { label: "Posts", value: user?.posts_count || 0, icon: MessageSquare },
    { label: "Followers", value: user?.followers_count || 0, icon: Users },
    { label: "Following", value: user?.following_count || 0, icon: Users },
  ];

  const renderRoleBadge = (role: string | null) => {
    switch (role) {
      case "admin":
        return (
          <span className="flex items-center gap-2 text-xs bg-red-100 text-red-600 py-1 px-3 rounded-full">
            <Crown className="h-4 w-4" /> Admin
          </span>
        );
      case "content_creator":
        return (
          <span className="flex items-center gap-2 text-xs bg-blue-100 text-blue-600 py-1 px-3 rounded-full">
            <PenTool className="h-4 w-4" /> Content Creator
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-2 text-xs bg-gray-100 text-gray-600 py-1 px-3 rounded-full">
            <User className="h-4 w-4" /> User
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-10"
      >
        {/* Header Section */}
        <motion.div
          variants={item}
          className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-2xl shadow-lg p-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary/10">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {user?.email}
                </p>
                    {/* Role Badge */}
                    {renderRoleBadge(user?.role ?? null)}

              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-[hsl(var(--primary))]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          variants={item}
          className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button  onClick={() => setCreatePost(true) } variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <MessageSquare className="h-6 w-6" />
              <span>New Post</span>
            </Button>
            <Button  onClick={ GotoProfile } variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Visit my Profile</span>
            </Button>
          </div>
        </motion.div>

      </motion.div>
      <CreatePostDialog open={CreatePost} onOpenChange={setCreatePost}  onSuccess={ () => {setCreatePost(false)} }  />
     
      <div className="min-h-screen ">
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Social Feed</h1>
    
        </div>
        <PostList/>
      </div>
    </div>

    </div>
  );
}

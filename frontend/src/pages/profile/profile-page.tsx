
import { ProfileHeader } from "@/components/profiles/profile-header";
import { StatsSection } from "@/components/profiles/profile-section";
import { ProfileSkeleton } from "@/components/profiles/profile-skeleton";
import { usePublicProfile } from "@/services/profiles";

import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from "react-router-dom";
import { PostCard } from "@/components/post/post-card";
import { PrivateProfilePage } from "@/components/profiles/private-profile-page";

export function Profile() {


  const { id } = useParams<{ id: string }>();
  const { data, isLoading,isError} = usePublicProfile(+id!);


    console.log(data?.posts);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if(isError) {
    return <PrivateProfilePage/>;
  }
  

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <div className="h-48 "></div>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <ProfileHeader
          name={data?.name}
          email={data?.email}
          profileType={data?.profile_type}
          is_following={data?.is_following}
       
          // onProfileTypeChange={handleProfileTypeChange}
        />

        <StatsSection
          followers={data?.followers_count?? 0}
          following={data?.following_count ?? 0}
          posts={data?.posts_count??0}
        />

        {/* Post List */}

        {/* <AnimatePresence>
      <div className="space-y-6">
        {data?.posts &&  data?.posts?.map((post) => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <PostCard post={post}   />
          </motion.div>
        ))}
      </div>
    </AnimatePresence> */}

<AnimatePresence>
  <div className="space-y-6">
    {data?.posts &&
      data?.posts.map((post) => (
        <motion.div
          key={post.id}
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <PostCard
            post={{
              ...post,
              user: {
                id: data?.id,
                name: data?.name,
                is_following: data?.is_following,
              },
            
            }}  hideFollowButton={true}
          />
        </motion.div>
      ))}
  </div>
</AnimatePresence>
      </div>
    </div>
  );
}
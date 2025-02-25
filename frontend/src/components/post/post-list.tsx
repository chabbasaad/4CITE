
import { motion, AnimatePresence } from 'framer-motion';
import { PostCard } from './post-card';

import { useGetPosts } from '@/services/posts/queries';


export function PostList() {

    const {data : posts  ,isError : error    } = useGetPosts();
   


    
    // THIS SHOULD DO REFRESH AFTER ADD OR DELETE
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-[200px]">
  //       <Loader2 className="w-8 h-8 animate-spin" />
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p> Not Loaded data check your back end </p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="space-y-6">
        {posts?.map((post) => (
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
    </AnimatePresence>
  );
}
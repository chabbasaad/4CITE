import { useQuery } from "@tanstack/react-query";
import { getPosts } from "./api";



export const useGetPosts = () => {
    return useQuery({
      queryKey: ["posts" ],
      queryFn: () => getPosts(),
      enabled: true,
    });
  };
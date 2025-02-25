import { useQuery } from "@tanstack/react-query";
import { getPublicProfile } from "./api";


export const usePublicProfile = (userId: number) => {
  return useQuery({
    queryKey: ["public-profile", userId],
    queryFn: () => getPublicProfile(userId),
    retry: 1
  });
};
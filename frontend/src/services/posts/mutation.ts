import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  createPost, deletePost, followButton, likePost, unlikePost } from "./api";
import {  PostSchemaType,  } from "./schemas";
import { catchError } from "@/lib/catch-error";
import { toast } from "sonner";




export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        
         mutationFn: (value: PostSchemaType) => createPost(value),
         onError: (err) => catchError(err),
         onSuccess: () => {toast("Post Created Successfully")
            queryClient.invalidateQueries({ queryKey: ["posts"] });
         },

    })
    };

    export const useDeletePost = () => {
      const queryClient = useQueryClient();
      return useMutation({
          
           mutationFn: (value: number) => deletePost(value),
           onError: (err) => catchError(err),
           onSuccess: () => {toast("Post Deleted Successfully")
              queryClient.invalidateQueries({ queryKey: ["posts"] });
           },
           
      })
      };


   
      export const useLikePost = () => {
         const queryClient = useQueryClient();
         return useMutation({
             
              mutationFn: (value: number) => likePost(value),
              onError: (err) => catchError(err),
              onSuccess: () => {toast("Post Liked Successfully")
                 queryClient.invalidateQueries({ queryKey: ["posts"] });
              },
     
         })
         };
     
     
     
         export const useUnlikePost = () => {
           const queryClient = useQueryClient();
           return useMutation({
               
                mutationFn: (value: number) => unlikePost(value),
                onError: (err) => catchError(err),
                onSuccess: () => {toast("Post Unliked Successfully")
                   queryClient.invalidateQueries({ queryKey: ["posts"] });
                },
                
           })
           };


           

           export const useFollow = () => {
            const queryClient = useQueryClient();
          
            return useMutation({
              mutationFn: (value:{isFollowing:boolean,userId:number}) =>
                followButton(value.isFollowing,value.userId),
              onSuccess: () => {
                toast.success("Your are following user now");
                queryClient.invalidateQueries({ queryKey: ["posts"] });
              },
              onError: (error) => {
                catchError(error);
              },
            });
          };
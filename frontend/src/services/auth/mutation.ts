import { useMutation } from "@tanstack/react-query";
import { login, register } from "./api";
import { LoginSchemaType, RegisterSchemaType } from "./schemas";
import { catchError } from "@/lib/catch-error";
import { toast } from "sonner";


export const useLogin = () => {
return useMutation({
    
     mutationFn: (value: LoginSchemaType) => login(value),
     onError: (err) => catchError(err)
})
};

export const useRegister = () => {
    return useMutation({
        
         mutationFn: (value: RegisterSchemaType) => register(value),
         onError: (err) => catchError(err),
         onSuccess: (data) => toast(data.message),
    })
    };
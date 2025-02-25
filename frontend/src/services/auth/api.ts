import { instance } from "../instance"
import { LoginSchemaType, ResponseToken ,RegisterSchemaType} from "./schemas"

export const login = async (value:LoginSchemaType) => {
 
  const res =   await  instance.post<ResponseToken>('/login', 
       value  

    )
 
    return res.data;

}


export const register = async (value:RegisterSchemaType) => {
 
    const res =   await  instance.post<{message:string}>('/register', 
         value  
  
      )
   
      return res.data;
  
  }



  
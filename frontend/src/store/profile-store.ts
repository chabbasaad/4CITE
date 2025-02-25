import { create } from "zustand";


interface Profile {
    id:number | null,
    name: string,
    email: string,
    profile_type: "public" | "private",
    role: "admin" | "user" | "content-creator",
  }


type ProfileStore = {
    profile: Profile;
    SetProfile: (data: Profile) => void;
  }
  
  export  const useProfileStore = create<ProfileStore>()((set) => ({
    profile: {id : null,name : "",email : "", profile_type : "public", role :"admin"},
    SetProfile: (data: Profile) => set((state) => ({...state,...data })),
    
  }))
  
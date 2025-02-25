import { instance } from "../instance";
import { Profile } from "./entities";

export const getPublicProfile = async (userId: number) => {
  const res = await instance.get<Profile>(`/users/${userId}/public-profile`);
  return res.data;
};

// Toggle profile type
export const toggleProfileType = async (): Promise<{ profileType: string }> => {
  try {
    const response = await instance.post(`/users/profile-type`);
    return response.data;
  } catch (error) {
    console.error("Failed to toggle profile type", error);
    throw error;
  }
};
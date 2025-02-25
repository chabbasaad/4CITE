import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Lock, Globe } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Link, useParams } from "react-router-dom";
import { toggleProfileType } from "@/services/profiles";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FollowButton } from "../user/follow-button";

interface ProfileHeaderProps {
  name?: string;
  email?: string;
  profileType?: string;
  onProfileTypeChange?: (isPublic: boolean) => void;
  is_following?: boolean;
}

export function ProfileHeader({
  name,
  email,
  profileType: initialProfileType,
  onProfileTypeChange,
  is_following,
}: ProfileHeaderProps) {
  const { user } = useAuthStore();
  const { id } = useParams<{ id: string }>();
  const isCurrentUser = user?.id === +id!;
  const { toast } = useToast();
  const [profileType, setProfileType] = useState(initialProfileType);
  const [isLoading, setIsLoading] = useState(false);
  const [followingState, setFollowingState] = useState(is_following ?? false);
 
  const handleProfileTypeToggle = async (isPublic: boolean) => {
    try {
      setIsLoading(true);
      await toggleProfileType();

      // Update local state
      const newProfileType = isPublic ? "public" : "private";
      setProfileType(newProfileType);

      // Notify parent component
      if (onProfileTypeChange) {
        onProfileTypeChange(isPublic);
      }

      toast({
        title: "Profile Updated",
        description: `Your profile is now ${newProfileType}`,
      });
    } catch (error) {
      console.error("Failed to toggle profile type:", error);
      toast({
        title: "Error",
        description: "Failed to update profile type. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowChange = (isFollowing: boolean) => {
    setFollowingState(isFollowing);
  };

  return (
    <div className="relative">
      <Avatar className="w-32 h-32 border-4 border-background absolute -top-16">
        <AvatarImage
          src={`https://api.dicebear.com/7.x/personas/svg?seed=${name}`}
        />
        <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="ml-36 pt-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{name}</h1>
          <p className="text-muted-foreground">{email}</p>
          <div className="flex items-center mt-2 text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            <span> </span>
          </div>

          {isCurrentUser && (
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                {profileType === "public" ? (
                  <Globe className="w-4 h-4 text-green-500" />
                ) : (
                  <Lock className="w-4 h-4 text-orange-500" />
                )}
                <Label htmlFor="profile-type">Profile Type:</Label>
                <Switch
                  id="profile-type"
                  checked={profileType === "public"}
                  onCheckedChange={handleProfileTypeToggle}
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground capitalize">
                  {profileType}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isCurrentUser && (
            <FollowButton
              userId={+id!} // Pass the correct user ID
              initialIsFollowing={followingState}
              onFollowChange={handleFollowChange}
            />
            
              
          )}

          
        </div>

        <Button variant="secondary"><Link to="/dashboard" >Go To Dashboard </Link> </Button>
      </div>
    </div>
  );
}

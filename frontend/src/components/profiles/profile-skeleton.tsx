import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner Skeleton */}
      <div className="h-48">
        <Skeleton className="w-full h-full" />
      </div>
      
      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        {/* Profile Header Skeleton */}
        <div className="relative">
          {/* Avatar Skeleton */}
          <Skeleton className="w-32 h-32 rounded-full absolute -top-16" />
          
          <div className="ml-36 pt-4 flex justify-between items-start">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" /> {/* Name */}
              <Skeleton className="h-4 w-64" /> {/* Email */}
              <Skeleton className="h-4 w-40" /> {/* Location */}
              <div className="flex items-center space-x-4 mt-4">
                <Skeleton className="h-6 w-32" /> {/* Profile Type */}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" /> {/* Follow Button */}
              <Skeleton className="h-10 w-10" /> {/* More Button */}
            </div>
          </div>
        </div>

        {/* Stats Section Skeleton */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg p-4">
              <Skeleton className="h-8 w-20 mx-auto mb-2" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
          ))}
        </div>

        {/* Posts Section Skeleton */}
        <div className="mt-8">
          <Skeleton className="h-8 w-32 mb-4" /> {/* Posts Title */}
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="mt-6">
                  <Skeleton className="h-px w-full my-4" />
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import { Card, CardContent, CardHeader } from "./card";
import { Skeleton } from "./skeleton";

export function AuthFormSkeleton() {
  return (
    <Card className="w-[600px] mt-[60px]">
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Additional fields (for sign-up) */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Submit button */}
        <Skeleton className="h-10 w-full" />

        {/* Bottom link */}
        <Skeleton className="h-4 w-48 mx-auto" />
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader } from "@shared/ui/card";
import { Skeleton } from "@shared/ui/skeleton";
import type { ProductGridSkeletonProps } from "../model/interface";

function ProductCardSkeleton() {
  return (
    <Card>
      <CardHeader className="p-0">
        <Skeleton className="aspect-[4/3] w-full" />
      </CardHeader>
      <CardContent className="p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-1 h-4 w-1/2" />
        <Skeleton className="mt-2 h-5 w-1/3" />
      </CardContent>
    </Card>
  );
}

export function ProductGridSkeleton({ count = 12 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

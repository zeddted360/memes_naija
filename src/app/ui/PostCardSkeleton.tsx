import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PostCardSkeleton = () => {
  return (
    <Card className="flex flex-col justify-between ">
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-32 w-full" /> {/* Placeholder for image */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-28" /> {/* Placeholder for Button */}
      </CardFooter>
    </Card>
  );
};

export default PostCardSkeleton;

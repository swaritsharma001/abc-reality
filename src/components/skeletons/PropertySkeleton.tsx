import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function PropertyCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="relative">
        {/* Image skeleton */}
        <Skeleton className="w-full h-64" />
        
        {/* Badges skeleton */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        {/* Heart button skeleton */}
        <Skeleton className="absolute top-4 right-4 h-8 w-8 rounded-full" />
        
        {/* Price skeleton */}
        <div className="absolute bottom-4 left-4">
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
      
      <CardContent className="p-6">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-4/5 mb-2" />
        
        {/* Location skeleton */}
        <div className="flex items-center mb-4">
          <Skeleton className="h-4 w-4 mr-1" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* Property details skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-1" />
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-1" />
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-1" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
        
        {/* Button skeleton */}
        <Skeleton className="w-full h-10 rounded-lg" />
      </CardContent>
    </Card>
  )
}

export function PropertyListingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }, (_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  )
}
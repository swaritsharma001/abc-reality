import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function PropertyDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton - assuming header is always loaded */}
      <div className="h-20 bg-background border-b" />
      
      <div className="pt-24 animate-pulse">
        {/* Back Button skeleton */}
        <div className="container mx-auto px-4 mb-6">
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Property Image skeleton */}
        <div className="container mx-auto px-4 mb-8">
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full" />
            <div className="absolute top-4 left-4 flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Property Details skeleton */}
        <div className="container mx-auto px-4 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content skeleton */}
            <div className="lg:col-span-2">
              {/* Title skeleton */}
              <Skeleton className="h-10 w-4/5 mb-4" />
              
              {/* Location skeleton */}
              <div className="flex items-center mb-6">
                <Skeleton className="h-5 w-5 mr-2" />
                <Skeleton className="h-6 w-1/2" />
              </div>

              {/* Price skeleton */}
              <Skeleton className="h-10 w-48 mb-6" />

              {/* Property Features skeleton */}
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>

              {/* Description skeleton */}
              <div className="mb-8">
                <Skeleton className="h-8 w-32 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              {/* Features skeleton */}
              <div className="mb-8">
                <Skeleton className="h-8 w-24 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="w-2 h-2 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
                
                {/* Gallery Button skeleton */}
                <Skeleton className="h-12 w-48" />
              </div>
            </div>

            {/* Contact Sidebar skeleton */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-6 mx-auto" />
                  
                  <div className="space-y-4">
                    <Skeleton className="w-full h-14" />
                    <Skeleton className="w-full h-14" />
                  </div>

                  <div className="mt-6 pt-6 border-t text-center space-y-2">
                    <Skeleton className="h-4 w-32 mx-auto" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
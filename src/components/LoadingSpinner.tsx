import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  showText?: boolean
}

export function LoadingSpinner({ size = "md", className, showText = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-16 w-16"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative">
        {/* Outer Ring */}
        <div className={cn(
          "animate-spin rounded-full border-4 border-muted",
          sizeClasses[size]
        )}>
          <div className={cn(
            "absolute inset-0 rounded-full border-4 border-transparent border-t-luxury animate-spin",
            sizeClasses[size]
          )} />
        </div>
        
        {/* Inner Ring */}
        <div className={cn(
          "absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-luxury-light",
          size === "sm" ? "inset-1" : size === "lg" ? "inset-3" : "inset-2"
        )} style={{ animationDirection: "reverse", animationDuration: "1s" }} />
      </div>
      
      {showText && (
        <div className="text-center animate-fade-in">
          <div className="text-2xl font-bold bg-gradient-to-r from-luxury to-luxury-light bg-clip-text text-transparent mb-1">
            ROAR Properties
          </div>
          <div className="text-sm text-muted-foreground">
            Loading luxury experiences...
          </div>
        </div>
      )}
    </div>
  )
}
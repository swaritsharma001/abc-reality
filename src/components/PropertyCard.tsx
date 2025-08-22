import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LazyImage } from "@/components/LazyImage"
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    price: string
    location: string
    bedrooms: string
    bathrooms: string
    area: string
    image: string
    type: string
    featured?: boolean
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`)
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in">
      <div className="relative overflow-hidden">
        <LazyImage 
          src={property.image} 
          alt={property.title}
          className="w-full h-64 group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {property.featured && (
            <Badge className="bg-luxury text-white font-semibold">Featured</Badge>
          )}
          <Badge variant="secondary">{property.type}</Badge>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
        >
          <Heart className="h-4 w-4" />
        </Button>
        <div className="absolute bottom-4 left-4">
          <div className="text-white text-2xl font-bold">{property.price}</div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-luxury transition-colors">
          {property.title}
        </h3>
        
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.area}</span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleViewDetails}
          className="w-full bg-gradient-to-r from-luxury to-luxury-light text-white hover:from-luxury-dark hover:to-luxury font-semibold"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
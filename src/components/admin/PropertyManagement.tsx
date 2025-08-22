import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Search, Home, MapPin, Bed } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Property {
  id: string
  title: string
  location: string
  price: string
  type: "Villa" | "Penthouse" | "Apartment" | "Townhouse"
  bedrooms: number
  bathrooms: number
  area: string
  status: "available" | "sold" | "pending"
  featured: boolean
  dateAdded: string
}

export function PropertyManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"title" | "location">("title")
  const [filterType, setFilterType] = useState<string>("all")
  
  const [properties, setProperties] = useState<Property[]>([
    {
      id: "1",
      title: "Luxury Villa with Private Pool",
      location: "Palm Jumeirah, Dubai",
      price: "AED 12,500,000",
      type: "Villa",
      bedrooms: 5,
      bathrooms: 6,
      area: "8,500 sq ft",
      status: "available",
      featured: true,
      dateAdded: "2023-01-15"
    },
    {
      id: "2",
      title: "Modern Penthouse with City Views",
      location: "Dubai Marina, Dubai",
      price: "AED 8,750,000",
      type: "Penthouse",
      bedrooms: 4,
      bathrooms: 5,
      area: "4,200 sq ft",
      status: "available",
      featured: true,
      dateAdded: "2023-02-10"
    },
    {
      id: "3",
      title: "Spacious Family Apartment",
      location: "Downtown Dubai",
      price: "AED 3,200,000",
      type: "Apartment",
      bedrooms: 3,
      bathrooms: 3,
      area: "2,100 sq ft",
      status: "sold",
      featured: false,
      dateAdded: "2023-03-05"
    },
    {
      id: "4",
      title: "Contemporary Townhouse",
      location: "Dubai Hills Estate",
      price: "AED 4,800,000",
      type: "Townhouse",
      bedrooms: 4,
      bathrooms: 4,
      area: "3,800 sq ft",
      status: "pending",
      featured: false,
      dateAdded: "2023-04-12"
    },
    {
      id: "5",
      title: "Beachfront Villa",
      location: "Jumeirah Beach Residence",
      price: "AED 15,000,000",
      type: "Villa",
      bedrooms: 6,
      bathrooms: 7,
      area: "9,200 sq ft",
      status: "available",
      featured: true,
      dateAdded: "2023-05-20"
    }
  ])

  const filteredProperties = properties.filter(property => {
    const searchValue = searchTerm.toLowerCase()
    const matchesSearch = searchType === "title" 
      ? property.title.toLowerCase().includes(searchValue)
      : property.location.toLowerCase().includes(searchValue)
    
    const matchesType = filterType === "all" || property.type === filterType
    
    return matchesSearch && matchesType
  })

  const deleteProperty = (propertyId: string) => {
    setProperties(properties.filter(property => property.id !== propertyId))
    toast({
      title: "Property Deleted",
      description: "Property has been successfully deleted.",
    })
  }

  const toggleFeatured = (propertyId: string) => {
    setProperties(properties.map(property => 
      property.id === propertyId 
        ? { ...property, featured: !property.featured }
        : property
    ))
    toast({
      title: "Featured Status Updated",
      description: "Property featured status has been updated.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "default"
      case "sold": return "secondary"
      case "pending": return "destructive"
      default: return "default"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Property Management
        </CardTitle>
        <CardDescription>
          Manage property listings, update status, and control visibility
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search by ${searchType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={searchType} onValueChange={(value: "title" | "location") => setSearchType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Search by Title</SelectItem>
              <SelectItem value="location">Search by Location</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Penthouse">Penthouse</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Townhouse">Townhouse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Properties Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {property.title}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate max-w-[150px]">{property.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-luxury">
                    {property.price}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{property.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Bed className="h-3 w-3" />
                      {property.bedrooms}BD • {property.bathrooms}BA
                    </div>
                    <div className="text-xs text-muted-foreground">{property.area}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(property.status)}>
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={property.featured ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFeatured(property.id)}
                    >
                      {property.featured ? "Featured" : "Not Featured"}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteProperty(property.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No properties found matching your criteria.</p>
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredProperties.length} of {properties.length} properties
        </div>
      </CardContent>
    </Card>
  )
}
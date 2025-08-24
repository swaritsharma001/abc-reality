import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { PropertyFilters } from "@/components/PropertyFilters"
import { PropertyCard } from "@/components/PropertyCard"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { ArrowRight, Star, Users, Award, CheckCircle, Mail, Phone } from "lucide-react"
import heroImage from "@/assets/hero-bg.jpg"
import Autoplay from "embla-carousel-autoplay"
import { useNavigate } from "react-router-dom"

interface PropertyData {
  id: string
  title: string
  price: string
  location: string
  bedrooms: number
  bathrooms: number
  area: string
  image: string
  type: string
  featured: boolean
  status: string
  sale_status: string
  developer: string
}

interface FilterState {
  location: string
  minPrice: string
  maxPrice: string
  propertyType: string
  status: string
  sale_status: string
  area: string
  developer: string
}

const Index = () => {
  const navigate = useNavigate()
  const [featuredProperties, setFeaturedProperties] = useState<PropertyData[]>([])
  const [filteredProperties, setFilteredProperties] = useState<PropertyData[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [page, setPageData] = useState<any>({})
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    status: "",
    sale_status: "",
    area: "",
    developer: ""
  })

  // Fetch page data
  useEffect(() => {
    async function fetchPageData() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/page`)
        const data = await res.json()
        setPageData(data)
      } catch (error) {
        console.error("Error fetching page data:", error)
      }
    }
    fetchPageData()
  }, [])

  // Fetch team members
  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/team`)
        const data = await res.json()
        setTeamMembers(data)
      } catch (error) {
        console.error("Error fetching team data:", error)
      }
    }
    fetchTeam()
  }, [])

  // Single property detail fetcher
  async function getPropertyDetail(id: string) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/property/${id}`)
      const data = await res.json()
      return data
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error)
      return null
    }
  }

  // Fetch properties with filters (similar to Properties component)
  const fetchProperties = async (isFiltered = false, limit = 5) => {
    setIsFiltering(true)
    try {
      let query = new URLSearchParams({
        page: "1",
        limit: limit.toString(),
      })

      // Add filters if this is a filtered request
      if (isFiltered) {
        if (filters.location) query.append("location", filters.location)
        if (filters.minPrice) query.append("minPrice", filters.minPrice)
        if (filters.maxPrice) query.append("maxPrice", filters.maxPrice)
        if (filters.developer) query.append("developer", filters.developer)
        if (filters.status) query.append("status", filters.status)
        if (filters.sale_status) query.append("sale_status", filters.sale_status)
        if (filters.area) query.append("area", filters.area)
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/property?${query.toString()}`
      )

      if (!response.ok) throw new Error("Failed to fetch properties")

      const apiData = await response.json()
      const properties = apiData.properties || []

      // Fetch detailed data for each property
      const detailedProperties = await Promise.all(
        properties.map(async (property: any) => {
          let imageUrl = ""
          try {
            const parsedImage = JSON.parse(property.cover_image_url)
            imageUrl = parsedImage.url || ""
          } catch {
            imageUrl = ""
          }

          // Fetch detailed property data
          const propertyData = await getPropertyDetail(property.id)
          const detail = propertyData?.data?.pageProps?.property

          return {
            id: property.id.toString(),
            title: detail?.name || property.name,
            price: `AED ${
              detail?.min_price?.toLocaleString() ||
              property.min_price?.toLocaleString() ||
              "Price on request"
            }`,
            location: `${detail?.area || property.area}, ${
              detail?.country || property.country || "UAE"
            }`,
            developer: detail?.developer || property.developer,
            bedrooms: detail?.unit_blocks?.[0]?.unit_bedrooms || 1,
            bathrooms: getBathroomsFromUnits(detail?.unit_blocks || []) || 1,
            area: getAreaFromUnits(detail?.unit_blocks || []) || "Size varies",
            image: imageUrl,
            type: detail?.status || property.status || "Apartment",
            featured: true,
            status: detail?.status || property.status || "",
            sale_status: detail?.sale_status || property.sale_status || "",
            minPriceValue: detail?.min_price || property.min_price || 0,
            areaValue: detail?.unit_blocks?.[0]?.units_area_from || 0
          }
        })
      )

      return detailedProperties
    } catch (error) {
      console.error("Error fetching properties:", error)
      return []
    } finally {
      setIsFiltering(false)
    }
  }

  // Load initial featured properties
  useEffect(() => {
    const loadInitialProperties = async () => {
      const properties = await fetchProperties(false, 5) // No filters, 5 properties
      setFeaturedProperties(properties)
    }

    loadInitialProperties()
  }, [])

  // Handle filter submission
  const handleFilterSubmit = async () => {
    const filteredProps = await fetchProperties(true, 10) // With filters, more properties
    setFilteredProperties(filteredProps)
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      propertyType: "",
      status: "",
      sale_status: "",
      area: "",
      developer: ""
    })
    setFilteredProperties([])
  }

  // Helper functions
  const getBathroomsFromUnits = (units: any[]): number => {
    if (!units?.length) return 1
    const bedrooms = units[0]?.unit_bedrooms || 1
    return bedrooms >= 3 ? bedrooms : bedrooms + 1
  }

  const getAreaFromUnits = (units: any[]): string => {
    if (!units?.length) return 'Size varies'
    const firstUnit = units[0]
    if (firstUnit.units_area_from && firstUnit.units_area_to) {
      return `${firstUnit.units_area_from} - ${firstUnit.units_area_to} ${firstUnit.area_unit}`
    }
    return 'Size varies'
  }

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== "")

  // Determine which properties to show
  const propertiesToShow = hasActiveFilters ? filteredProperties : featuredProperties

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />

        <div className="relative z-1 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-24 animate-fade-in">
            <span className="block text-white" style={{ transform: 'translateY(80px)' }}>
              {page?.HeroTitle || "Find Your Dream Luxury Home"}
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
            {page?.HeroSubtitle || "Discover Dubai's most exclusive properties with Roar Realty. Your gateway to luxury living in the heart of the UAE."}
          </p>

          <div className="mb-12">
            <PropertyFilters 
              onFilterSubmit={handleFilterSubmit}
              onClearFilters={clearFilters}
              isLoading={isFiltering}
              filters={filters}
              setFilters={setFilters}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/properties")} className="bg-gradient-to-r from-luxury to-luxury-light text-white hover:from-luxury-dark hover:to-luxury font-semibold text-lg px-8 py-6 mb-4">
              Explore Properties <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {hasActiveFilters ? "Search Results" : "Featured"} <span className="bg-gradient-to-r from-luxury to-luxury-light bg-clip-text text-transparent">Properties</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {hasActiveFilters 
                ? `Found ${filteredProperties.length} properties matching your criteria`
                : "Handpicked selection of Dubai's most prestigious properties"
              }
            </p>
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="mt-4 border-luxury text-luxury hover:bg-luxury hover:text-white"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {isFiltering ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury mx-auto mb-4"></div>
              <p className="text-muted-foreground">Searching properties...</p>
            </div>
          ) : propertiesToShow.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {propertiesToShow.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              <div className="text-center mt-12">
                <a href="/properties">
                  <Button size="lg" variant="outline" className="border-luxury text-luxury hover:bg-luxury hover:text-white">
                    View All Properties <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </>
          ) : hasActiveFilters ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-4">No Properties Found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any properties matching your search criteria. 
                  Try adjusting your filters or browse all properties.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={clearFilters} variant="outline" className="border-luxury text-luxury hover:bg-luxury hover:text-white">
                    Clear Filters
                  </Button>
                  <a href="/properties">
                    <Button className="bg-gradient-to-r from-luxury to-luxury-light text-white hover:from-luxury-dark hover:to-luxury">
                      Browse All Properties
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why Choose <span className="bg-gradient-to-r from-luxury to-luxury-light bg-clip-text text-transparent">Roar Realty</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                With years of experience in Dubai's luxury real estate market, 
                we provide unparalleled service and expertise to help you find 
                the perfect property.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-luxury" />
                  <span>Expert knowledge of Dubai's prime locations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-luxury" />
                  <span>Personalized service tailored to your needs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-luxury" />
                  <span>Access to exclusive off-market properties</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-luxury" />
                  <span>End-to-end support throughout your journey</span>
                </div>
              </div>

              <Button size="lg" className="bg-gradient-to-r from-luxury to-luxury-light text-white hover:from-luxury-dark hover:to-luxury font-semibold">
                Learn More About Us
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-card rounded-lg border border-border">
                <Star className="h-12 w-12 text-luxury mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">{page?.PropertiesSold || "500+"}</h3>
                <p className="text-muted-foreground">Properties Sold</p>
              </div>
              <div className="text-center p-6 bg-card rounded-lg border border-border">
                <Users className="h-12 w-12 text-luxury mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">{page?.happyClient || "1000+"}</h3>
                <p className="text-muted-foreground">Happy Clients</p>
              </div>
              <div className="text-center p-6 bg-card rounded-lg border border-border">
                <Award className="h-12 w-12 text-luxury mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">{page?.Experience || "15+"}</h3>
                <p className="text-muted-foreground">Years Experience</p>
              </div>
              <div className="text-center p-6 bg-card rounded-lg border border-border">
                <CheckCircle className="h-12 w-12 text-luxury mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">{page?.Satisfaction || "98.9%"}</h3>
                <p className="text-muted-foreground">Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Meet Our <span className="bg-gradient-to-r from-luxury to-luxury-light bg-clip-text text-transparent">Expert Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our experienced professionals are dedicated to making your real estate dreams come true
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Carousel
              plugins={[
                Autoplay({
                  delay: 4000,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {teamMembers.map((member) => (
                  <CarouselItem key={member.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full hover-scale transition-all duration-300 hover:shadow-lg border-border/50">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className="relative mb-6">
                            <img
                              src={member.img}
                              alt={member.name}
                              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-luxury/20"
                            />
                          </div>
                          <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                          <p className="text-luxury font-semibold mb-3">{member.role}</p>
                          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            {member.bio}
                          </p>
                          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center justify-center gap-2">
                              <Mail className="h-4 w-4 text-luxury" />
                              <span className="text-xs">{member.email}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <Phone className="h-4 w-4 text-luxury" />
                              <span className="text-xs">{member.phone}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your <span className="bg-gradient-to-r from-luxury to-luxury-light bg-clip-text text-transparent">Dream Home?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let our expert team guide you through Dubai's luxury real estate market
          </p>
          <Button size="lg" className="bg-gradient-to-r from-luxury to-luxury-light text-white hover:from-luxury-dark hover:to-luxury font-semibold text-lg px-8 py-6">
            Get In Touch Today
          </Button>
        </div>
      </section>

      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyFilters } from "@/components/PropertyFilters";
import { PropertyCard } from "@/components/PropertyCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { PropertyListingSkeleton } from "@/components/skeletons/PropertySkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const propertiesPerPage = 10;

const Properties = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    status: "",
    sale_status: "",
    area: "",
    developer: ""
  });

  // API: single property detail fetcher
  async function get(id: string) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/property/${id}`);
    const data = await res.json();
    return data;
  }

  // API: paginated list fetcher
  const fetchProperties = async (page = 1) => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        ...(filters.location && { location: filters.location }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.developer && { developer: filters.developer }),
        ...(filters.status && { status: filters.status }),
        ...(filters.sale_status && { sale_status: filters.sale_status }),
        ...(filters.area && {area: filters.area }),
        page: page.toString(),
        limit: propertiesPerPage.toString(),
      }).toString();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/property?${query}`
      );
      if (!response.ok) throw new Error("Failed to fetch properties");

      const apiData = await response.json();

      // Har property ke liye detail fetch karo (parallel)
      const detailedProperties = await Promise.all(
        apiData.properties.map(async (p: any) => {
          try {
            const propertyData = await get(p.id);
            const detail = propertyData?.data?.pageProps?.property;

            return {
              id: p.id.toString(),
              title: p.name,
              price: `AED ${
                p.min_price?.toLocaleString() || "Price on request"
              }`,
              location: `${p.area || "Unknown"}, UAE`,
              bedrooms: detail?.unit_blocks[1].unit_bedrooms,
              bathrooms: 2,
              area: p.area_unit ? `${p.area_unit}` : "Size varies",
              image:
                JSON.parse(p.cover_image_url)?.url ||
                "/placeholder-property.jpg",
              type: detail?.unit_blocks[0].normalized_type || "N/A",
              featured: detail?.sale_status || "",
              status: detail?.status || "",
              sale_status: detail?.sale_status || "",
              developer: p.developer
            };
          } catch (err) {
            console.error("Failed to fetch property details:", err);
            return {
              id: p.id.toString(),
              title: p.name,
              price: `AED ${
                p.min_price?.toLocaleString() || "Price on request"
              }`,
              location: `${p.area || "Unknown"}, UAE`,
              bedrooms: 2,
              bathrooms: 2,
              area: p.area_unit ? `${p.area_unit}` : "Size varies",
              image:
                JSON.parse(p.cover_image_url)?.url ||
                "/placeholder-property.jpg",
              type: "N/A",
              featured: "",
              status: p.status,
              sale_status: p.sale_status,
            };
          }
        })
      );

      setAllProperties(detailedProperties);
      setCurrentPage(apiData.page);
      setTotalPages(apiData.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFilterSubmit = () => fetchProperties(1);

  const handlePageChange = (page: number) => {
    fetchProperties(page);
  };

  const getPaginationRange = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-16 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              All{" "}
              <span className="bg-gradient-to-r from-luxury to-luxury-light bg-clip-text text-transparent">
                Properties
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Explore our complete collection of luxury properties in Dubai's
              most prestigious locations
            </p>

            <div className="max-w-4xl mx-auto">
              <PropertyFilters
                filters={filters}
                setFilters={setFilters}
                onFilterSubmit={handleFilterSubmit}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {isLoading
                ? "Loading Properties..."
                : `Showing ${allProperties.length} Properties`}
            </h2>
            {!isLoading && (
              <div className="text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>

          {isLoading ? (
            <PropertyListingSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {!isLoading && totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}

                  {getPaginationRange().map((page, idx) =>
                    page === "..." ? (
                      <PaginationItem key={idx}>
                        <span className="px-3 py-2">...</span>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(Number(page))}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default Properties;
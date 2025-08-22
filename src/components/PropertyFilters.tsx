import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, DollarSign, Home, Bed } from "lucide-react";

export function PropertyFilters({ filters, setFilters, onFilterSubmit, onClearFilters }) {

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      propertyType: "",
      status: "",
      sale_status: "",
      area: "",
      developer: "",
    });
    onFilterSubmit({}); // refresh data
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card/90 backdrop-blur-sm border-border shadow-elegant">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-luxury" /> Location
            </Label>
            <Select
              value={filters.location}
              onValueChange={(value) => {
                setFilters({ ...filters, location: value });
                onFilterSubmit({ ...filters, location: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dubai">Dubai</SelectItem>
                {/* Add more locations if needed */}
              </SelectContent>
            </Select>
          </div>

          {/* Min Price */}
          <div className="space-y-2">
            <Label htmlFor="minPrice" className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-luxury" /> Min Price (AED)
            </Label>
            <Input
              id="minPrice"
              placeholder="Min price"
              type="number"
              value={filters.minPrice}
              onChange={(e) => {
                setFilters({ ...filters, minPrice: e.target.value });
                onFilterSubmit({ ...filters, minPrice: e.target.value });
              }}
            />
          </div>

          {/* Max Price */}
          <div className="space-y-2">
            <Label htmlFor="maxPrice" className="text-sm font-medium">Max Price (AED)</Label>
            <Input
              id="maxPrice"
              placeholder="Max price"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => {
                setFilters({ ...filters, maxPrice: e.target.value });
                onFilterSubmit({ ...filters, maxPrice: e.target.value });
              }}
            />
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <Label htmlFor="propertyType" className="text-sm font-medium flex items-center gap-2">
              <Home className="h-4 w-4 text-luxury" /> Developer
            </Label>
            <Select
              value={filters.developer}
              onValueChange={(value) => {
                setFilters({ ...filters, developer: value });
                onFilterSubmit({ ...filters, developer: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAMAC">DAMAC</SelectItem>
                <SelectItem value="Emaar">Emaar</SelectItem>
                <SelectItem value="Meraas">Meraas</SelectItem>
                <SelectItem value="Binghatti">Binghatti</SelectItem>
                <SelectItem value="Nakheel">Nakheel</SelectItem>
                <SelectItem value="Sobha">Sobha</SelectItem>
                <SelectItem value="Meraas">Meraas</SelectItem>
                <SelectItem value="Taraf Holding">Taraf Holding</SelectItem>
                <SelectItem value="Danube">Danube</SelectItem>
                <SelectItem value="Majid Al Futtaim">Majid Al Futtaim</SelectItem>
                <SelectItem value="Ellington">Ellington</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium flex items-center gap-2">
              <Bed className="h-4 w-4 text-luxury" /> Status
            </Label>
            <Select
              value={filters.status}
              onValueChange={(value) => {
                setFilters({ ...filters, status: value });
                onFilterSubmit({ ...filters, status: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Under construction">Under construction</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Presale">Presale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sale Status */}
          <div className="space-y-2">
            <Label htmlFor="sale_status" className="text-sm font-medium flex items-center gap-2">
              <Bed className="h-4 w-4 text-luxury" /> Sale Status
            </Label>
            <Select
              value={filters.sale_status}
              onValueChange={(value) => {
                setFilters({ ...filters, sale_status: value });
                onFilterSubmit({ ...filters, sale_status: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Sale Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Out of stock">Out of stock</SelectItem>
                <SelectItem value="On sale">On sale</SelectItem>
                <SelectItem value="Presale(EOI)">Presale(EOI)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Area */}
          <div className="space-y-2">
            <Label htmlFor="area" className="text-sm font-medium">Area (sq ft)</Label>
            <Input
              id="area"
              placeholder="Min area"
              type="number"
              value={filters.area}
              onChange={(e) => {
                setFilters({ ...filters, area: e.target.value });
                onFilterSubmit({ ...filters, area: e.target.value });
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            className="flex-1 bg-gradient-to-r from-luxury to-luxury-light text-white hover:from-luxury-dark hover:to-luxury font-semibold h-12"
            onClick={() => onFilterSubmit(filters)}
          >
            <Search className="h-4 w-4 mr-2" /> Search Properties
          </Button>

          <Button
            variant="outline"
            className="flex-1 border-luxury text-luxury hover:bg-luxury hover:text-white h-12"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Images } from "lucide-react"
import villa1 from "@/assets/villa-1.jpg"
import penthouse1 from "@/assets/penthouse-1.jpg"

interface ImageGalleryProps {
  propertyTitle: string
  images?: string[]
}

export function ImageGallery({ propertyTitle, images: propImages }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const images = propImages && propImages.length > 0 ? propImages : [
    villa1,
    penthouse1,
    villa1,
    penthouse1,
    villa1
  ]

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-luxury to-luxury-light text-white hover:from-luxury-dark hover:to-luxury font-semibold px-6 py-3 rounded-lg flex items-center gap-2 animate-fade-in hover-scale"
      >
        <Images className="h-5 w-5" />
        View Gallery ({images.length} Photos)
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 bg-black/90 border-none">
          <DialogTitle className="sr-only">{propertyTitle} - Image Gallery</DialogTitle>
          
          {/* Close Button */}
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Main Image */}
          <div className="relative h-full flex items-center justify-center">
            <img
              src={images[currentIndex]}
              alt={`${propertyTitle} - Image ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain animate-fade-in"
              loading="lazy"
            />

            {/* Navigation Buttons */}
            <Button
              onClick={prevImage}
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              onClick={nextImage}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex ? 'border-luxury scale-110' : 'border-white/30 hover:border-white/70'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
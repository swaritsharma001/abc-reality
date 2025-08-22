import { Card, CardContent } from "@/components/ui/card"

interface DubaiMapProps {
  location?: string
  coordinates?: string
}

export const DubaiMap = ({ location = "Dubai, UAE", coordinates }: DubaiMapProps) => {
  // Parse coordinates if provided, otherwise use default Dubai coordinates
  const getMapUrl = () => {
    if (coordinates) {
      const [lat, lng] = coordinates.split(',').map(coord => parseFloat(coord.trim()))
      if (!isNaN(lat) && !isNaN(lng)) {
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.5!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${lat}°${lat >= 0 ? 'N' : 'S'}+${lng}°${lng >= 0 ? 'E' : 'W'}!5e0!3m2!1sen!2s!4v1703123456789!5m2!1sen!2s`
      }
    }
    // Default Dubai map
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.6174689284!2d54.897808!3d25.0762308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1703123456789!5m2!1sen!2s"
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Location</h2>
      <Card>
        <CardContent className="p-0">
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
            <iframe
              src={getMapUrl()}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map showing ${location}`}
              className="rounded-lg"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
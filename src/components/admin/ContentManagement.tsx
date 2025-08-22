import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Image, Mail, Phone, MapPin, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import cookie from "js-cookie"
import axios from "axios"

interface WebsiteSettings {
  siteName: string
  logo: string
  heroTitle: string
  heroSubtitle: string
  primaryEmail: string
  supportEmail: string
  phone: string
  address: string
  socialMedia: {
    facebook: string
    instagram: string
    twitter: string
    linkedin: string
  }
}

export function ContentManagement() {
  const backend = import.meta.env.VITE_API_URL
  const token = cookie.get("token")
  const { toast } = useToast()

  const [settings, setSettings] = useState<WebsiteSettings>({
    siteName: "",
    logo: "",
    heroTitle: "",
    heroSubtitle: "",
    primaryEmail: "",
    supportEmail: "",
    phone: "",
    address: "",
    socialMedia: { facebook: "", instagram: "", twitter: "", linkedin: "" }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch settings on mount
  useEffect(() => {
    fetchWebsiteSettings()
  }, [])

  const fetchWebsiteSettings = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${backend}/page`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data) {
        setSettings({
          siteName: response.data.SiteName || "",
          logo: response.data.HeroImage || "",
          heroTitle: response.data.HeroTitle || "",
          heroSubtitle: response.data.HeroSubtitle || "",
          primaryEmail: response.data.primaryEmail || "anurag@roarrealty.ae",
          supportEmail: response.data.supportEmail || "support@roarrealty.ae",
          phone: response.data.PhoneNumber || "+971 585005438",
          address: response.data.Address || "NO NEED TO FEEL",
          socialMedia: {
            facebook: response.data.Facebook || "NO NEED TO FEEL",
            instagram: response.data.Instagram || "https://www.instagram.com/roar.realty/",
            twitter: response.data.Twitter || "https://www.instagram.com/roar.realty/",
            linkedin: response.data.LinkedIn || "https://www.instagram.com/roar.realty/"
          }
        })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load website settings.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  // ---------- Submit Handlers ----------
  const handleSiteSubmit = async () => {
    try {
      setIsSaving(true)
      await axios.post(`${backend}/page/site`, {
        SiteName: settings.siteName,
        HeroTitle: settings.heroTitle,
        HeroSubtitle: settings.heroSubtitle
      }, { headers: { Authorization: `Bearer ${token}` } })

      toast({ title: "Updated", description: "Site settings saved." })
    } catch (error) {
      toast({ title: "Error", description: "failed to save site settings.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleContactSubmit = async () => {
    try {
      setIsSaving(true)
      await axios.post(`${backend}/page/contact`, {
        primaryEmail: settings.primaryEmail,
        supportEmail: settings.supportEmail,
        PhoneNumber: settings.phone,
        Address: settings.address
      }, { headers: { Authorization: `Bearer ${token}` } })

      toast({ title: "Updated", description: "Contact details saved." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to save contact info.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLinksSubmit = async () => {
    try {
      setIsSaving(true)
      await axios.post(`${backend}/page/links`, {
        Facebook: settings.socialMedia.facebook,
        Instagram: settings.socialMedia.instagram,
        Twitter: settings.socialMedia.twitter,
        LinkedIn: settings.socialMedia.linkedin
      }, { headers: { Authorization: `Bearer ${token}` } })

      toast({ title: "Updated", description: "Social links saved." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to save links.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  // ---------- UI ----------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading settings...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Site Identity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" /> Site Identity
          </CardTitle>
          <CardDescription>Update site name and hero section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Site Name</Label>
          <Input value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} />

          <Label>Hero Title</Label>
          <Input value={settings.heroTitle} onChange={(e) => setSettings({...settings, heroTitle: e.target.value})} />

          <Label>Hero Subtitle</Label>
          <Textarea value={settings.heroSubtitle} onChange={(e) => setSettings({...settings, heroSubtitle: e.target.value})} rows={2} />

          <Button onClick={handleSiteSubmit} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Site
          </Button>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Contact Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Primary Email</Label>
          <Input value={settings.primaryEmail} onChange={(e) => setSettings({...settings, primaryEmail: e.target.value})} />

          <Label>Support Email</Label>
          <Input value={settings.supportEmail} onChange={(e) => setSettings({...settings, supportEmail: e.target.value})} />

          <Label>Phone</Label>
          <Input value={settings.phone} onChange={(e) => setSettings({...settings, phone: e.target.value})} />

          <Label>Address</Label>
          <Textarea value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} rows={2} />

          <Button onClick={handleContactSubmit} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Contact
          </Button>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Facebook</Label>
          <Input value={settings.socialMedia.facebook} onChange={(e) => setSettings({...settings, socialMedia: {...settings.socialMedia, facebook: e.target.value}})} />

          <Label>Instagram</Label>
          <Input value={settings.socialMedia.instagram} onChange={(e) => setSettings({...settings, socialMedia: {...settings.socialMedia, instagram: e.target.value}})} />

          <Label>Twitter</Label>
          <Input value={settings.socialMedia.twitter} onChange={(e) => setSettings({...settings, socialMedia: {...settings.socialMedia, twitter: e.target.value}})} />

          <Label>LinkedIn</Label>
          <Input value={settings.socialMedia.linkedin} onChange={(e) => setSettings({...settings, socialMedia: {...settings.socialMedia, linkedin: e.target.value}})} />

          <Button onClick={handleLinksSubmit} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Links
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
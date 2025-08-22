

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, Users, Award, CheckCircle, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import cookie from "js-cookie"

interface Statistic {
  id: string
  label: string
  value: string
  icon: React.ReactNode
  description: string
}

export const StatisticsManagement = () => {
  const { toast } = useToast()
  const backend = import.meta.env.VITE_API_URL
  const token = cookie.get("token")

  const [statistics, setStatistics] = useState<Statistic[]>([
    {
      id: "properties-sold",
      label: "Properties Sold",
      value: "",
      icon: <Star className="h-12 w-12 text-luxury" />,
      description: "Total number of properties successfully sold",
    },
    {
      id: "happy-clients",
      label: "Happy Clients",
      value: "",
      icon: <Users className="h-12 w-12 text-luxury" />,
      description: "Number of satisfied customers",
    },
    {
      id: "years-experience",
      label: "Years Experience",
      value: "",
      icon: <Award className="h-12 w-12 text-luxury" />,
      description: "Years of experience in real estate",
    },
    {
      id: "customer-satisfaction",
      label: "Customer Satisfaction",
      value: "",
      icon: <CheckCircle className="h-12 w-12 text-luxury" />,
      description: "Customer satisfaction rate",
    },
  ])

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // ✅ Mapping frontend IDs -> backend fields
  const mapToBackend = (data: Record<string, string>) => ({
    PropertiesSold: data["properties-sold"],
    happyClient: data["happy-clients"],
    Experience: data["years-experience"],
    Satisfaction: data["customer-satisfaction"],
  })

  const mapFromBackend = (data: any) => ({
    "properties-sold": data.PropertiesSold || "1000+",
    "happy-clients": data.happyClient || "1000+",
    "years-experience": data.Experience || "10+",
    "customer-satisfaction": data.Satisfaction || "100%",
  })

  // Fetch stats from backend
  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get(`${backend}/page`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.data) {
        const mappedData = mapFromBackend(res.data)

        setFormData(mappedData)
        setStatistics((prev) =>
          prev.map((stat) => ({
            ...stat,
            value: mappedData[stat.id] || "",
          }))
        )
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to load statistics", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  // Save stats to backend
  const handleSaveStatistics = async () => {
    try {
      setIsSaving(true)

      const payload = mapToBackend(formData)

      await axios.post(`${backend}/page/statistics`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setStatistics((prev) =>
        prev.map((stat) => ({
          ...stat,
          value: formData[stat.id] || stat.value,
        }))
      )

      toast({ title: "Success", description: "Statistics updated successfully" })
    } catch (err) {
      toast({ title: "Error", description: "Failed to update statistics", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetStatistics = () => {
    fetchStats()
    toast({ title: "Reset", description: "Statistics reset to backend values" })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Statistics Management</h2>
        <p className="text-muted-foreground">
          Update the homepage statistics that showcase your company's achievements
        </p>
      </div>

      <div className="grid gap-6">
        {/* Statistics Form */}
        <Card>
          <CardHeader>
            <CardTitle>Update Statistics</CardTitle>
            <CardDescription>
              Modify the values shown on your homepage to reflect current achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {statistics.map((stat) => (
                  <div key={stat.id} className="space-y-2">
                    <Label htmlFor={stat.id} className="flex items-center gap-2">
                      <div className="scale-50">{stat.icon}</div>
                      {stat.label}
                    </Label>
                    <Input
                      id={stat.id}
                      value={formData[stat.id] || ""}
                      onChange={(e) => handleInputChange(stat.id, e.target.value)}
                      placeholder={`Enter ${stat.label.toLowerCase()}`}
                    />
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSaveStatistics}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleResetStatistics}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              This is how your statistics will appear on the homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {statistics.map((stat) => (
                <div key={stat.id} className="text-center p-6 bg-card rounded-lg border border-border">
                  {stat.icon}
                  <h3 className="text-2xl font-bold mb-2">{formData[stat.id] || stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
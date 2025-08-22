import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"  
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/admin/UserManagement"
import { PropertyManagement } from "@/components/admin/PropertyManagement"
import { ContentManagement } from "@/components/admin/ContentManagement"
import { TeamManagement } from "@/components/admin/TeamManagement"
import { StatisticsManagement } from "@/components/admin/StatisticsManagement"
import { Shield, Users, Home, Settings, UsersRound, BarChart3 } from "lucide-react"

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Admin Header */}
      <section className="pt-20 pb-8 bg-gradient-to-r from-luxury to-luxury-light">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">Admin Panel</h1>
            </div>
            <p className="text-xl opacity-90">
              Manage users, properties, team members, statistics, and website content
            </p>
          </div>
        </div>
      </section>

      {/* Admin Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <UsersRound className="h-4 w-4" />
                Team
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Content
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            <TabsContent value="properties">
              <PropertyManagement />
            </TabsContent>

            <TabsContent value="team">
              <TeamManagement />
            </TabsContent>

            <TabsContent value="statistics">
              <StatisticsManagement />
            </TabsContent>

            <TabsContent value="content">
              <ContentManagement />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Admin
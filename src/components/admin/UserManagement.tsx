import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import cookie from "js-cookie"
import axios from "axios"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
}

export function UserManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"name" | "email">("name")
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function call() {
      try {
        const token = cookie.get("token")
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/allUsers`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUsers(res.data)
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive"
        })
      }
    }
    call()
  }, [])

  async function handleUpdate(user: User) {
    try {
      const token = cookie.get("token")
      await axios.post(`${import.meta.env.VITE_API_URL}/user/update`, user, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast({
        title: "User Updated",
        description: `User ${user.name} updated successfully`
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      })
    }
  }

  const updateUserRole = async (userId: string, newRole: "admin" | "user") => {
    const updatedUser = users.find(user => user.id === userId)
    if (!updatedUser) return

    const userWithNewRole = { ...updatedUser, role: newRole }
    setUsers(users.map(user => user.id === userId ? userWithNewRole : user))

    await handleUpdate(userWithNewRole)
  }

  const filteredUsers = users.filter(user => {
    const searchValue = searchTerm.toLowerCase()
    return searchType === "name"
      ? user.name.toLowerCase().includes(searchValue)
      : user.email.toLowerCase().includes(searchValue)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>
          Manage users, update roles, and control access
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search Controls */}
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
          <Select value={searchType} onValueChange={(value: "name" | "email") => setSearchType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Search by Name</SelectItem>
              <SelectItem value="email">Search by Email</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value: "admin" | "user") => updateUserRole(user.id, value)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found matching your search.</p>
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </CardContent>
    </Card>
  )
}
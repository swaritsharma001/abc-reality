import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Trash } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

interface TeamMember {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  bio: string;
  image?: string;
}

export const TeamManagement = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [formData, setFormData] = useState<Omit<TeamMember, "_id">>({
    name: "",
    email: "",
    phone: "",
    role: "",
    bio: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Token from cookies
  const token = Cookies.get("token");

  // Load team members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`${API_URL}/team`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMembers(data);
      } catch (error) {
        console.error("Fetch members failed:", error);
      }
    };
    fetchMembers();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddMember = async () => {
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("role", formData.role);
      fd.append("bio", formData.bio);
      if (imageFile) fd.append("img", imageFile);

      const res = await fetch(`${API_URL}/team`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      if (!res.ok) throw new Error("Failed to add member");
      const newMember = await res.json();

      setMembers((prev) => [...prev, newMember]);
      setFormData({ name: "", email: "", phone: "", role: "", bio: "", image: "" });
      setImageFile(null);

      toast({ title: "Success", description: "Team member added successfully!" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to add member" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/team/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setMembers((prev) => prev.filter((m) => m._id !== id));
      toast({ title: "Deleted", description: "Team member removed" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to delete member" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Team Member</CardTitle>
          <CardDescription>Fill details and upload image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={formData.role} onChange={handleInputChange} />
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={formData.bio} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input type="file" id="image" accept="image/*" onChange={handleImageChange} />
          </div>
          <Button onClick={handleAddMember} className="flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Member
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team members</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {members.map((m) => (
            <div key={m._id} className="p-4 border rounded-lg space-y-2">
              {m.image && (
                <img src={m.image} alt={m.name} className="w-full h-40 object-cover rounded-lg" />
              )}
              <h3 className="font-semibold">{m.name}</h3>
              <p className="text-sm text-muted-foreground">{m.role}</p>
              <p className="text-xs">{m.email}</p>
              <p className="text-xs">{m.phone}</p>
              <p className="text-sm">{m.bio}</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(m._id!)}
                className="flex items-center gap-2"
              >
                <Trash className="w-4 h-4" /> Delete
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
import { useState, useEffect} from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Github, Mail, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import cookie from "js-cookie"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (provider: string) => {
    setLoading(true)
    
    // Simulate loading for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setLoading(false)
    onOpenChange(false)
window.location.href = `${import.meta.env.VITE_API_URL}/user/auth/google`
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if(token){
      cookie.set("token", token)
    }
  
  }, [window.location.search])
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome to <span className="bg-gradient-to-r from-luxury to-luxury-light bg-clip-text text-transparent">Roar Realty</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <Button
            onClick={() => handleLogin("google")}
            disabled={loading}
            className="w-full h-12 bg-white hover:bg-gray-50 text-black border border-gray-300 font-medium"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Continue with Google
          </Button>
          
          <Button
            onClick={() => handleLogin("github")}
            disabled={loading}
            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Github className="h-4 w-4 mr-2" />
            )}
            Continue with GitHub
          </Button>
        </div>

        {loading && (
          <div className="text-center pt-4">
            <div className="inline-flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Authenticating...</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
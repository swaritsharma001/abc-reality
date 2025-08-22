import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LoginModal } from "@/components/LoginModal"
import cookie from "js-cookie"

export function Header() {
  const [showLogin, setShowLogin] = useState(false)
  const token = cookie.get("token")
  const [page, pageData] = useState([])
  useEffect(() =>{
    async function d(){
      const res = await fetch(`${import.meta.env.VITE_API_URL}/page`)
      const data = await res.json()
      pageData(data)
    }
    d()
  }, [])
  
  async function logout(){
    cookie.remove("token")
    window.location.href = "/"
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src={page?.HeroImage || "/picture/b68e1004-3524-4218-a5a3-2034f635c571.png"}
            alt="Roar Realty" 
            className="h-10 w-10 rounded-xl p-1"
            style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))' }}
          />
          <span className="text-xl font-bold bg-gradient-to-r from-luxury to-luxury-light bg-clip-text text-transparent">
            {page?.SiteName || "Roar Realty"}
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="/" className="text-foreground hover:text-luxury transition-colors">Home</a>
          <a href="/properties" className="text-foreground hover:text-luxury transition-colors">Properties</a>
          <a href="#about" className="text-foreground hover:text-luxury transition-colors">About</a>
          <a href="#contact" className="text-foreground hover:text-luxury transition-colors">Contact</a>
          <a href="/admin" className="text-foreground hover:text-luxury transition-colors">Admin</a>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {token ? <Button 
            onClick={() => logout()}
            className="bg-gradient-to-r from-luxury to-luxury-light text-white hover:from-luxury-dark hover:to-luxury font-semibold"
          >
            Logout
          </Button> : <Button 
            onClick={() => setShowLogin(true)}
            className="bg-gradient-to-r from-luxury to-luxury-light text-white hover:from-luxury-dark hover:to-luxury font-semibold"
          >
            Login
          </Button>}
        </div>
      </div>

      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </header>
  )
}
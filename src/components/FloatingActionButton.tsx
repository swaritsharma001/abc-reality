import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Plus, X, Instagram, Bot } from "lucide-react"
import { ChatModal } from "@/components/ChatModal"

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const handleWhatsApp = () => {
    // WhatsApp will be added later as requested
    window.open("https://wa.me/+971585005438", "_blank")
  }

  const handleInstagram = () => {
    window.open("https://www.instagram.com/roar.realty/", "_blank")
  }

  const handleAIChat = () => {
    setShowChat(true)
    setIsOpen(false)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Main FAB */}
        <div className="relative">
          {/* Action buttons */}
          {isOpen && (
            <div className="absolute bottom-16 right-0 flex flex-col space-y-3 animate-fade-in">
              {/* AI Assistant */}
              <Button
                size="icon"
                onClick={handleAIChat}
                className="h-12 w-12 rounded-full bg-gradient-to-r from-luxury to-luxury-light text-white hover:from-luxury-dark hover:to-luxury shadow-luxury"
              >
                <Bot className="h-5 w-5" />
              </Button>
              
              {/* WhatsApp */}
              <Button
                size="icon"
                onClick={handleWhatsApp}
                className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              
              {/* Instagram */}
              <Button
                size="icon"
                onClick={handleInstagram}
                className="h-12 w-12 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white shadow-lg"
              >
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          )}
          
          {/* Main toggle button */}
          <Button
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant transition-transform duration-200 hover:scale-110"
          >
            {isOpen ? (
              <X className="h-6 w-6 transition-transform duration-200" />
            ) : (
              <Plus className="h-6 w-6 transition-transform duration-200" />
            )}
          </Button>
        </div>
      </div>

      <ChatModal open={showChat} onOpenChange={setShowChat} />
    </>
  )
}
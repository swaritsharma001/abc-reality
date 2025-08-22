import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ChatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

export function ChatModal({ open, onOpenChange }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm **Sofia**, your AI assistant at Roar Realty. 🏠✨\n\nHow can I help you find your perfect luxury property in Dubai today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const formatPrice = (price: number | null | undefined): string => {
    if (price === null || price === undefined || isNaN(price)) {
      return "N/A"
    }
    return price.toLocaleString()
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat?msg=${encodeURIComponent(userMessage.text)}`)
      const data = await res.json()

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: data.reply,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Optional: show properties as separate messages
      if (data.properties && data.properties.length > 0) {
        data.properties.slice(0, 5).forEach((p) => {
          const minPrice = formatPrice(p.min_price)
          const maxPrice = formatPrice(p.max_price)
          
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: `🏡 **${p.name || 'Property'}** in ${p.area || 'Dubai'}\nDeveloper: ${p.developer || 'N/A'}\nPrice: AED ${minPrice} - AED ${maxPrice}\nStatus: ${p.status || 'Available'}`,
              sender: "ai",
              timestamp: new Date(),
            },
          ])
        })
      }
    } catch (err) {
      console.error("Error fetching AI response:", err)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "⚠️ Sorry, something went wrong. Please try again.",
          sender: "ai",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-luxury to-luxury-light flex items-center justify-center shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-semibold">Sofia</span>
              <p className="text-sm text-muted-foreground font-normal">AI Real Estate Assistant</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm shrink-0 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gradient-to-r from-luxury to-luxury-light text-white"
                    }`}
                  >
                    {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-xl text-sm max-w-[280px] prose prose-sm ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground prose-invert"
                        : "bg-muted text-foreground border border-border"
                    }`}
                  >
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-luxury to-luxury-light flex items-center justify-center shadow-sm shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-xl bg-muted text-foreground border border-border max-w-[280px]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex space-x-3 p-6 pt-4 border-t border-border bg-background">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about properties in Dubai..."
            className="flex-1 border-border focus:ring-luxury focus:border-luxury"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-gradient-to-r from-luxury to-luxury-light text-white hover:from-luxury-dark hover:to-luxury shadow-lg h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
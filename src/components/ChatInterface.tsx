import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Plus, Paperclip, Mic } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'll help you build that! Let me create a beautiful website for you.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-chat-background">
      {/* Chat Header */}
      <div className="p-4 border-b border-lovable-border">
        <h2 className="text-lovable-text-primary font-semibold">Chat</h2>
        <p className="text-lovable-text-secondary text-sm">Build something amazing</p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-lovable-gradient rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-2xl">❤️</span>
            </div>
            <h3 className="text-lovable-text-primary font-semibold mb-2">Start building</h3>
            <p className="text-lovable-text-secondary text-sm">
              Describe what you want to build and I'll help you create it
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-chat-message-user text-lovable-text-primary"
                      : "bg-chat-message-ai text-lovable-text-primary"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-lovable-text-secondary mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Chat Input */}
      <div className="p-4 border-t border-lovable-border">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-lovable-text-secondary hover:text-lovable-text-primary">
            <Plus className="h-4 w-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="create a lovable clone with a chat interface on the left hand side and then the website appears on the right hand side..."
              className="bg-chat-input border-lovable-border text-lovable-text-primary placeholder:text-lovable-text-secondary pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-lovable-text-secondary hover:text-lovable-text-primary">
                <Paperclip className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-lovable-text-secondary hover:text-lovable-text-primary">
                <Mic className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Button 
            onClick={handleSendMessage}
            size="icon" 
            className="bg-lovable-accent-orange hover:bg-lovable-accent-orange/80 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Example Buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-lovable-surface hover:bg-lovable-surface-hover text-lovable-text-secondary border border-lovable-border"
            onClick={() => setInputValue("💰 Expense tracker")}
          >
            💰 Expense tracker
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-lovable-surface hover:bg-lovable-surface-hover text-lovable-text-secondary border border-lovable-border"
            onClick={() => setInputValue("📊 Recharts dashboard")}
          >
            📊 Recharts dashboard
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-lovable-surface hover:bg-lovable-surface-hover text-lovable-text-secondary border border-lovable-border"
            onClick={() => setInputValue("📱 Social media dashboard")}
          >
            📱 Social media dashboard
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-lovable-surface hover:bg-lovable-surface-hover text-lovable-text-secondary border border-lovable-border"
            onClick={() => setInputValue("💪 Fitness tracker")}
          >
            💪 Fitness tracker
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Plus, Paperclip, Mic } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatInterfaceProps {
  onCodeGenerated: (code: string) => void;
  currentCode?: string;
}

const ChatInterface = ({ onCodeGenerated, currentCode = "" }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCodeWithAI = async (prompt: string, retryCount = 0) => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-code', {
        body: { 
          prompt: currentCode
            ? `You are a code transformer. Keep ALL existing code and only modify what's required. Always return the COMPLETE updated code in a single HTML document that includes <!DOCTYPE html>, <html>, <head>, and <body>.
\nUser request:\n${prompt}
\nCurrent code to build upon:\n${currentCode}`
            : `You are a code transformer. Always return a COMPLETE single HTML document that includes <!DOCTYPE html>, <html>, <head>, and <body>.
\nUser request:\n${prompt}`
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        return 'Error generating code. Please try again.';
      }

      let generatedCode = data.code || '';
      const isWebsiteClone = data.isWebsiteClone || false;
      
      // Validate HTML structure for website clones
      if (isWebsiteClone) {
        const hasDoctype = generatedCode.includes('<!DOCTYPE html>');
        const hasHtmlTag = generatedCode.includes('<html');
        const hasHeadTag = generatedCode.includes('<head>');
        const hasBodyTag = generatedCode.includes('<body>');
        
        if (!hasDoctype || !hasHtmlTag || !hasHeadTag || !hasBodyTag) {
          if (retryCount < 2) {
            console.log(`Incomplete HTML structure detected. Retrying... (${retryCount + 1}/3)`);
            return await generateCodeWithAI(prompt + " - MUST include complete HTML structure with DOCTYPE, html, head, and body tags", retryCount + 1);
          }
        }
      }
      
      // Update the preview with the generated code
      onCodeGenerated(generatedCode);
      
      // Return a friendly summary instead of the code
      if (currentCode) {
        return `✅ Updated your website! I've made the changes you requested. Check out the preview to see how it looks!`;
      } else if (isWebsiteClone) {
        return `🎉 Created your website clone! I've built a complete website based on your request. Take a look at the preview!`;
      } else {
        return `🚀 Built your website! I've created everything you asked for. The preview is ready for you to explore!`;
      }
    } catch (error) {
      console.error('Error generating code:', error);
      return 'Error generating code. Please try again.';
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = inputValue;
    setInputValue("");

    // Add processing message
    const processingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "🔄 Generating code...",
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, processingMessage]);

    // Generate code with AI
    const generatedCode = await generateCodeWithAI(currentInput);
    
    // Replace processing message with actual response
    setMessages(prev => prev.map(msg => 
      msg.id === processingMessage.id 
        ? { ...msg, content: generatedCode || "I'll help you build that! Let me create it for you." }
        : msg
    ));
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
      <div className="p-4 border-b border-lovable-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lovable-text-primary font-semibold">Chat</h2>
            <p className="text-lovable-text-secondary text-sm">Build something amazing</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-lovable-text-secondary hover:text-lovable-text-primary"
            onClick={() => { setMessages([]); onCodeGenerated(""); }}
          >
            <Plus className="h-4 w-4 mr-1" /> New Project
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-lovable-gradient rounded-full flex items-center justify-center mb-6">
              <span className="text-white text-3xl">🦙</span>
            </div>
            <h3 className="text-lovable-text-primary font-semibold mb-3 text-xl">Create your very own website</h3>
            <p className="text-lovable-text-secondary text-base mb-6 max-w-md">
              with just a few words
            </p>
            <Button
              onClick={() => {
                setMessages([]);
                onCodeGenerated("");
              }}
              variant="outline"
              size="sm"
              className="bg-lovable-surface hover:bg-lovable-surface-hover border-lovable-border text-lovable-text-secondary"
            >
              Start New Project
            </Button>
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
              placeholder="Create a website clone (e.g. Netflix, Apple, Google) or describe what you want to build..."
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
            disabled={isGenerating}
            className="bg-lovable-accent-orange hover:bg-lovable-accent-orange/80 text-white disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Example Buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-lovable-surface hover:bg-lovable-surface-hover text-lovable-text-secondary border border-lovable-border"
            onClick={(e) => {
              e.preventDefault();
              setInputValue("Create a Netflix website clone");
            }}
          >
            🎬 Netflix Clone
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-lovable-surface hover:bg-lovable-surface-hover text-lovable-text-secondary border border-lovable-border"
            onClick={(e) => {
              e.preventDefault();
              setInputValue("Create an Apple website clone");
            }}
          >
            🍎 Apple Clone
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-lovable-surface hover:bg-lovable-surface-hover text-lovable-text-secondary border border-lovable-border"
            onClick={(e) => {
              e.preventDefault();
              setInputValue("Create a Google homepage clone");
            }}
          >
            🔍 Google Clone
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-lovable-surface hover:bg-lovable-surface-hover text-lovable-text-secondary border border-lovable-border"
            onClick={(e) => {
              e.preventDefault();
              setInputValue("Create a modern portfolio website");
            }}
          >
            💼 Portfolio Site
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
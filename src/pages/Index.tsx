import { useState } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import PreviewArea from "@/components/PreviewArea";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { MessageSquare, Monitor } from "lucide-react";

const Index = () => {
  const [generatedCode, setGeneratedCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [mobileView, setMobileView] = useState<"chat" | "preview">("chat");
  const isMobile = useIsMobile();

  const handleCodeGenerated = (code: string) => {
    setGeneratedCode(code);
    // Auto-switch to preview on mobile when code is generated
    if (isMobile) {
      setMobileView("preview");
    }
  };

  const handleToggleView = () => {
    setShowCode(!showCode);
  };

  const handleMobileToggle = () => {
    setMobileView(mobileView === "chat" ? "preview" : "chat");
  };

  return (
    <div className="h-screen flex flex-col dark">
      <Header showCode={showCode} onToggleView={handleToggleView} />
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Toggle Button */}
        {isMobile && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20">
            <Button
              onClick={handleMobileToggle}
              variant="outline"
              size="sm"
              className="bg-background/95 backdrop-blur-sm border-border shadow-lg"
            >
              {mobileView === "chat" ? (
                <>
                  <Monitor className="h-4 w-4 mr-2" />
                  Preview
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </>
              )}
            </Button>
          </div>
        )}
        
        {/* Chat Interface */}
        <div className={`${
          isMobile 
            ? (mobileView === "chat" ? "w-full" : "hidden") 
            : "w-1/3 min-w-[400px]"
        } border-r border-lovable-border`}>
          <ChatInterface 
            onCodeGenerated={handleCodeGenerated} 
            currentCode={generatedCode}
          />
        </div>
        
        {/* Preview Area */}
        <div className={`${
          isMobile 
            ? (mobileView === "preview" ? "w-full" : "hidden") 
            : "flex-1"
        }`}>
          <PreviewArea 
            generatedCode={generatedCode} 
            showCode={showCode}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;

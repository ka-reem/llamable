import { useState } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import PreviewArea from "@/components/PreviewArea";
import ResizableLayout from "@/components/ResizableLayout";
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
      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          <>
            {/* Mobile Toggle Button */}
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
            
            {/* Mobile Views */}
            <div className={mobileView === "chat" ? "h-full" : "hidden"}>
              <ChatInterface 
                onCodeGenerated={handleCodeGenerated} 
                currentCode={generatedCode}
              />
            </div>
            
            <div className={mobileView === "preview" ? "h-full" : "hidden"}>
              <PreviewArea 
                generatedCode={generatedCode} 
                showCode={showCode}
              />
            </div>
          </>
        ) : (
          /* Desktop Resizable Layout */
          <ResizableLayout
            leftPanel={
              <ChatInterface 
                onCodeGenerated={handleCodeGenerated} 
                currentCode={generatedCode}
              />
            }
            rightPanel={
              <PreviewArea 
                generatedCode={generatedCode} 
                showCode={showCode}
              />
            }
            defaultLeftWidth={400}
            minLeftWidth={300}
            maxLeftWidth={800}
          />
        )}
      </div>
    </div>
  );
};

export default Index;

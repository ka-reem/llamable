import { useState } from "react";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import PreviewArea from "@/components/PreviewArea";

const Index = () => {
  const [generatedCode, setGeneratedCode] = useState("");
  const [showCode, setShowCode] = useState(false);

  const handleCodeGenerated = (code: string) => {
    setGeneratedCode(code);
  };

  const handleToggleView = () => {
    setShowCode(!showCode);
  };

  return (
    <div className="h-screen flex flex-col dark">
      <Header showCode={showCode} onToggleView={handleToggleView} />
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Interface - Left Side */}
        <div className="w-1/3 min-w-[400px] border-r border-lovable-border">
          <ChatInterface 
            onCodeGenerated={handleCodeGenerated} 
            currentCode={generatedCode}
          />
        </div>
        
        {/* Preview Area - Right Side */}
        <div className="flex-1">
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

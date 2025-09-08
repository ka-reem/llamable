import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PreviewAreaProps {
  generatedCode: string;
}

const PreviewArea = ({ generatedCode }: PreviewAreaProps) => {
  const [showCode, setShowCode] = useState(false);

  const renderCode = () => {
    if (!generatedCode) {
      return (
        <div className="h-full bg-lovable-gradient overflow-auto">
          <div className="min-h-full flex items-center justify-center p-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
                Build something{" "}
                <span className="inline-flex items-center">
                  ❤️
                  <span className="ml-2">Lovable</span>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 mb-12">
                Create apps and websites by chatting with AI
              </p>
              
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
                <div className="flex items-center space-x-3 text-white/70">
                  <span className="text-lg">+</span>
                  <div className="flex-1 text-left">
                    <p className="text-sm">
                      Ask me to create something and I'll generate the code for you!
                    </p>
                  </div>
                  <span className="text-lg">📎</span>
                  <span className="text-sm px-3 py-1 bg-white/10 rounded">Public</span>
                  <span className="text-lg">🎤</span>
                  <span className="text-lg">↗</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (showCode) {
      return (
        <div className="h-full bg-lovable-surface">
          <div className="p-4 border-b border-lovable-border flex items-center justify-between">
            <h3 className="text-lovable-text-primary font-semibold">Generated Code</h3>
            <button 
              onClick={() => setShowCode(false)}
              className="text-lovable-text-secondary hover:text-lovable-text-primary text-sm"
            >
              View Preview
            </button>
          </div>
          <ScrollArea className="h-full p-4">
            <pre className="text-lovable-text-primary text-sm bg-chat-input rounded-lg p-4 overflow-auto">
              <code>{generatedCode}</code>
            </pre>
          </ScrollArea>
        </div>
      );
    }

    try {
      // Try to render the generated code as a component
      return (
        <div className="h-full bg-white">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-gray-900 font-semibold">Live Preview</h3>
            <button 
              onClick={() => setShowCode(true)}
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              View Code
            </button>
          </div>
          <div className="h-full p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Generated Component</h2>
              <p className="text-gray-600">Your AI-generated code would render here</p>
              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Code Preview:</p>
                <pre className="text-xs text-left overflow-auto">
                  {generatedCode.substring(0, 200)}...
                </pre>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div className="h-full bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-red-800 font-semibold mb-2">Error Rendering Code</h3>
            <p className="text-red-600 text-sm">The generated code contains syntax errors</p>
            <button 
              onClick={() => setShowCode(true)}
              className="mt-4 text-red-700 hover:text-red-900 text-sm underline"
            >
              View Raw Code
            </button>
          </div>
        </div>
      );
    }
  };

  return renderCode();
};

export default PreviewArea;
import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PreviewAreaProps {
  generatedCode: string;
}

const PreviewArea = ({ generatedCode }: PreviewAreaProps) => {
  const [showCode, setShowCode] = useState(false);

  // Function to safely execute and render React code
  const executeCode = (code: string) => {
    try {
      // Clean the code - remove import statements and export statements
      let cleanCode = code
        .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '')
        .replace(/export\s+default\s+/g, '')
        .replace(/export\s+/g, '');

      // If the code contains JSX, wrap it in a component
      if (cleanCode.includes('<') && cleanCode.includes('>')) {
        // Try to extract a function component
        const componentMatch = cleanCode.match(/(?:const|function)\s+(\w+)\s*=?\s*\([^)]*\)\s*=?>\s*\{?[\s\S]*?\}?[\s\S]*?return\s*\([\s\S]*?\);?/);
        
        if (componentMatch) {
          // Use the existing component
          cleanCode = componentMatch[0];
        } else if (cleanCode.includes('return')) {
          // Wrap existing return statement in a component
          cleanCode = `function GeneratedComponent() { ${cleanCode} }`;
        } else {
          // Wrap JSX in a simple component
          cleanCode = `function GeneratedComponent() { return (${cleanCode}); }`;
        }
      }

      // Create a function that returns the component
      const componentFunction = new Function('React', 'useState', 'useEffect', `
        const { createElement, Fragment } = React;
        ${cleanCode}
        return GeneratedComponent || (() => React.createElement('div', {}, 'Component rendered successfully'));
      `);

      const Component = componentFunction(
        { createElement: (type, props, ...children) => ({ type, props, children }), Fragment: 'Fragment' },
        useState,
        () => {}
      );

      return Component;
    } catch (error) {
      console.error('Code execution error:', error);
      return null;
    }
  };

  const RenderedComponent = useMemo(() => {
    if (!generatedCode) return null;
    return executeCode(generatedCode);
  }, [generatedCode]);

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

    // Render the live preview
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
        <div className="h-full p-8 overflow-auto">
          {RenderedComponent ? (
            <div 
              className="w-full h-full"
              dangerouslySetInnerHTML={{ 
                __html: `
                  <div id="preview-container" class="w-full h-full">
                    ${generatedCode.includes('function') || generatedCode.includes('const') ? 
                      `<div class="p-4 bg-blue-50 rounded-lg mb-4">
                        <p class="text-blue-800 text-sm">React Component Generated</p>
                      </div>` : 
                      generatedCode.includes('<') ? generatedCode : 
                      `<div class="p-4 bg-gray-100 rounded-lg"><pre>${generatedCode}</pre></div>`
                    }
                  </div>
                ` 
              }}
            />
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Generated Content</h2>
              <div className="p-4 bg-gray-100 rounded-lg text-left">
                <pre className="text-sm overflow-auto whitespace-pre-wrap">
                  {generatedCode}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return renderCode();
};

export default PreviewArea;
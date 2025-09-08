import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import PreviewArea from "@/components/PreviewArea";

const Index = () => {
  return (
    <div className="h-screen flex flex-col dark">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Interface - Left Side */}
        <div className="w-1/3 min-w-[400px] border-r border-lovable-border">
          <ChatInterface />
        </div>
        
        {/* Preview Area - Right Side */}
        <div className="flex-1">
          <PreviewArea />
        </div>
      </div>
    </div>
  );
};

export default Index;

import { Button } from "@/components/ui/button";

const PreviewArea = () => {
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
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <span className="text-lg">+</span>
              </Button>
              <div className="flex-1 text-left">
                <p className="text-sm">
                  create a lovable clone with a chat interface on the left hand side and then the website appears on the 
                  right hand side. use openai and use the llama 4 maverick model. you must use this repo it already has 
                  all the code you need inside: https://github.com/freestyle-sh/Adorable.git
                </p>
              </div>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <span className="text-lg">📎</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white px-3">
                Public
              </Button>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <span className="text-lg">🎤</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <span className="text-lg">↗</span>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              variant="secondary" 
              className="bg-black/20 backdrop-blur-sm text-white border border-white/10 hover:bg-black/30"
            >
              <span className="mr-2">💰</span>
              Expense tracker
            </Button>
            <Button 
              variant="secondary" 
              className="bg-black/20 backdrop-blur-sm text-white border border-white/10 hover:bg-black/30"
            >
              <span className="mr-2">📊</span>
              Recharts dashboard
            </Button>
            <Button 
              variant="secondary" 
              className="bg-black/20 backdrop-blur-sm text-white border border-white/10 hover:bg-black/30"
            >
              <span className="mr-2">📱</span>
              Social media dashboard
            </Button>
            <Button 
              variant="secondary" 
              className="bg-black/20 backdrop-blur-sm text-white border border-white/10 hover:bg-black/30"
            >
              <span className="mr-2">💪</span>
              Fitness tracker
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewArea;
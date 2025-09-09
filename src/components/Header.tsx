import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-lovable-surface border-b border-lovable-border">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-lovable-gradient rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">❤️</span>
          </div>
          <span className="text-lovable-text-primary font-semibold text-lg">Llamable</span>
        </div>
        
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-lovable-accent-orange rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-lovable-text-primary text-sm">kareem's Llamable</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
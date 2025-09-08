import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-lovable-surface border-b border-lovable-border">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-lovable-gradient rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">❤️</span>
          </div>
          <span className="text-lovable-text-primary font-semibold text-lg">Lovable</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-lovable-text-secondary hover:text-lovable-text-primary transition-colors">
            Community
          </a>
          <a href="#" className="text-lovable-text-secondary hover:text-lovable-text-primary transition-colors">
            Pricing
          </a>
          <a href="#" className="text-lovable-text-secondary hover:text-lovable-text-primary transition-colors">
            Enterprise
          </a>
          <a href="#" className="text-lovable-text-secondary hover:text-lovable-text-primary transition-colors">
            Learn
          </a>
          <a href="#" className="text-lovable-text-secondary hover:text-lovable-text-primary transition-colors">
            Launched
          </a>
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="text-lovable-text-secondary hover:text-lovable-text-primary">
          🎁
        </Button>
        <Button variant="ghost" size="sm" className="text-lovable-text-secondary hover:text-lovable-text-primary">
          ✏️
        </Button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-lovable-accent-orange rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-lovable-text-primary text-sm">kareem's Lovable</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
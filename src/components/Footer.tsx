import React from 'react';
import { PageTab } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: PageTab, sectionId?: string) => void;
  onOpenKeymap: () => void;
  onScrollToInstall?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenKeymap, onScrollToInstall }) => {
  const handleInstallClick = () => {
    if (onScrollToInstall) {
      onScrollToInstall();
    } else {
      onNavigate('home', 'install');
    }
  };

  return (
    <footer className="w-full border-t border-hairline-outline bg-canvas-obsidian py-8 sm:py-10 px-6 md:px-12 font-mono text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <button 
            onClick={() => onNavigate('home')}
            className="text-base sm:text-lg text-secondary font-bold cursor-pointer hover:opacity-90 tracking-tight"
          >
            &gt; gtm
          </button>
          <span className="text-text-muted text-xs font-sans">
            Built with Rust. Licensed under GPL-3.0. © 2026 gtm team.
          </span>
        </div>
        
        {/* Footer links: Docs, GitHub, Keymap, Install */}
        <nav className="flex flex-wrap justify-center items-center gap-5 sm:gap-6 text-xs text-text-muted">
          <button 
            onClick={() => onNavigate('docs')} 
            className="hover:text-text-primary transition-colors cursor-pointer"
          >
            Docs
          </button>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-text-primary transition-colors flex items-center gap-1"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 text-text-disabled" />
          </a>
          <button 
            onClick={onOpenKeymap} 
            className="hover:text-text-primary transition-colors cursor-pointer"
          >
            Keymap
          </button>
          <button 
            onClick={handleInstallClick} 
            className="hover:text-secondary transition-colors cursor-pointer font-bold text-secondary"
          >
            Install
          </button>
        </nav>
      </div>
    </footer>
  );
};

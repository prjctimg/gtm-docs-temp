import React, { useState, useEffect } from 'react';
import { PageTab, BlogPost } from './types';
import { BLOG_POSTS } from './data/mockData';
import { TopNav } from './components/TopNav';
import { DocsView } from './components/DocsView';
import { BlogView } from './components/BlogView';
import { LandingView } from './components/LandingView';
import { InstallView } from './components/InstallView';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { WhitepaperModal } from './components/WhitepaperModal';
import { KeymapModal } from './components/KeymapModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageTab>('home');
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isKeymapOpen, setIsKeymapOpen] = useState(false);
  const [selectedWhitepaper, setSelectedWhitepaper] = useState<BlogPost | null>(null);

  // Global key listener for '/' and 'Ctrl+K'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) && 
          !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tab: PageTab, sectionId?: string) => {
    setCurrentTab(tab);
    if (sectionId) {
      setActiveSection(sectionId);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenWhitepaperById = (postId: string) => {
    const post = BLOG_POSTS.find(p => p.id === postId) || BLOG_POSTS[0];
    setSelectedWhitepaper(post);
  };

  const handleScrollToInstall = () => {
    handleNavigate('install');
  };

  return (
    <div className="min-h-screen bg-canvas-obsidian text-text-primary flex flex-col font-sans selection:bg-secondary/30 selection:text-secondary">
      {/* Top Navigation */}
      <TopNav
        currentTab={currentTab}
        onSelectTab={(tab) => handleNavigate(tab)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenKeymap={() => setIsKeymapOpen(true)}
        onScrollToInstall={handleScrollToInstall}
      />

      {/* Dynamic View Body */}
      <div className="flex-grow flex flex-col">
        {currentTab === 'docs' && (
          <DocsView
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenKeymap={() => setIsKeymapOpen(true)}
            activeSection={activeSection}
          />
        )}

        {currentTab === 'install' && (
          <InstallView
            onNavigateToDocs={(sectionId) => handleNavigate('docs', sectionId)}
          />
        )}

        {currentTab === 'blog' && (
          <BlogView
            onOpenWhitepaper={(post) => setSelectedWhitepaper(post)}
            onNavigateToDocs={(sectionId) => handleNavigate('docs', sectionId)}
          />
        )}

        {currentTab === 'home' && (
          <LandingView
            onNavigate={handleNavigate}
            onOpenKeymap={() => setIsKeymapOpen(true)}
          />
        )}
      </div>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenKeymap={() => setIsKeymapOpen(true)}
        onScrollToInstall={handleScrollToInstall}
      />

      {/* Global Interactive Modals */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        onOpenWhitepaper={handleOpenWhitepaperById}
      />

      <WhitepaperModal
        post={selectedWhitepaper}
        onClose={() => setSelectedWhitepaper(null)}
        onNavigateToDocs={(sectionId) => handleNavigate('docs', sectionId)}
      />

      <KeymapModal
        isOpen={isKeymapOpen}
        onClose={() => setIsKeymapOpen(false)}
      />
    </div>
  );
}

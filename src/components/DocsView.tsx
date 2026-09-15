import React, { useState } from 'react';
import { PACKAGE_COMMANDS, BENCHMARKS, KEYBINDINGS, TOML_CONFIG_CODE } from '../data/mockData';
import { 
  Search, 
  Check, 
  Copy, 
  Edit, 
  Sliders, 
  Layers, 
  Keyboard, 
  ArrowRight, 
  ArrowLeft,
  Terminal,
  Cpu,
  Zap,
  ShieldCheck,
  Disc3
} from 'lucide-react';

interface DocsViewProps {
  onOpenSearch: () => void;
  onOpenKeymap: () => void;
  activeSection?: string;
}

type PkgType = 'curl' | 'cargo' | 'brew' | 'aur' | 'nix';

export const DocsView: React.FC<DocsViewProps> = ({
  onOpenSearch,
  onOpenKeymap,
  activeSection = 'overview'
}) => {
  const [selectedPkg, setSelectedPkg] = useState<PkgType>('curl');
  const [bannerPkg, setBannerPkg] = useState<'curl' | 'cargo' | 'brew'>('curl');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<string>(activeSection);

  const bannerCommands = {
    curl: 'curl -fsSL https://getgtm.dev/install.sh | sh',
    cargo: 'cargo install gtm --locked',
    brew: 'brew install gtm'
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const scrollToSection = (id: string) => {
    setCurrentSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const SECTIONS = [
    { id: 'overview', title: 'Overview' },
    { id: 'install', title: 'Installation' },
    { id: 'architecture', title: 'Architecture' },
    { id: 'config', title: 'Configuration' },
    { id: 'benchmarks', title: 'Benchmarks' },
    { id: 'keybindings', title: 'Keybindings' },
  ];

  return (
    <div className="w-full flex flex-col font-sans">
      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto flex w-full">
        {/* LEFT SIDEBAR: Navigation Tree (Desktop) */}
        <aside className="w-64 shrink-0 border-r border-hairline-outline bg-canvas-obsidian min-h-[calc(100vh-60px)] p-4 hidden lg:block sticky top-14 self-start max-h-[calc(100vh-56px)] overflow-y-auto font-mono text-xs">
          {/* Search Bar */}
          <div className="relative mb-6">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between pl-8 pr-3 py-1.5 bg-code-canvas border border-hairline-outline hover:border-primary-container rounded text-text-muted text-xs transition-colors cursor-pointer text-left"
            >
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-text-muted" />
              <span>Search docs...</span>
              <kbd className="px-1.5 py-0.5 bg-surface-elevated border border-hairline-outline rounded text-[10px] text-text-muted">
                /
              </kbd>
            </button>
          </div>

          {/* Navigation Tree Groups */}
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-bold text-text-muted tracking-wider mb-2 uppercase flex items-center gap-2">
                <Layers className="w-3 h-3 text-secondary" />
                <span>Documentation</span>
              </div>
              <ul className="space-y-1 border-l border-hairline-subtle ml-2 pl-3">
                {SECTIONS.map((sec) => (
                  <li key={sec.id}>
                    <button
                      onClick={() => scrollToSection(sec.id)}
                      className={`block w-full text-left py-1 text-xs cursor-pointer transition-colors ${
                        currentSection === sec.id
                          ? 'text-primary-container font-bold border-l-2 -ml-[13px] pl-2.5 border-primary-container'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {sec.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[11px] font-bold text-text-muted tracking-wider mb-2 uppercase flex items-center gap-2">
                <Keyboard className="w-3 h-3 text-state-warning" />
                <span>Quick Tools</span>
              </div>
              <ul className="space-y-1 border-l border-hairline-subtle ml-2 pl-3">
                <li>
                  <button
                    onClick={onOpenKeymap}
                    className="block w-full text-left py-1 text-secondary hover:text-primary text-xs cursor-pointer"
                  >
                    Keybindings Cheatsheet →
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenSearch}
                    className="block w-full text-left py-1 text-text-muted hover:text-text-primary text-xs cursor-pointer"
                  >
                    Quick Search (/)
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* CENTER CANVAS: Main Documentation Article */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 max-w-4xl mx-auto space-y-12">
          {/* Mobile TOC Selector */}
          <div className="lg:hidden space-y-1.5 pb-4 border-b border-hairline-outline">
            <label htmlFor="mobile-docs-toc" className="font-mono text-[11px] font-bold text-secondary uppercase tracking-wider block">
              Jump to Section
            </label>
            <select
              id="mobile-docs-toc"
              value={currentSection}
              onChange={(e) => scrollToSection(e.target.value)}
              className="w-full bg-surface-container border border-hairline-outline text-text-primary font-mono text-xs rounded px-3 py-2 focus:outline-none focus:border-primary-container cursor-pointer"
            >
              {SECTIONS.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.title}
                </option>
              ))}
            </select>
          </div>

          {/* Document Header */}
          <div className="border-b border-hairline-outline pb-6">
            <h1 className="font-mono text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-2">
              Documentation
            </h1>
            <p className="text-sm sm:text-base text-text-muted max-w-2xl leading-relaxed font-sans">
              High-fidelity audio playback, local library indexing, and gapless decoding directly inside your terminal — engineered with zero-cost abstractions in Rust.
            </p>
          </div>

          {/* Section: Overview */}
          <section id="overview" className="space-y-5 scroll-mt-20">
            <div className="border-b border-hairline-outline pb-2">
              <h2 className="text-lg font-bold text-text-primary font-mono">
                Overview
              </h2>
            </div>
            
            <p className="text-sm text-text-body leading-relaxed">
              <code className="font-mono px-1.5 py-0.5 rounded bg-surface-elevated text-secondary border border-hairline-outline text-xs">
                gtm
              </code>{' '}
              is a lightweight, terminal-native music player engineered for speed, acoustic transparency, and keyboard-driven workflows. Unlike desktop audio players built on top of web runtimes, gtm connects directly to hardware audio pipelines through lock-free ring buffers.
            </p>

            {/* Architecture Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-lg bg-surface-container border border-hairline-outline space-y-1.5">
                <div className="flex items-center gap-2 text-secondary font-mono text-xs font-semibold">
                  <Disc3 className="w-4 h-4" />
                  <span>Pure Rust Decoder Pipeline</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Leverages Symphonia for bit-perfect decoding of FLAC, ALAC, Opus, MP3, and WAV without external C library dependencies.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-surface-container border border-hairline-outline space-y-1.5">
                <div className="flex items-center gap-2 text-secondary font-mono text-xs font-semibold">
                  <Zap className="w-4 h-4" />
                  <span>Lock-Free Audio Ring Buffer</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Dual-engine pre-buffering ensures zero boundary drift (±0 samples) and prevents audio dropouts during heavy terminal resizing.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-surface-container border border-hairline-outline space-y-1.5">
                <div className="flex items-center gap-2 text-secondary font-mono text-xs font-semibold">
                  <Cpu className="w-4 h-4" />
                  <span>Lightweight Resource Footprint</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Consistently consumes under 15 MB of resident memory (RSS) even when caching indexed libraries exceeding 40,000 tracks.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-surface-container border border-hairline-outline space-y-1.5">
                <div className="flex items-center gap-2 text-secondary font-mono text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Native Linux &amp; macOS Sinks</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Direct hardware output via PipeWire, ALSA, PulseAudio, or macOS CoreAudio with 192kHz/24-bit passthrough support.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Installation */}
          <section id="install" className="space-y-4 scroll-mt-20">
            <div className="border-b border-hairline-outline pb-2">
              <h2 className="text-lg font-bold text-text-primary font-mono">
                Installation
              </h2>
            </div>
            
            <p className="text-sm text-text-body">
              Select your package manager. Pre-built release binaries are signed and available for all major Linux distributions and macOS.
            </p>

            {/* Package Tabs */}
            <div className="flex items-center gap-1.5 border-b border-hairline-outline pb-2 font-mono text-xs overflow-x-auto">
              {(['curl', 'cargo', 'brew', 'aur', 'nix'] as PkgType[]).map((pkg) => (
                <button
                  key={pkg}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer text-xs ${
                    selectedPkg === pkg
                      ? 'bg-surface-elevated text-secondary border border-hairline-outline font-bold'
                      : 'text-text-muted hover:text-text-primary border border-transparent'
                  }`}
                >
                  {pkg === 'curl' ? 'curl (default)' : pkg}
                </button>
              ))}
            </div>

            {/* Command Box */}
            <div className="bg-code-canvas border border-hairline-outline rounded-lg overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between px-3.5 py-2 bg-surface-container border-b border-hairline-outline">
                <span className="text-text-muted text-[11px]">Command</span>
                <button
                  onClick={() => handleCopy(PACKAGE_COMMANDS[selectedPkg], 'pkg-docs')}
                  className="flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer text-[11px]"
                >
                  {copiedSection === 'pkg-docs' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-state-success" />
                      <span className="text-state-success">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 flex items-center gap-2 select-all overflow-x-auto">
                <span className="text-secondary font-bold select-none">$</span>
                <span className="text-text-primary">{PACKAGE_COMMANDS[selectedPkg]}</span>
              </div>
            </div>

            {/* Verification Tip */}
            <div className="p-3 bg-surface-container-low border border-hairline-outline rounded-lg font-mono text-xs text-text-muted space-y-1">
              <div className="text-text-primary font-semibold">Verification:</div>
              <div>Run <code className="text-secondary">gtm --check-audio</code> to test output driver initialization and codec handshakes.</div>
            </div>
          </section>

          {/* Section: Architecture */}
          <section id="architecture" className="space-y-4 scroll-mt-20">
            <div className="border-b border-hairline-outline pb-2">
              <h2 className="text-lg font-bold text-text-primary font-mono">
                Architecture
              </h2>
            </div>
            
            <p className="text-sm text-text-body leading-relaxed">
              Audio decoding runs isolated on atomic worker threads, communicating with the Ratatui render loop via lock-free channels. This guarantees that UI operations never cause audio buffer starvation.
            </p>

            {/* Responsive Pipeline Diagram */}
            <div className="p-4 sm:p-6 bg-surface-container border border-hairline-outline rounded-lg space-y-4 font-mono text-xs">
              <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Thread Topology &amp; Audio Pipeline
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-code-canvas border border-hairline-outline rounded space-y-1">
                  <div className="text-secondary font-bold">1. Terminal UI</div>
                  <div className="text-[11px] text-text-muted">Ratatui 60 FPS loop</div>
                  <div className="text-[11px] text-text-muted">Non-blocking keyboard I/O</div>
                </div>

                <div className="p-3 bg-code-canvas border border-hairline-outline rounded space-y-1">
                  <div className="text-primary-container font-bold">2. Playback Engine</div>
                  <div className="text-[11px] text-text-muted">Symphonia decoding</div>
                  <div className="text-[11px] text-text-muted">Lookahead track buffer</div>
                </div>

                <div className="p-3 bg-code-canvas border border-hairline-outline rounded space-y-1">
                  <div className="text-state-success font-bold">3. Hardware Sink</div>
                  <div className="text-[11px] text-text-muted">Lock-free ringbuffer</div>
                  <div className="text-[11px] text-text-muted">PipeWire / CoreAudio sink</div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-text-muted border-t border-hairline-subtle flex flex-wrap items-center justify-between gap-2">
                <span>Inter-thread IPC: crossbeam SPSC</span>
                <span>Buffer swap latency: &lt; 20µs</span>
              </div>
            </div>
          </section>

          {/* Section: Configuration */}
          <section id="config" className="space-y-4 scroll-mt-20">
            <div className="flex items-center justify-between border-b border-hairline-outline pb-2">
              <h2 className="text-lg font-bold text-text-primary font-mono">
                Configuration
              </h2>
              <span className="font-mono text-xs text-text-muted bg-surface-elevated px-2 py-0.5 rounded border border-hairline-outline">
                ~/.config/gtm/config.toml
              </span>
            </div>

            <p className="text-sm text-text-body">
              Configuration is stored in standard TOML format. The player hot-reloads configuration changes automatically without interrupting active playback.
            </p>

            <div className="bg-code-canvas border border-hairline-outline rounded-lg overflow-hidden font-mono text-xs">
              <div className="flex justify-between items-center px-3.5 py-2 bg-surface-container border-b border-hairline-outline text-[11px] text-text-muted">
                <span>config.toml</span>
                <button
                  onClick={() => handleCopy(TOML_CONFIG_CODE, 'toml-copy')}
                  className="flex items-center gap-1 hover:text-text-primary transition-colors cursor-pointer"
                >
                  {copiedSection === 'toml-copy' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-state-success" />
                      <span className="text-state-success">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy TOML</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 text-text-body leading-relaxed overflow-x-auto text-[12px]">
                {TOML_CONFIG_CODE}
              </pre>
            </div>
          </section>

          {/* Section: Benchmarks */}
          <section id="benchmarks" className="space-y-4 scroll-mt-20">
            <div className="border-b border-hairline-outline pb-2">
              <h2 className="text-lg font-bold text-text-primary font-mono">
                Benchmarks
              </h2>
            </div>

            <p className="text-sm text-text-body">
              Independent measurements recorded on Linux 6.8 (x86_64) during continuous 96kHz/24-bit FLAC playback over 12 hours.
            </p>

            <div className="border border-hairline-outline bg-surface-container rounded-lg overflow-x-auto">
              <table className="w-full min-w-[500px] text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-hairline-outline bg-surface-elevated text-text-muted uppercase text-[11px]">
                    <th className="py-2.5 px-3">Player</th>
                    <th className="py-2.5 px-3">Resident Memory (RSS)</th>
                    <th className="py-2.5 px-3">Startup Cold</th>
                    <th className="py-2.5 px-3">Gapless Accuracy</th>
                    <th className="py-2.5 px-3 text-right">CPU</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline-subtle text-text-body">
                  {BENCHMARKS.map((row, idx) => (
                    <tr 
                      key={idx} 
                      className={row.isHero ? "bg-surface-elevated/50 font-bold text-text-primary" : "hover:bg-surface-elevated/20 transition-colors"}
                    >
                      <td className="py-2.5 px-3 flex items-center gap-2">
                        {row.isHero && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
                        <span className={row.isHero ? "text-secondary" : ""}>{row.player}</span>
                      </td>
                      <td className="py-2.5 px-3">{row.rss}</td>
                      <td className="py-2.5 px-3">{row.coldBoot}</td>
                      <td className="py-2.5 px-3">{row.accuracy}</td>
                      <td className="py-2.5 px-3 text-right">{row.cpu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Keybindings */}
          <section id="keybindings" className="space-y-4 scroll-mt-20">
            <div className="flex items-center justify-between border-b border-hairline-outline pb-2">
              <h2 className="text-lg font-bold text-text-primary font-mono">
                Keybindings
              </h2>
              <button
                onClick={onOpenKeymap}
                className="font-mono text-xs text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                Cheatsheet Modal →
              </button>
            </div>

            <p className="text-sm text-text-body">
              Default keyboard shortcuts for player control and library navigation. All shortcuts can be remapped in <code className="font-mono text-xs text-secondary">config.toml</code>.
            </p>

            <div className="border border-hairline-outline bg-surface-container rounded-lg overflow-hidden">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-hairline-outline bg-surface-elevated text-text-muted uppercase text-[11px]">
                    <th className="py-2 px-3">Key</th>
                    <th className="py-2 px-3">Action</th>
                    <th className="py-2 px-3 text-right">Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline-subtle text-text-body">
                  {KEYBINDINGS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-surface-elevated/20 transition-colors">
                      <td className="py-2 px-3 font-semibold text-secondary">
                        <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated border border-hairline-outline text-xs">
                          {item.key}
                        </kbd>
                      </td>
                      <td className="py-2 px-3 text-text-primary">{item.action}</td>
                      <td className="py-2 px-3 text-right text-text-muted">{item.scope}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section Navigation Footer */}
          <div className="border-t border-hairline-outline pt-6 flex items-center justify-between gap-4 font-mono text-xs">
            <button
              onClick={() => scrollToSection('overview')}
              className="text-secondary hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
            </button>
            <button
              onClick={onOpenKeymap}
              className="text-secondary hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              Open Cheatsheet <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </main>

        {/* RIGHT SIDEBAR: On This Page TOC (Desktop) */}
        <aside className="w-56 shrink-0 border-l border-hairline-outline bg-canvas-obsidian p-6 hidden xl:block sticky top-14 self-start max-h-[calc(100vh-56px)] overflow-y-auto font-mono text-xs">
          <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">
            On this page
          </div>
          <ul className="space-y-2 border-l border-hairline-outline pl-3">
            {SECTIONS.map((sec) => (
              <li key={sec.id}>
                <button
                  onClick={() => scrollToSection(sec.id)}
                  className={`block text-left transition-colors cursor-pointer text-xs ${
                    currentSection === sec.id
                      ? 'text-primary-container font-semibold'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {sec.title}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-hairline-outline space-y-3">
            <a
              href="https://github.com/prjctimg/gtm.rs"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-xs"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit on GitHub</span>
            </a>
          </div>
        </aside>
      </div>

      {/* Persistent Install Footer */}
      <section id="install-cta" className="w-full bg-surface-container-low border-t border-hairline-outline px-6 py-10 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-mono font-bold tracking-tight text-text-primary mb-1">
              Ready to start listening?
            </h3>
            <p className="text-xs sm:text-sm text-text-muted font-mono">
              Lightweight binary, zero runtime overhead, bit-perfect gapless audio in your terminal.
            </p>
          </div>

          <div className="flex items-stretch bg-code-canvas border border-hairline-outline rounded-md overflow-hidden shrink-0">
            <div className="px-4 py-2.5 font-mono text-xs text-text-primary flex items-center gap-2 select-all">
              <span className="text-secondary font-bold select-none">$</span>
              <span>{bannerCommands.curl}</span>
            </div>
            <button
              onClick={() => handleCopy(bannerCommands.curl, 'banner-install')}
              className="px-3.5 py-2.5 bg-primary-container hover:opacity-90 text-canvas-obsidian font-mono text-xs font-bold transition-opacity flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copiedSection === 'banner-install' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  Terminal, 
  Download, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  AlertCircle, 
  ExternalLink,
  Package,
  Laptop
} from 'lucide-react';

interface InstallViewProps {
  onNavigateToDocs?: (sectionId?: string) => void;
}

type InstallCategory = 'curl' | 'cargo' | 'brew' | 'aur' | 'nix' | 'deb' | 'rpm' | 'binary';

interface MethodInfo {
  id: InstallCategory;
  name: string;
  badge: string;
  os: string;
  command: string;
  description: string;
  notes?: string;
}

const INSTALL_METHODS: MethodInfo[] = [
  {
    id: 'curl',
    name: 'Standalone Script',
    badge: 'Recommended',
    os: 'Linux & macOS',
    command: 'curl -fsSL https://getgtm.dev/install.sh | sh',
    description: 'POSIX shell script that automatically detects your OS, CPU architecture, and libc (glibc/musl), downloads the verified release binary, and installs it into ~/.local/bin.',
    notes: 'Requires curl and tar. Verifies cryptographic Minisign signatures prior to unpacking.'
  },
  {
    id: 'cargo',
    name: 'Cargo / Crates.io',
    badge: 'From Source',
    os: 'All Platforms',
    command: 'cargo install gtm --locked --features pipewire,mpris',
    description: 'Compiles gtm directly with your local Rust toolchain using locked dependencies and hardware audio engine optimizations.',
    notes: 'Requires Rust 1.78+ and local audio development headers (alsa-lib, libclang).'
  },
  {
    id: 'brew',
    name: 'Homebrew',
    badge: 'macOS & Linux',
    os: 'macOS & Linux',
    command: 'brew tap gtm-player/tap && brew install gtm',
    description: 'Official Homebrew formula supporting both Apple Silicon (M1/M2/M3/M4) and Intel architectures with CoreAudio sink support out of the box.',
    notes: 'Updates automatically with brew upgrade gtm.'
  },
  {
    id: 'aur',
    name: 'Arch Linux (AUR)',
    badge: 'Binary & Source',
    os: 'Arch Linux / Manjaro',
    command: 'paru -S gtm-bin',
    description: 'Arch User Repository package. Choose gtm-bin for instant pre-compiled binaries or gtm to compile with native CPU instruction extensions (-C target-cpu=native).',
    notes: 'Alternative: yay -S gtm-bin'
  },
  {
    id: 'nix',
    name: 'Nix / NixOS',
    badge: 'Declarative',
    os: 'NixOS & nix-darwin',
    command: 'nix-env -iA nixpkgs.gtm',
    description: 'Pure, reproducible derivation with all audio backends, ALSA plugins, and MPRIS dependencies hermetically linked.',
    notes: 'For Nix Flakes: nix profile install github:gtm-player/gtm'
  },
  {
    id: 'deb',
    name: 'Debian / Ubuntu (.deb)',
    badge: 'APT / Dpkg',
    os: 'Debian 12+, Ubuntu 22.04+',
    command: 'curl -LO https://github.com/gtm-player/gtm/releases/latest/download/gtm_amd64.deb && sudo dpkg -i gtm_amd64.deb',
    description: 'Official Debian binary package configured with systemd user service and Desktop Entry files for notification integrations.',
    notes: 'Requires pipewire-audio-client-libraries or libasound2.'
  },
  {
    id: 'rpm',
    name: 'Fedora / openSUSE (.rpm)',
    badge: 'DNF / Zypper',
    os: 'Fedora 39+, openSUSE',
    command: 'sudo dnf install -y https://github.com/gtm-player/gtm/releases/latest/download/gtm.x86_64.rpm',
    description: 'Native RPM package with automated selinux policy tagging and PipeWire socket bindings.',
    notes: 'COPR repo also available: dnf copr enable gtm/stable && dnf install gtm'
  },
  {
    id: 'binary',
    name: 'Precompiled Tarball',
    badge: 'Direct Download',
    os: 'Static Linux / macOS',
    command: 'tar -xvf gtm-*-linux-x86_64.tar.gz && sudo mv gtm /usr/local/bin/',
    description: 'Fully self-contained static release tarballs compiled against musl-libc with zero runtime dynamic dependencies.',
    notes: 'Available for x86_64, aarch64, and armv7l.'
  }
];

const PREBUILT_BINARIES = [
  {
    arch: 'x86_64-unknown-linux-gnu',
    target: 'Linux 64-bit (glibc 2.31+)',
    size: '7.8 MB',
    sha: '9b2c8f4...e1a2',
    filename: 'gtm-v1.4.2-x86_64-unknown-linux-gnu.tar.gz'
  },
  {
    arch: 'x86_64-unknown-linux-musl',
    target: 'Linux 64-bit (Static musl)',
    size: '8.4 MB',
    sha: '3c810d7...f94b',
    filename: 'gtm-v1.4.2-x86_64-unknown-linux-musl.tar.gz'
  },
  {
    arch: 'aarch64-unknown-linux-gnu',
    target: 'Linux ARM64 / Raspberry Pi 4/5',
    size: '7.4 MB',
    sha: '6d123e4...80bb',
    filename: 'gtm-v1.4.2-aarch64-unknown-linux-gnu.tar.gz'
  },
  {
    arch: 'aarch64-apple-darwin',
    target: 'macOS Apple Silicon (M-series)',
    size: '7.2 MB',
    sha: '8f041b3...a421',
    filename: 'gtm-v1.4.2-aarch64-apple-darwin.tar.gz'
  },
  {
    arch: 'x86_64-apple-darwin',
    target: 'macOS Intel',
    size: '7.6 MB',
    sha: '2a198c6...dc77',
    filename: 'gtm-v1.4.2-x86_64-apple-darwin.tar.gz'
  }
];

const BUILD_DEPENDENCIES = [
  { distro: 'Debian / Ubuntu / Mint', command: 'sudo apt-get install -y libasound2-dev libpipewire-0.3-dev libclang-dev pkg-config' },
  { distro: 'Arch Linux / Manjaro', command: 'sudo pacman -S --needed alsa-lib pipewire clang pkgconf' },
  { distro: 'Fedora / RHEL / CentOS', command: 'sudo dnf install -y alsa-lib-devel pipewire-devel clang-devel pkgconf-pkg-config' },
  { distro: 'macOS (Xcode Tools)', command: 'xcode-select --install' }
];

export const InstallView: React.FC<InstallViewProps> = ({ onNavigateToDocs }) => {
  const [selectedMethod, setSelectedMethod] = useState<InstallCategory>('curl');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeMethod = INSTALL_METHODS.find(m => m.id === selectedMethod) || INSTALL_METHODS[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans space-y-12">
      {/* Header Section */}
      <div className="border-b border-hairline-outline pb-8 space-y-3">
        <div className="flex items-center gap-2 text-secondary font-mono text-xs font-semibold">
          <Download className="w-4 h-4" />
          <span>Release v1.4.2 (Latest)</span>
        </div>
        <h1 className="font-mono text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
          Install gtm
        </h1>
        <p className="text-base text-text-muted max-w-3xl leading-relaxed">
          Install the zero-latency, terminal-native audio player on your system. Official binaries are built reproducibly with full PipeWire, ALSA, and CoreAudio hardware support.
        </p>
        
        {/* Architecture Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 font-mono text-[11px] text-text-muted">
          <span className="px-2.5 py-1 rounded bg-surface-container border border-hairline-outline text-text-primary">
            Linux x86_64
          </span>
          <span className="px-2.5 py-1 rounded bg-surface-container border border-hairline-outline text-text-primary">
            Linux ARM64 / aarch64
          </span>
          <span className="px-2.5 py-1 rounded bg-surface-container border border-hairline-outline text-text-primary">
            macOS Apple Silicon (M1–M4)
          </span>
          <span className="px-2.5 py-1 rounded bg-surface-container border border-hairline-outline text-text-primary">
            macOS Intel
          </span>
          <span className="px-2.5 py-1 rounded bg-surface-container border border-hairline-outline text-text-primary">
            Static musl
          </span>
        </div>
      </div>

      {/* Main Interactive Method Selector */}
      <div className="space-y-6">
        <div>
          <h2 className="font-mono text-lg font-bold text-text-primary mb-1">
            Choose Installation Method
          </h2>
          <p className="text-xs text-text-muted">
            Select your operating system package manager or automated script.
          </p>
        </div>

        {/* Method Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
          {INSTALL_METHODS.map((method) => {
            const isSelected = selectedMethod === method.id;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-3 text-left rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-surface-elevated border-secondary text-text-primary'
                    : 'bg-surface-container border-hairline-outline text-text-muted hover:text-text-primary hover:border-text-muted'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold">{method.name}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-secondary" />}
                </div>
                <div className="text-[11px] text-text-disabled">
                  {method.badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Method Details Box */}
        <div className="bg-surface-container border border-hairline-outline rounded-lg p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline-subtle pb-3">
            <div>
              <div className="font-mono text-base font-bold text-text-primary">
                {activeMethod.name}
              </div>
              <div className="font-mono text-xs text-text-muted">
                Platform: {activeMethod.os}
              </div>
            </div>
            <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-surface-elevated text-secondary border border-hairline-outline self-start sm:self-center">
              {activeMethod.badge}
            </span>
          </div>

          <p className="text-sm text-text-body leading-relaxed">
            {activeMethod.description}
          </p>

          {/* Terminal Command Snippet */}
          <div className="bg-code-canvas border border-hairline-outline rounded-lg overflow-hidden font-mono text-xs">
            <div className="flex items-center justify-between px-3.5 py-2 bg-surface-elevated border-b border-hairline-outline text-[11px] text-text-muted">
              <span>Terminal Command</span>
              <button
                onClick={() => handleCopy(activeMethod.command, `active-${activeMethod.id}`)}
                className="flex items-center gap-1 hover:text-text-primary transition-colors cursor-pointer"
              >
                {copiedId === `active-${activeMethod.id}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-state-success" />
                    <span className="text-state-success font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 flex items-center gap-2 select-all overflow-x-auto text-text-primary">
              <span className="text-secondary font-bold select-none">$</span>
              <span>{activeMethod.command}</span>
            </div>
          </div>

          {activeMethod.notes && (
            <div className="flex items-start gap-2 text-xs text-text-muted font-mono bg-surface-container-low p-3 rounded border border-hairline-subtle">
              <AlertCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>{activeMethod.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Post-Installation Verification */}
      <div className="space-y-4">
        <div className="border-b border-hairline-outline pb-2">
          <h2 className="font-mono text-lg font-bold text-text-primary">
            Verify Your Installation
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Confirm that the gtm binary is available in your PATH and initialized correctly with your sound card.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1: Version Check */}
          <div className="bg-surface-container border border-hairline-outline rounded-lg p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-text-muted">
              <span className="font-bold text-text-primary">1. Check Binary Version</span>
              <button
                onClick={() => handleCopy('gtm --version', 'check-ver')}
                className="hover:text-text-primary transition-colors cursor-pointer text-[11px] flex items-center gap-1"
              >
                {copiedId === 'check-ver' ? (
                  <span className="text-state-success">Copied</span>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-code-canvas p-3 rounded border border-hairline-outline text-text-primary select-all">
              <span className="text-secondary select-none">$ </span>gtm --version
            </div>

            <div className="text-text-muted text-[11px] leading-relaxed">
              Expected output: <span className="text-state-success font-semibold">gtm 1.4.2 (rev 8c4f91b 2026-09-12 rustc 1.88)</span>
            </div>
          </div>

          {/* Step 2: Audio Handshake */}
          <div className="bg-surface-container border border-hairline-outline rounded-lg p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-text-muted">
              <span className="font-bold text-text-primary">2. Test Audio Hardware Sink</span>
              <button
                onClick={() => handleCopy('gtm --check-audio', 'check-audio')}
                className="hover:text-text-primary transition-colors cursor-pointer text-[11px] flex items-center gap-1"
              >
                {copiedId === 'check-audio' ? (
                  <span className="text-state-success">Copied</span>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-code-canvas p-3 rounded border border-hairline-outline text-text-primary select-all">
              <span className="text-secondary select-none">$ </span>gtm --check-audio
            </div>

            <div className="text-text-muted text-[11px] leading-relaxed">
              Verifies zero-latency buffers, sample rate capabilities (44.1kHz–192kHz), and PipeWire/ALSA kernel handles.
            </div>
          </div>
        </div>
      </div>

      {/* Standalone Release Binaries Table */}
      <div className="space-y-4">
        <div className="border-b border-hairline-outline pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-mono text-lg font-bold text-text-primary">
              Precompiled Release Binaries
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Direct downloads for air-gapped systems or manual deployment.
            </p>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-secondary hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>All GitHub Releases</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="border border-hairline-outline bg-surface-container rounded-lg overflow-x-auto">
          <table className="w-full min-w-[620px] text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-hairline-outline bg-surface-elevated text-text-muted uppercase text-[11px]">
                <th className="py-2.5 px-4">Architecture / Target</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">SHA-256</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-subtle text-text-body">
              {PREBUILT_BINARIES.map((bin, idx) => (
                <tr key={idx} className="hover:bg-surface-elevated/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-text-primary">
                    {bin.arch}
                  </td>
                  <td className="py-3 px-3 text-text-muted text-[11px]">
                    {bin.target}
                  </td>
                  <td className="py-3 px-3 text-text-muted text-[11px]">
                    {bin.size}
                  </td>
                  <td className="py-3 px-3 text-text-disabled text-[11px]">
                    {bin.sha}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleCopy(`https://github.com/gtm-player/gtm/releases/download/v1.4.2/${bin.filename}`, `dl-${idx}`)}
                      className="px-2.5 py-1 rounded bg-surface-elevated border border-hairline-outline text-text-primary hover:text-secondary hover:border-secondary transition-colors cursor-pointer text-[11px]"
                    >
                      {copiedId === `dl-${idx}` ? 'Link Copied' : 'Copy URL'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compile from Source & System Libraries */}
      <div className="space-y-4">
        <div className="border-b border-hairline-outline pb-2">
          <h2 className="font-mono text-lg font-bold text-text-primary">
            Build Prerequisites (Compiling from Source)
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            If you are compiling gtm via <code className="text-secondary">cargo install</code> or from a Git clone, install the respective audio header libraries first:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BUILD_DEPENDENCIES.map((dep, idx) => (
            <div key={idx} className="bg-surface-container border border-hairline-outline rounded-lg p-3.5 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-primary font-bold">{dep.distro}</span>
                <button
                  onClick={() => handleCopy(dep.command, `dep-${idx}`)}
                  className="text-[11px] text-text-muted hover:text-text-primary transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedId === `dep-${idx}` ? (
                    <span className="text-state-success">Copied</span>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-code-canvas p-2 rounded border border-hairline-outline text-text-body overflow-x-auto text-[11px] select-all">
                {dep.command}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shell Completions & Quick Start Tip */}
      <div className="p-5 sm:p-6 bg-surface-container border border-hairline-outline rounded-lg space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-secondary font-bold">
          <Terminal className="w-4 h-4" />
          <span>Shell Tab Completions</span>
        </div>
        <p className="text-text-muted leading-relaxed text-xs">
          Generate auto-completion scripts for your shell so you can tab-complete flags, directories, and audio settings:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <div className="bg-code-canvas p-2.5 rounded border border-hairline-outline text-[11px]">
            <div className="text-text-disabled mb-1"># Bash</div>
            <code className="text-text-primary select-all">gtm --completions bash &gt; ~/.local/share/bash-completion/completions/gtm</code>
          </div>
          <div className="bg-code-canvas p-2.5 rounded border border-hairline-outline text-[11px]">
            <div className="text-text-disabled mb-1"># Zsh</div>
            <code className="text-text-primary select-all">gtm --completions zsh &gt; ~/.zsh/completion/_gtm</code>
          </div>
          <div className="bg-code-canvas p-2.5 rounded border border-hairline-outline text-[11px]">
            <div className="text-text-disabled mb-1"># Fish</div>
            <code className="text-text-primary select-all">gtm --completions fish &gt; ~/.config/fish/completions/gtm.fish</code>
          </div>
        </div>
      </div>

      {/* Link to Documentation */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-surface-elevated/40 border border-hairline-outline rounded-lg gap-4 font-mono text-xs">
        <div>
          <div className="font-bold text-text-primary text-sm mb-1">Next: Configure Your Audio Pipeline</div>
          <div className="text-text-muted">Learn how to customize config.toml, setup bit-perfect FLAC streaming, and map vim keybindings.</div>
        </div>
        {onNavigateToDocs && (
          <button
            onClick={() => onNavigateToDocs('overview')}
            className="shrink-0 px-4 py-2 bg-primary-container text-on-primary-container rounded font-bold hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
          >
            <span>Open Documentation</span>
            <Terminal className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

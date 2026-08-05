import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { 
  FileText, Download, Award, Sparkles, CheckCircle2, ArrowRight, 
  BookOpen, Star, ShieldCheck, Zap, Layers, ExternalLink, Menu, X 
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function App() {
  const [templates, setTemplates] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchTemplatesData();
  }, []);

  const fetchTemplatesData = async () => {
    try {
      const res = await axios.get(`${API}/templates/list`);
      setTemplates(res.data.templates);
      setEpisodes(res.data.episodes);
      setLoading(false);
    } catch (e) {
      console.error("Error loading templates", e);
      toast.error("Failed to load templates hub.");
      setLoading(false);
    }
  };

  const handleDownload = (templateId, filename, title) => {
    const downloadUrl = `${API}/templates/download/${templateId}`;
    toast.success(`Downloading ${title} (.rar)...`, {
      description: "Your archive is downloading. Check your downloads folder."
    });
    
    // Trigger hidden iframe or anchor download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F8FAFC] font-sans selection:bg-blue-600 selection:text-white">
      <Toaster position="top-right" richColors />

      {/* Crystal Glass Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090D16]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                CareerKickstart Hub
              </span>
              <span className="block text-xs text-blue-400 font-medium">Episode 19 Edition</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#hub" className="text-sm font-medium text-slate-300 hover:text-white transition-colors" data-testid="nav-hub">
              Templates Hub
            </a>
            <a href="#cv-section" className="text-sm font-medium text-slate-300 hover:text-white transition-colors" data-testid="nav-cv">
              CV & Resume (.rar)
            </a>
            <a href="#cover-letter" className="text-sm font-medium text-slate-300 hover:text-white transition-colors" data-testid="nav-cover">
              Cover Letters (.rar)
            </a>
            <a href="#episode" className="text-sm font-medium text-slate-300 hover:text-white transition-colors" data-testid="nav-episode">
              Episode Link
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://career-kickstart-19.preview.emergentagent.com/episode/1"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
              data-testid="header-episode-cta"
            >
              <span>Live Episode 19</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white"
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#090D16] border-b border-white/10 px-6 py-6 flex flex-col gap-4">
            <a href="#hub" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-200">Templates Hub</a>
            <a href="#cv-section" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-200">CV & Resume (.rar)</a>
            <a href="#cover-letter" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-200">Cover Letters (.rar)</a>
            <a 
              href="https://career-kickstart-19.preview.emergentagent.com/episode/1"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-blue-600 text-white text-center font-medium"
            >
              Live Episode 19 Link
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.15),rgba(255,255,255,0))] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
                <Zap className="w-3.5 h-3.5" />
                <span>OFFICIAL EPISODE 19 RESOURCE DOWNLOAD HUB</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
                Download Your Pro <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">CV & Cover Letter</span> Archive
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
                Access the exact templates featured in Episode 19. Packaged in clean <code className="px-2 py-0.5 rounded bg-white/10 text-blue-300 font-mono text-sm">.rar</code> archives for instant unpacking, ATS optimization, and recruiter-ready success.
              </p>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => handleDownload('cv-bundle', 'Professional_CV_Templates.rar', 'Ultimate CV Template Pack')}
                  className="px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-xl shadow-blue-600/30 flex items-center gap-3 group"
                  data-testid="hero-download-cv-btn"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  <span>Download CV Template (.rar)</span>
                </button>

                <button 
                  onClick={() => handleDownload('cover-letter-bundle', 'Winning_Cover_Letters.rar', 'Cover Letter Suite')}
                  className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold border border-white/10 transition-all flex items-center gap-3"
                  data-testid="hero-download-cover-btn"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Cover Letter (.rar)</span>
                </button>
              </div>

              <div className="mt-10 flex items-center gap-8 pt-8 border-t border-white/10 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>100% ATS Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  <span>4.9/5 Recruiter Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  <span>Word, PDF & LaTeX</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative p-8 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 shadow-2xl backdrop-blur-2xl">
                <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold shadow-lg">
                  READY (.rar)
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Episode 19 Master Bundle</h3>
                    <p className="text-xs text-slate-400">Compressed .rar Archive • 22.7 MB total</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-200">Professional_CV_Templates.rar</span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 font-mono">14.2 MB</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-200">Winning_Cover_Letters.rar</span>
                    <span className="text-xs px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono">8.5 MB</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-xs text-slate-300 flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block mb-1">Linked with Episode 19</span>
                    Directly synchronized with <a href="https://career-kickstart-19.preview.emergentagent.com/episode/1" target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-300">career-kickstart-19.preview.emergentagent.com/episode/1</a>.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Templates Hub Section */}
      <section id="hub" className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="text-blue-400 font-mono text-xs tracking-[0.2em] uppercase mb-3">TEMPLATES HUB</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Download Archives By Category
            </h2>
          </div>
          <p className="text-slate-400 max-w-md mt-4 md:mt-0 text-sm">
            Each bundle is packaged securely in a `.rar` file containing full documentation, font assets, and layout variations.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="templates-grid">
          {templates.map((tpl, idx) => (
            <div 
              key={tpl.id}
              className="group relative p-8 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between shadow-xl"
              data-testid={`template-card-${tpl.id}`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
                    {tpl.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{tpl.size}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {tpl.title}
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  {tpl.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {tpl.formats.map((fmt, fIdx) => (
                    <span key={fIdx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{tpl.rating} ({tpl.downloads.toLocaleString()} downloads)</span>
                </div>

                <button 
                  onClick={() => handleDownload(tpl.id, tpl.filename, tpl.title)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/30 flex items-center gap-2"
                  data-testid={`download-btn-${tpl.id}`}
                >
                  <Download className="w-4 h-4" />
                  <span>Download (.rar)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Episode Integration Banner */}
      <section id="episode" className="py-20 bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-950 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="p-10 rounded-3xl bg-blue-600/10 border border-blue-500/30 flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-xl">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4">
                <span>EPISODE 19 MASTERCLASS LINK</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Career Kickstart Episode 19 Integration
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                You are currently connected to the Episode 19 template portal. Use the link below to jump directly back to the main interactive career coaching episode.
              </p>
              <div className="font-mono text-xs text-blue-400 bg-black/40 px-3 py-2 rounded-lg border border-white/10 inline-block">
                https://career-kickstart-19.preview.emergentagent.com/episode/1
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <a 
                href="https://career-kickstart-19.preview.emergentagent.com/episode/1"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                data-testid="episode-direct-link"
              >
                <span>Open Episode 19</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 bg-[#060910]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="font-semibold text-white">Career Kickstart Hub © 2026</span>
          </div>

          <p className="text-xs text-center md:text-left">
            All CV and Cover Letter templates packaged in `.rar` format for secure career acceleration.
          </p>

          <div className="flex items-center gap-6">
            <a href="#hub" className="hover:text-white transition-colors">Hub</a>
            <a href="#cv-section" className="hover:text-white transition-colors">CV Archive</a>
            <a href="#cover-letter" className="hover:text-white transition-colors">Cover Letters</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

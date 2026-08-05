import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import { 
  FileText, Download, Sparkles, CheckCircle2, ArrowRight, 
  BookOpen, Star, ShieldCheck, Zap, ExternalLink, Menu, X, Award, PlayCircle 
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDownload = (templateId, filename, title) => {
    const downloadUrl = `${API}/templates/download/${templateId}`;
    toast.success(`Mengunduh ${title} (.rar)...`, {
      description: "File arsip .rar sedang diunduh secara otomatis untuk anak-anak panti."
    });
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E293B] font-sans selection:bg-amber-500 selection:text-white">
      <Toaster position="top-right" richColors />

      {/* Navigasi Atas */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FDFBF7]/95 border-b border-amber-950/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Karir Siap Kerja
              </span>
              <span className="block text-xs text-amber-700 font-medium">Platform Belajar & Berbagi • Episode 19</span>
            </div>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="https://career-kickstart-19.preview.emergentagent.com/episode/1" className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors" data-testid="nav-kurikulum">
              Kurikulum Episode 19
            </a>
            <a href="#unduh-arsip" className="text-sm font-medium text-slate-900 font-semibold bg-amber-500/10 px-4 py-2 rounded-xl text-amber-800 border border-amber-500/30" data-testid="nav-sumber-daya">
              📥 Unduh Template CV & Cover Letter (.rar)
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://career-kickstart-19.preview.emergentagent.com/episode/1"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-md flex items-center gap-2"
              data-testid="header-episode-cta"
            >
              <span>Buka Episode 1</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Tombol Menu Mobile */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-900"
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Dropdown Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FDFBF7] border-b border-amber-950/10 px-6 py-6 flex flex-col gap-4">
            <a href="https://career-kickstart-19.preview.emergentagent.com/episode/1" className="text-base font-medium text-slate-800">Kurikulum Episode 19</a>
            <a href="#unduh-arsip" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-amber-700">Unduh Template .rar</a>
            <a 
              href="https://career-kickstart-19.preview.emergentagent.com/episode/1"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-slate-900 text-white text-center font-medium"
            >
              Buka Episode 1
            </a>
          </div>
        )}
      </header>

      {/* Bagian Utama / Hero */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-amber-950/10">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 text-xs font-bold mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>KHUSUS ANAK PANTI & REMAJA MANDIRI • EPISODE 19</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
                Dari nol di MS Word ke <span className="text-amber-600 underline decoration-amber-300 decoration-wavy decoration-2">CV & Cover Letter</span> siap kerja.
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl">
                Belajar Microsoft Word dari dasar, lalu langsung dipraktikkan untuk menyusun CV profesional dan Surat Lamaran Kerja (Cover Letter) terbaik. Dibuat khusus untuk membantu anak-anak panti asuhan menatap masa depan mandiri tanpa biaya.
              </p>

              <div className="flex flex-wrap gap-4" id="unduh-arsip">
                <button 
                  onClick={() => handleDownload('cv-bundle', 'Professional_CV_Templates.rar', 'Ultimate CV Template Pack')}
                  className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all shadow-xl shadow-slate-900/10 flex items-center gap-3 group"
                  data-testid="download-cv-btn"
                >
                  <Download className="w-5 h-5 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
                  <span>Unduh CV Template (.rar)</span>
                </button>

                <button 
                  onClick={() => handleDownload('cover-letter-bundle', 'Winning_Cover_Letters.rar', 'Cover Letter Suite')}
                  className="px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all shadow-xl shadow-amber-500/20 flex items-center gap-3 group"
                  data-testid="download-cover-btn"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  <span>Unduh Cover Letter (.rar)</span>
                </button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 p-5 rounded-2xl bg-white border border-amber-950/10 shadow-sm max-w-lg">
                <div className="text-center border-r border-slate-100 pr-2">
                  <span className="block font-black text-xl text-slate-900">3 Modul</span>
                  <span className="text-xs text-slate-500">Terstruktur</span>
                </div>
                <div className="text-center border-r border-slate-100 pr-2">
                  <span className="block font-black text-xl text-slate-900">8 Episode</span>
                  <span className="text-xs text-slate-500">5-7 menit</span>
                </div>
                <div className="text-center">
                  <span className="block font-black text-xl text-amber-600">100%</span>
                  <span className="text-xs text-slate-500">Gratis & ATS</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative p-8 rounded-3xl bg-white border-2 border-amber-950/15 shadow-2xl">
                <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md">
                  SIAP KLIK & UNDUH (.rar)
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Arsip Template Panti Mandiri</h3>
                    <p className="text-xs text-slate-500">Format .rar • Otomatis Tersimpan</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div 
                    onClick={() => handleDownload('cv-bundle', 'Professional_CV_Templates.rar', 'Ultimate CV Template Pack')}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-all group shadow-sm"
                    data-testid="card-download-cv"
                  >
                    <div>
                      <span className="text-sm font-bold text-slate-900 block group-hover:text-amber-600">Professional_CV_Templates.rar</span>
                      <span className="text-xs text-slate-500">Word, PDF & ATS Ready</span>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <Download className="w-4 h-4" />
                    </div>
                  </div>

                  <div 
                    onClick={() => handleDownload('cover-letter-bundle', 'Winning_Cover_Letters.rar', 'Cover Letter Suite')}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-all group shadow-sm"
                    data-testid="card-download-cover"
                  >
                    <div>
                      <span className="text-sm font-bold text-slate-900 block group-hover:text-amber-600">Winning_Cover_Letters.rar</span>
                      <span className="text-xs text-slate-500">Surat Lamaran Kerja Profesional</span>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <Download className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-700 flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block mb-1">Terhubung dengan Episode 1</span>
                    Akses materi video lengkap di <a href="https://career-kickstart-19.preview.emergentagent.com/episode/1" target="_blank" rel="noreferrer" className="text-amber-600 underline font-semibold">career-kickstart-19.preview.emergentagent.com/episode/1</a>.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bagian Bawah / Footer */}
      <footer className="py-12 border-t border-amber-950/10 bg-[#F4F1EA]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold">
              K
            </div>
            <span className="font-semibold text-slate-900">Karir Siap Kerja (Panti Asuhan Hub) © 2026</span>
          </div>

          <p className="text-xs text-center md:text-left">
            Platform pembelajaran gratis untuk anak panti asuhan. Klik unduh untuk mendapatkan template CV & Cover Letter (.rar) secara instan.
          </p>

          <div className="flex items-center gap-6">
            <a href="https://career-kickstart-19.preview.emergentagent.com/episode/1" className="hover:text-amber-600 transition-colors">Episode 1</a>
            <a href="#unduh-arsip" className="hover:text-amber-600 transition-colors">Unduh Template</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

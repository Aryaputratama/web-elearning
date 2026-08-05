import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import { 
  FileText, Download, Sparkles, CheckCircle2, ArrowRight, 
  BookOpen, Star, ShieldCheck, Zap, ExternalLink, Menu, X, Award, PlayCircle, Youtube, MessageCircle, Send, HelpCircle 
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const YOUTUBE_VIDEOS = [
  {
    id: "v1",
    title: "Panduan Dasar Pembuatan CV di MS Word",
    duration: "6:15",
    url: "https://youtu.be/K15-k1NAVmA?si=3Izh6NWn0O8dAy7p",
    embedUrl: "https://www.youtube.com/embed/K15-k1NAVmA",
    description: "Belajar mengatur margin, font, dan tata letak dokumen CV profesional dari awal."
  },
  {
    id: "v2",
    title: "Menyusun Pengalaman Kerja & Pendidikan yang Menarik",
    duration: "5:40",
    url: "https://youtu.be/RcNYMhL980o?si=cFvhOFuhtzziXXVb",
    embedUrl: "https://www.youtube.com/embed/RcNYMhL980o",
    description: "Cara menulis riwayat pekerjaan dan prestasi agar dilirik HRD."
  },
  {
    id: "v3",
    title: "Membuat Cover Letter (Surat Lamaran) Profesional",
    duration: "7:02",
    url: "https://youtu.be/BbGwiFWODiM?si=bXwaSpYZ9SGWmHyr",
    embedUrl: "https://www.youtube.com/embed/BbGwiFWODiM",
    description: "Teknik menyusun surat pengantar lamaran kerja yang sopan, padat, dan memikat."
  },
  {
    id: "v4",
    title: "Tips Lolos ATS & Format File Terbaik",
    duration: "5:20",
    url: "https://youtu.be/s0t1bECdyDM?si=e6qTH1FsVbjpYmSR",
    embedUrl: "https://www.youtube.com/embed/s0t1bECdyDM",
    description: "Memastikan CV Anda lolos sensor mesin ATS perusahaan besar."
  },
  {
    id: "v5",
    title: "Simulasi Kirim Lamaran & Tanya Jawab Interview",
    duration: "8:10",
    url: "https://youtu.be/4UIPG5zeiY4?si=pHIjzqzvT8fcJCau",
    embedUrl: "https://www.youtube.com/embed/4UIPG5zeiY4",
    description: "Persiapan akhir menjelang panggilan kerja dan cara percaya diri saat wawancara."
  }
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(YOUTUBE_VIDEOS[0]);
  const [question, setQuestion] = useState("");
  const [chatSubmitted, setChatSubmitted] = useState(false);

  const handleDownload = (templateId, filename, title) => {
    const downloadUrl = `${API}/templates/download/${templateId}`;
    toast.success(`Mengunduh ${title} (.rar)...`, {
      description: "File arsip .rar sedang diunduh secara otomatis."
    });
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setChatSubmitted(true);
    toast.success("Pertanyaan berhasil dikirim ke Kak Arya!", {
      description: "Anda akan dihubungkan melalui WhatsApp ke nomor 08111188644."
    });
    // Open WhatsApp with prefilled question to Arya
    const waUrl = `https://wa.me/628111188644?text=${encodeURIComponent(`Halo Kak Arya, saya ingin bertanya seputar CV & Cover Letter: ${question}`)}`;
    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E293B] font-sans selection:bg-amber-500 selection:text-white">
      <Toaster position="top-right" richColors />

      {/* Navigasi Atas */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FDFBF7]/95 border-b border-amber-950/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Karir Siap Kerja
              </span>
              <span className="block text-xs text-amber-700 font-medium">E-Learning Panti Asuhan • Episode 19</span>
            </div>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#tutorial-video" className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors" data-testid="nav-video">
              🎥 Video Tutorial
            </a>
            <a href="#download-section" className="text-sm font-medium text-slate-900 font-semibold bg-amber-500/10 px-4 py-2 rounded-xl text-amber-800 border border-amber-500/30" data-testid="nav-sumber-daya">
              📥 Unduh Template (.rar)
            </a>
            <a href="#kontak-arya" className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors" data-testid="nav-kontak">
              💬 Tanya Kak Arya
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://wa.me/628111188644?text=Halo%20Kak%20Arya,%20saya%20ingin%20berkonsultasi%20karir."
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-md flex items-center gap-2"
              data-testid="header-wa-cta"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat WhatsApp Arya</span>
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
            <a href="#tutorial-video" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-800">🎥 Video Tutorial</a>
            <a href="#download-section" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold text-amber-700">📥 Unduh Template .rar</a>
            <a href="#kontak-arya" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-800">💬 Tanya Kak Arya</a>
            <a 
              href="https://wa.me/628111188644"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 text-white text-center font-medium flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Kak Arya (08111188644)</span>
            </a>
          </div>
        )}
      </header>

      {/* Bagian Utama / Hero & Unduh */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-amber-950/10 bg-gradient-to-b from-[#FDFBF7] to-[#F4F1EA]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 text-xs font-bold mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>PROGRAM BELAJAR GRATIS • KHUSUS ANAK PANTI & REMAJA MANDIRI</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
                Dari nol di MS Word ke <span className="text-amber-600 underline decoration-amber-300 decoration-wavy decoration-2">CV & Cover Letter</span> siap kerja.
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl">
                Belajar langkah demi langkah melalui 5 video tutorial YouTube interaktif, lalu unduh langsung paket template arsip <code className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-sm">.rar</code> untuk menyusun CV profesionalmu.
              </p>

              <div className="flex flex-wrap gap-4" id="download-section">
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
                  <span className="block font-black text-xl text-slate-900">5 Video</span>
                  <span className="text-xs text-slate-500">Tutorial YouTube</span>
                </div>
                <div className="text-center border-r border-slate-100 pr-2">
                  <span className="block font-black text-xl text-slate-900">2 File .rar</span>
                  <span className="text-xs text-slate-500">Siap Pakai</span>
                </div>
                <div className="text-center">
                  <span className="block font-black text-xl text-amber-600">100%</span>
                  <span className="text-xs text-slate-500">Gratis & Mandiri</span>
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
                    <span className="font-semibold text-slate-900 block mb-1">Terhubung dengan Episode 19</span>
                    Akses materi video lengkap di <a href="https://career-kickstart-19.preview.emergentagent.com/episode/1" target="_blank" rel="noreferrer" className="text-amber-600 underline font-semibold">career-kickstart-19.preview.emergentagent.com/episode/1</a>.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bagian Tutorial 5 Video YouTube */}
      <section id="tutorial-video" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold mb-4">
            <Youtube className="w-4 h-4" />
            <span>5 VIDEO TUTORIAL YOUTUBE RESMI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Belajar Bikin CV & Cover Letter Step-by-Step
          </h2>
          <p className="text-slate-600 text-base">
            Klik salah satu video di bawah untuk langsung menonton tutorialnya di YouTube atau putar langsung di sini. Sangat mudah diikuti oleh pemula!
          </p>
        </div>

        {/* Video Player Display */}
        <div className="mb-12 p-6 rounded-3xl bg-slate-900 text-white shadow-2xl border border-amber-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-lg">
                <iframe 
                  src={activeVideo.embedUrl} 
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold mb-4">
                  <PlayCircle className="w-3.5 h-3.5" /> Sedang Diputar
                </span>
                <h3 className="text-2xl font-bold text-white mb-3">{activeVideo.title}</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">{activeVideo.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <a 
                  href={activeVideo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-lg"
                  data-testid="watch-on-youtube-btn"
                >
                  <Youtube className="w-4 h-4" />
                  <span>Tonton Langsung di YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* List 5 Video Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {YOUTUBE_VIDEOS.map((vid, idx) => (
            <div 
              key={vid.id}
              onClick={() => setActiveVideo(vid)}
              className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${activeVideo.id === vid.id ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-500/20' : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-lg'}`}
              data-testid={`video-card-${vid.id}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center text-xs">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {vid.duration}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-2">{vid.title}</h4>
                <p className="text-xs text-slate-600 mb-4 line-clamp-2">{vid.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
                <span className="flex items-center gap-1.5">
                  <PlayCircle className="w-4 h-4 text-red-600" />
                  {activeVideo.id === vid.id ? 'Sedang Diputar' : 'Putar Video'}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bagian Kontak Tanya Kak Arya (08111188644) */}
      <section id="kontak-arya" className="py-20 bg-gradient-to-r from-amber-900 via-amber-950 to-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-black/40 border border-amber-500/30 backdrop-blur-xl shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-4">
                  <MessageCircle className="w-4 h-4" /> KONSULTASI GRATIS DENGAN KAK ARYA
                </span>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Punya Pertanyaan Seputar CV atau Cara Melamar Kerja?
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Jangan ragu! Kirimkan pertanyaan atau kendala Anda langsung kepada Kak Arya melalui WhatsApp di nomor <strong className="text-amber-400 font-mono">08111188644</strong>. Kami siap membantu anak-anak panti meraih impian karir!
                </p>

                <div className="flex items-center gap-4">
                  <a 
                    href="https://wa.me/628111188644?text=Halo%20Kak%20Arya,%20saya%20ingin%20bertanya%20mengenai%20pembuatan%20CV."
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg flex items-center gap-2"
                    data-testid="whatsapp-arya-btn"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat WhatsApp (08111188644)</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6">
                <form onSubmit={handleQuestionSubmit} className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
                  <h4 className="font-bold text-lg text-white mb-3 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-400" />
                    Tulis Pertanyaan Anda ke Kak Arya
                  </h4>
                  <p className="text-xs text-slate-300 mb-4">
                    Ketik pertanyaan Anda di bawah ini. Tombol kirim akan langsung menghubungkan Anda ke WhatsApp Kak Arya (08111188644).
                  </p>

                  <textarea 
                    rows={4}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Contoh: Kak Arya, bagaimana cara membuat pengalaman kerja di CV jika saya belum pernah bekerja formal?"
                    className="w-full p-3.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 mb-4 resize-none"
                    data-testid="question-textarea"
                  ></textarea>

                  <button 
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                    data-testid="send-question-btn"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Pertanyaan via WhatsApp</span>
                  </button>
                </form>
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
            Didukung oleh Kak Arya (08111188644). Unduh template `.rar` dan tonton 5 video tutorial YouTube gratis.
          </p>

          <div className="flex items-center gap-6">
            <a href="#tutorial-video" className="hover:text-amber-600 transition-colors">Video Tutorial</a>
            <a href="#download-section" className="hover:text-amber-600 transition-colors">Unduh Template</a>
            <a href="#kontak-arya" className="hover:text-amber-600 transition-colors">Kontak Kak Arya</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

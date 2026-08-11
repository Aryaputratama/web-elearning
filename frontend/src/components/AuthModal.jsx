import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, Mail, Lock, User, LogIn, UserPlus, Loader2 } from "lucide-react";
import { useAuth, formatApiErrorDetail } from "../context/AuthContext";

export const AuthModal = ({ open, onClose, defaultMode = "login" }) => {
  const [mode, setMode] = useState(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();

  // Sync internal mode whenever modal opens or defaultMode changes
  useEffect(() => {
    if (open) setMode(defaultMode);
  }, [open, defaultMode]);

  if (!open) return null;

  const reset = () => {
    setEmail(""); setPassword(""); setName(""); setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const u = await login(email, password);
        toast.success(`Selamat datang kembali, ${u.name || u.email}!`);
      } else {
        if (!name.trim()) { setError("Nama tidak boleh kosong"); setLoading(false); return; }
        if (password.length < 6) { setError("Password minimal 6 karakter"); setLoading(false); return; }
        const u = await register(email, password, name);
        toast.success(`Halo ${u.name}! Akun kamu berhasil dibuat.`);
      }
      reset();
      onClose();
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
      onClick={onClose}
      data-testid="auth-modal-backdrop"
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        data-testid="auth-modal"
      >
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 transition"
            data-testid="auth-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center shadow-md">
              {mode === "login" ? <LogIn className="w-5 h-5 text-slate-900" /> : <UserPlus className="w-5 h-5 text-slate-900" />}
            </div>
            <div>
              <h2 className="text-xl font-black">{mode === "login" ? "Masuk ke Akun" : "Daftar Akun Baru"}</h2>
              <p className="text-xs text-amber-300">HCG Teams • Karir Siap Kerja</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" data-testid="auth-form">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Contoh: Budi Santoso"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none text-sm text-slate-900"
                  data-testid="auth-input-name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none text-sm text-slate-900"
                data-testid="auth-input-email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none text-sm text-slate-900"
                data-testid="auth-input-password"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium" data-testid="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            data-testid="auth-submit-btn"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === "login" ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />)}
            <span>{mode === "login" ? "Masuk" : "Daftar Sekarang"}</span>
          </button>

          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={switchMode}
              className="text-xs text-slate-600 hover:text-amber-600"
              data-testid="auth-switch-mode"
            >
              {mode === "login" ? "Belum punya akun? Daftar di sini →" : "Sudah punya akun? Masuk di sini →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

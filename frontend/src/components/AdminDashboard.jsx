import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Users, Trophy, Mail, Calendar, RefreshCw, Loader2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AdminDashboard = ({ open, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${API}/admin/users`, { withCredentials: true });
      setData(data);
    } catch (e) {
      setError(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  if (!open) return null;

  const formatDate = (iso) => {
    if (!iso) return "-";
    try { return new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }); }
    catch { return iso; }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
      onClick={onClose}
      data-testid="admin-dashboard-backdrop"
    >
      <div
        className="w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        data-testid="admin-dashboard"
      >
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center shadow-md">
              <Users className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h2 className="text-xl font-black">Dashboard Admin</h2>
              <p className="text-xs text-amber-300">Pantau progres semua pengguna • HCG Teams</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              title="Refresh"
              data-testid="admin-refresh-btn"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition"
              data-testid="admin-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
              {error}
            </div>
          )}

          {data && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="block text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Total Pengguna</span>
                  <span className="block text-3xl font-black text-slate-900" data-testid="admin-total-users">{data.total_users}</span>
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Total Video Tersedia</span>
                  <span className="block text-3xl font-black text-slate-900">{data.total_videos}</span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-sm" data-testid="admin-users-table">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="text-left px-4 py-3 font-bold">Nama</th>
                      <th className="text-left px-4 py-3 font-bold">Email</th>
                      <th className="text-left px-4 py-3 font-bold">Role</th>
                      <th className="text-left px-4 py-3 font-bold">Video Ditonton</th>
                      <th className="text-left px-4 py-3 font-bold">Progres</th>
                      <th className="text-left px-4 py-3 font-bold">Terakhir Login</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {data.users.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-8 text-slate-400">Belum ada pengguna terdaftar</td></tr>
                    )}
                    {data.users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50" data-testid={`admin-user-row-${u.email}`}>
                        <td className="px-4 py-3 font-semibold text-slate-900">{u.name || "-"}</td>
                        <td className="px-4 py-3 text-slate-700"><span className="inline-flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{u.email}</span></td>
                        <td className="px-4 py-3">
                          {u.role === "admin" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                              <Trophy className="w-3 h-3" /> Admin
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">Pengguna</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono font-semibold text-slate-900">{u.watched_count} / {u.total}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden min-w-[80px]">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all"
                                style={{ width: `${u.progress_percent}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-slate-800 font-mono w-10 text-right">{u.progress_percent}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600"><span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" />{formatDate(u.last_login)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {loading && !data && (
            <div className="flex items-center justify-center py-16 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat data pengguna...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

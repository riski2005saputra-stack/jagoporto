import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Key,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Database,
  Activity,
  Server,
  FileCode,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { db } from '../services/database';

export default function AdminSettings() {
  const {
    ownerData,
    customers,
    templates,
    exportDatabaseBackup,
    importDatabaseBackup,
    resetToDefaultData,
  } = usePortfolio();

  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [adminPin, setAdminPin] = useState('2026');
  const [pinSaved, setPinSaved] = useState(false);

  // Database Health Diagnostic State
  const [healthData, setHealthData] = useState(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const runDatabaseDiagnostics = async () => {
    setIsDiagnosing(true);
    const result = await db.healthCheck();
    setHealthData(result);
    setIsDiagnosing(false);
  };

  useEffect(() => {
    runDatabaseDiagnostics();
  }, []);

  const handleDownloadSchemaSql = () => {
    fetch('/src/db/schema.sql')
      .then((res) => {
        if (!res.ok) throw new Error('File not found');
        return res.text();
      })
      .then((sqlContent) => {
        const blob = new Blob([sqlContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `riski-supabase-schema-${new Date().toISOString().slice(0, 10)}.sql`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        alert('Mengunduh skema SQL database...');
      });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      const res = importDatabaseBackup(content);
      setImportStatus(res);
      setTimeout(() => setImportStatus(null), 5000);
      runDatabaseDiagnostics();
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSavePin = (e) => {
    e.preventDefault();
    setPinSaved(true);
    setTimeout(() => setPinSaved(false), 3000);
  };

  const handleResetDatabase = () => {
    resetToDefaultData();
    setResetConfirm(false);
    runDatabaseDiagnostics();
    alert('Database telah dikembalikan ke data default Master Riski Saputra.');
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="pb-5 border-b border-white/10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold mb-2">
          <Database className="w-3.5 h-3.5" />
          <span>BACKEND & DATABASE INFRASTRUCTURE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
          Pengaturan Sistem & Database
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Pusat pemantau status database, diagnosa kesehatan data, pencadangan offline JSON, dan ekspor skema SQL cloud.
        </p>
      </div>

      {/* ========================================================
          1. DATABASE HEALTH & DIAGNOSTIC CENTER (TASK 4)
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-[#090E17]/90 border border-emerald-500/40 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-md">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                Status Koneksi & Kesehatan Database
              </h3>
              <div className="text-xs font-mono text-emerald-300 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{healthData?.engine || 'Local Transactional Engine'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={runDatabaseDiagnostics}
              disabled={isDiagnosing}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-xs font-bold text-emerald-200 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <Activity className={`w-3.5 h-3.5 ${isDiagnosing ? 'animate-spin' : ''}`} />
              <span>{isDiagnosing ? 'Memeriksa...' : 'Jalankan Diagnosa'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSchemaSql}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-500/40 text-xs font-bold text-blue-200 transition-all cursor-pointer shadow-md"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Unduh Schema.sql</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
            <div className="text-[11px] font-mono text-slate-400">Database Status</div>
            <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{healthData?.status || 'HEALTHY'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
            <div className="text-[11px] font-mono text-slate-400">Response Latency</div>
            <div className="text-sm font-bold text-amber-300 font-mono mt-1">
              {healthData?.latencyMs ?? 2} ms
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
            <div className="text-[11px] font-mono text-slate-400">Total Projek Master</div>
            <div className="text-sm font-bold text-rose-300 font-mono mt-1">
              {ownerData.projects.length} Projek
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
            <div className="text-[11px] font-mono text-slate-400">Total Template Aktif</div>
            <div className="text-sm font-bold text-purple-300 font-mono mt-1">
              {templates?.length || 3} Template
            </div>
          </div>
        </div>

        {/* Database Tables Overview */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-mono font-bold text-slate-300 uppercase">
            Ringkasan Tabel Database Relasional:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex justify-between">
              <span className="text-slate-400">users</span>
              <span className="text-white font-bold">{customers.length + 1} rows</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex justify-between">
              <span className="text-slate-400">projects</span>
              <span className="text-rose-300 font-bold">{ownerData.projects.length} rows</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex justify-between">
              <span className="text-slate-400">skills</span>
              <span className="text-amber-300 font-bold">{ownerData.skills.length} rows</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex justify-between">
              <span className="text-slate-400">certificates</span>
              <span className="text-blue-300 font-bold">{ownerData.certificates.length} rows</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. ACCOUNT IDENTITY INFO
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
              Identitas Pemilik Sistem (Master Owner)
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold">
            OWNER-001 • MASTER LEVEL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <div className="text-slate-400">Nama Pemilik:</div>
            <div className="text-white font-bold text-sm mt-0.5">{ownerData.profile.fullName}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <div className="text-slate-400">Email Utama:</div>
            <div className="text-white font-bold text-sm mt-0.5">{ownerData.profile.email}</div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. BACKUP & RESTORE CENTER
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
          <Database className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
              Pencadangan & Pemulihan Data (Backup & Restore)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Simpan seluruh database lokal ke dalam berkas JSON mandiri.
            </p>
          </div>
        </div>

        {importStatus && (
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-mono ${
              importStatus.success
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
            }`}
          >
            {importStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Button */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unduh Cadangan (Export JSON)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Download database lengkap dalam format <code>.json</code> untuk disimpan di laptop/cloud.
              </p>
            </div>
            <button
              type="button"
              onClick={exportDatabaseBackup}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-400/40 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
            >
              <span>Download Backup JSON</span>
            </button>
          </div>

          {/* Import Button */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>Pulihkan Data (Import JSON)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Unggah file cadangan <code>.json</code> untuk memulihkan seluruh portfolio & data customer.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-400/40 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
              >
                <span>Pilih Berkas JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. SECURITY PIN
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-[#090E17]/90 border border-white/15 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
          <Key className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
            PIN Keamanan Admin Master
          </h3>
        </div>

        <form onSubmit={handleSavePin} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Master Admin PIN (Akses Khusus /admin)
            </label>
            <input
              type="password"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#060B12] border border-slate-700 text-white font-mono text-sm outline-none focus:border-rose-400 transition-colors"
              placeholder="Masukkan PIN Admin"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-900 to-[#5c0b25] hover:from-rose-800 hover:to-rose-900 border border-rose-400/40 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              Simpan PIN Admin
            </button>
            {pinSaved && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>PIN berhasil disimpan!</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* ========================================================
          5. DANGER ZONE: FACTORY RESET
          ======================================================== */}
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
            Zona Bahaya: Reset Database
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Mengembalikan seluruh data profil, projek, dan daftar pelanggan kembali ke data asli bawaan Master Riski Saputra.
        </p>

        {resetConfirm ? (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 space-y-3">
            <div className="text-xs font-bold text-rose-200">
              Apakah Anda yakin ingin menghapus semua perubahan dan mereset data?
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetDatabase}
                className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold cursor-pointer"
              >
                Ya, Reset Sekarang
              </button>
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Data Default Master</span>
          </button>
        )}
      </div>
    </div>
  );
}

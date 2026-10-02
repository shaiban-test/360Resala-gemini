/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Lock,
  User,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { state, loginAdmin, setView } = useAppStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = loginAdmin(username, password);
    if (!success) {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة. يرجى التحقق وإعادة المحاولة.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="max-w-md w-full bg-[#0D181A] border border-emerald-900/60 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-emerald-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto shadow-lg shadow-sky-500/10">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            تسجيل الدخول للوحة الإدارة العليا
          </h2>
          <p className="text-xs text-slate-400">
            بوابة الإدارة الخاصة بمالك المنصة وموفر خدمات ميتا (Meta Tech Provider)
          </p>
        </div>

        {/* Default Credentials Badge for User Convenience */}
        <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/25 text-xs text-slate-300 space-y-1 text-right">
          <div className="flex items-center gap-1.5 text-sky-400 font-bold mb-1">
            <KeyRound className="w-3.5 h-3.5" />
            <span>بيانات الدخول الافتراضية المجهزة لك:</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">اسم المستخدم:</span>
            <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              admin
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">كلمة المرور:</span>
            <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              admin123456
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block pt-1">
            (يمكنك تغييرها في أي وقت من داخل لوحة الإدارة بعد الدخول)
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-right">
              اسم المستخدم (Username)
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#102023] border border-slate-800 focus:border-sky-400 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                placeholder="admin"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-right">
              كلمة المرور (Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#102023] border border-slate-800 focus:border-sky-400 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-300 absolute left-3 top-3"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2"
          >
            <Lock className="w-4 h-4" />
            <span>تسجيل الدخول إلى لوحة الإدارة العليا</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={() => setView('landing')}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            ← العودة للصفحة الرئيسية للمنصة
          </button>
        </div>
      </div>
    </div>
  );
};

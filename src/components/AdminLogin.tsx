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
import { BrandLogo } from './BrandLogo';

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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative font-['Cairo',sans-serif]">
      <div className="max-w-md w-full bg-[#071317] border border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="lg" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            لوحة الإدارة العليا 360Resala
          </h2>
          <p className="text-xs text-slate-400">
            بوابة الإدارة المركزية وإعدادات موفر حلول ميتا (Meta Tech Provider)
          </p>
        </div>

        {/* Default Credentials Badge for User Convenience */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-slate-300 space-y-1 text-right">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
            <KeyRound className="w-3.5 h-3.5" />
            <span>بيانات الدخول المجهزة:</span>
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
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 text-right">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-right text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              اسم المستخدم (Username)
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pl-10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="admin"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              كلمة المرور (Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-300 absolute right-3 top-3"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>تسجيل الدخول إلى لوحة الإدارة</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <button
            onClick={() => setView('landing')}
            className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 transition-colors"
          >
            <span>العودة للصفحة الرئيسية</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { AppView } from '../types';
import { BrandLogo } from './BrandLogo';
import {
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Activity,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { state, setView } = useAppStore();

  const navLinks: { view: AppView; label: string; icon: React.ReactNode; badge?: string; path?: string }[] = [
    {
      view: 'landing',
      label: 'الرئيسية',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      path: '/',
    },
    {
      view: 'onboarding',
      label: 'معالج الإعداد',
      icon: <Sparkles className="w-4 h-4 text-teal-400" />,
      badge: state.onboardingStep < 4 ? `خطوة ${state.onboardingStep}/4` : undefined,
    },
    {
      view: 'merchant_dashboard',
      label: 'لوحة التاجر',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      view: 'storefront_chat',
      label: 'شات المتجر والسلة',
      icon: <MessageCircle className="w-4 h-4 text-emerald-400" />,
      badge: state.cart.length > 0 ? `${state.cart.length}` : undefined,
    },
    {
      view: 'plans',
      label: 'الباقات والأسعار',
      icon: <CreditCard className="w-4 h-4" />,
    },
  ];

  const handleNavClick = (view: AppView, path?: string) => {
    setView(view);
    if (typeof window !== 'undefined' && path) {
      window.history.pushState(null, '', path);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050B0D]/95 backdrop-blur-md border-b border-emerald-950/40 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Official 360Resala Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('landing', '/')}
            className="focus:outline-none transition-transform hover:opacity-95"
          >
            <BrandLogo size="md" />
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = state.currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view, link.path)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions and Live Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Webhook: متصل ومفعل</span>
          </div>

          <button
            onClick={() => setView('storefront_chat')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>تجربة الشات المباشر</span>
          </button>
        </div>
      </div>
    </header>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { AppView } from '../types';
import {
  MessageSquareCode,
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  ExternalLink,
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
      label: 'معالج الموظف الذكي',
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
      view: 'super_admin',
      label: 'لوحة الإدارة (/admin)',
      icon: <ShieldCheck className="w-4 h-4 text-sky-400" />,
      path: '/admin',
    },
    {
      view: 'plans',
      label: 'الخطط والاشتراكات',
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
    <header className="sticky top-0 z-40 bg-[#0B1416]/95 backdrop-blur-md border-b border-emerald-950/40 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single element Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('landing', '/')}
            className="flex items-center gap-2.5 text-right group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <MessageSquareCode className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent">
                  Chat&Cart
                </span>
                <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">
                التجارة التحادثية والموظف الذكي
              </p>
            </div>
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
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
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

        {/* Zone 3: Primary Actions and Quick Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setView('storefront_chat')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-xs hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20 whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>تجربة الشات المباشر</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </button>

          <div className="hidden sm:flex items-center gap-2 border-r border-slate-800 pr-3 mr-1">
            <div className="text-left text-xs">
              <div className="font-semibold text-slate-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{state.merchant.businessName}</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {state.merchant.currentPlanId === 'trial'
                  ? 'باقة تجريبية (14 يوم)'
                  : state.merchant.currentPlanId === 'pro'
                  ? 'باقة النمو Pro'
                  : 'باقة مخصصة'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

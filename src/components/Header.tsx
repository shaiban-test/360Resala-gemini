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
  CreditCard,
  MessageCircle,
  UserCheck,
  LogOut,
  LogIn,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { state, setView, logoutMerchant } = useAppStore();

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
    // If merchant clicks on merchant dashboard and is not logged in, take them to auth page
    if (view === 'merchant_dashboard' && !state.isMerchantAuthenticated) {
      setView('merchant_auth');
      return;
    }

    setView(view);
    if (typeof window !== 'undefined' && path) {
      window.history.pushState(null, '', path);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050B0D]/95 backdrop-blur-md border-b border-emerald-950/40 text-slate-100 font-['Cairo',sans-serif]">
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
            const isActive =
              state.currentView === link.view ||
              (link.view === 'merchant_dashboard' && state.currentView === 'merchant_auth');
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

        {/* Zone 3: Primary Actions and Merchant Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Merchant Status Badge */}
          {state.isMerchantAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-200 font-semibold max-w-[120px] truncate">
                {state.merchant.businessName}
              </span>
              <button
                onClick={logoutMerchant}
                title="تسجيل خروج التاجر"
                className="text-slate-400 hover:text-rose-400 transition-colors mr-1 p-0.5"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setView('merchant_auth')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>دخول التاجر</span>
            </button>
          )}

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

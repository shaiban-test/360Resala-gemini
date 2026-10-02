/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { OnboardingWizard } from './components/OnboardingWizard';
import { MerchantDashboard } from './components/MerchantDashboard';
import { SuperAdminView } from './components/SuperAdminView';
import { AdminLogin } from './components/AdminLogin';
import { PlansView } from './components/PlansView';
import { StorefrontChatView } from './components/StorefrontChatView';

export default function App() {
  const { state, setView } = useAppStore();

  // Listen to browser URL path on load and popstate
  useEffect(() => {
    const handleUrlPath = () => {
      const path = window.location.pathname;
      if (path === '/admin' || path.startsWith('/admin/')) {
        setView('super_admin');
      } else if (path === '/' && state.currentView === 'super_admin') {
        // stay unless clicked
      }
    };

    handleUrlPath();
    window.addEventListener('popstate', handleUrlPath);
    return () => window.removeEventListener('popstate', handleUrlPath);
  }, []);

  return (
    <div className="min-h-screen bg-[#070E10] text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      {/* Top Bar Navigation */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1">
        {state.currentView === 'landing' && <LandingPage />}
        {state.currentView === 'onboarding' && <OnboardingWizard />}
        {state.currentView === 'merchant_dashboard' && <MerchantDashboard />}
        {state.currentView === 'super_admin' && (
          state.isAdminAuthenticated ? <SuperAdminView /> : <AdminLogin />
        )}
        {state.currentView === 'plans' && <PlansView />}
        {state.currentView === 'storefront_chat' && <StorefrontChatView />}
      </main>
    </div>
  );
}

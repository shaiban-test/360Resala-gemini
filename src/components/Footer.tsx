/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { BrandLogo } from './BrandLogo';
import {
  ShieldCheck,
  CreditCard,
  Mail,
  MapPin,
  Lock,
  ExternalLink,
  MessageCircle,
  Activity,
  ArrowUpRight,
  Heart,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { WebhookInspectorModal } from './WebhookInspectorModal';

export const Footer: React.FC = () => {
  const { setView } = useAppStore();
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

  return (
    <footer className="bg-[#030708] border-t border-emerald-950/60 text-slate-400 font-['Cairo',sans-serif] text-xs relative overflow-hidden">
      {/* Decorative Top Glow Bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-900 text-right">
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <BrandLogo size="lg" />
            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              المنصة السعودية والخليجية الرائدة لأتمتة محادثات واتساب والموظف الذكي 360 درجة. تحويل المحادثات إلى مبيعات مؤكدة، حجز المواعيد آلياً، وسداد فوري عبر مدى و Apple Pay.
            </p>

            {/* Meta Partner Badge */}
            <div className="p-3 rounded-2xl bg-[#071317] border border-emerald-500/20 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-200 text-xs">Meta Business Solution Provider</div>
                <div className="text-[10px] text-emerald-400">ربط سحابي موثق ومعتمد من Meta Cloud API</div>
              </div>
            </div>

            {/* Contact quick info */}
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>المملكة العربية السعودية - الرياض</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="font-mono">contact@360services.org</span>
              </div>
            </div>
          </div>

          {/* Col 2: Solutions & Capabilities (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>الحلول والقدرات</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => setView('storefront_chat')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>الموظف الذكي بمختلف اللهجات</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView('merchant_dashboard')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>حجز وتأكيد المواعيد التلقائي</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView('merchant_dashboard')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>بوابات دفع مدى و Apple Pay الفورية</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView('merchant_dashboard')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>استعادة السلات المتروكة بكوبونات خصم</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView('merchant_dashboard')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>حملات البرودكاست المعتمدة من ميتا</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span>روابط سريعة</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button onClick={() => setView('landing')} className="hover:text-emerald-400 transition-colors">
                  الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => setView('onboarding')} className="hover:text-emerald-400 transition-colors">
                  معالج إعداد الموظف الذكي
                </button>
              </li>
              <li>
                <button onClick={() => setView('plans')} className="hover:text-emerald-400 transition-colors">
                  الخطط والاشتراكات
                </button>
              </li>
              <li>
                <button onClick={() => setView('storefront_chat')} className="hover:text-emerald-400 transition-colors">
                  شات المتجر والسلة
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsWebhookModalOpen(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <Activity className="w-3 h-3 animate-pulse" />
                  <span>فاحص الويب هوك (Webhook)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Payment Standards (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              <span>الأمان والموثوقية</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              متوافق مع المعايير الأمنية للبنك المركزي السعودي (SAMA) وتشفير بيانات SSL 256-bit، مع ضمان استقرار الخوادم بنسبة 99.9%.
            </p>

            {/* Payment Icons */}
            <div className="pt-2">
              <span className="text-[10px] text-slate-500 block mb-2 font-semibold">بوابات ووسائل الدفع المدعومة:</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold text-[11px] font-['Plus_Jakarta_Sans',sans-serif]">
                   Apple Pay
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-extrabold text-[10px]">
                  mada مدى
                </span>
                <span className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono">
                  Moyasar
                </span>
                <span className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono">
                  Tap Payments
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Subtle Admin Entry */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <span>جميع الحقوق محفوظة © 2026 منصة</span>
            <strong className="text-slate-300 font-semibold">360Resala</strong>
            <span>• صُنعت لرواد التجارة الذكية في السعودية والخليج العربي</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setView('super_admin');
                if (typeof window !== 'undefined') {
                  window.history.pushState(null, '', '/admin');
                }
              }}
              className="text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3 h-3 text-slate-500" />
              <span>بوابة الإدارة المركزية (/admin)</span>
            </button>

            <span>·</span>
            <span>اتفاقية الاستخدام</span>
            <span>·</span>
            <span>سياسة الخصوصية</span>
          </div>
        </div>
      </div>

      {/* Webhook Inspector Modal */}
      <WebhookInspectorModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
      />
    </footer>
  );
};

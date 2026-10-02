/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { SUBSCRIPTION_PLANS } from '../data/constants';
import { Check, Sparkles, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';

export const PlansView: React.FC = () => {
  const { state, selectPlan } = useAppStore();

  return (
    <div className="min-h-screen bg-[#070E10] text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خطط واشتراكات مرنة تناسب حجم أعمالك</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            وظّف أذكى مساعد مبيعات لواتساب ومتجرك اليوم
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            ابدأ بتجربة مجانية مدتها 14 يوماً مع كافة إمكانيات اللهجات وسلة الشراء والربط السريع عبر QR Code أو حساب WABA السحابي المعتمد.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = state.merchant.currentPlanId === plan.id;
            const isPro = plan.id === 'pro';

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative border ${
                  isPro
                    ? 'bg-gradient-to-b from-[#13262A] to-[#0D181A] border-emerald-400 shadow-2xl shadow-emerald-500/20'
                    : 'bg-[#0D181A] border-emerald-950/80 hover:border-emerald-500/40'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] shadow-md uppercase tracking-wider">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-white">{plan.nameAr}</h3>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        باقتك الحالية
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    {plan.descriptionAr}
                  </p>

                  <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-slate-800">
                    <span className="text-3xl font-extrabold text-white font-mono">
                      {plan.priceMonthly === 0 ? 'مجاناً' : plan.priceMonthly}
                    </span>
                    {plan.priceMonthly > 0 && (
                      <span className="text-xs text-slate-400">
                        {plan.currency} / شهرياً
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-8 text-xs text-slate-300">
                    <span className="font-semibold text-slate-400 text-[11px] block">
                      المزايا المتضمنة:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => selectPlan(plan.id)}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    isPro
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-[#122226] hover:bg-[#162c31] text-white border border-slate-700'
                  }`}
                >
                  <span>{isCurrent ? 'متابعة إعداد الموظف الذكي' : 'اختيار هذه الخطة والبدء'}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="p-6 rounded-2xl bg-[#0D181A] border border-emerald-950/80 flex flex-col sm:flex-row items-center justify-around gap-6 text-center sm:text-right">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-white">موفر خدمات معتمد من ميتا</h4>
              <p className="text-xs text-slate-400">ربط سحابي آمن WABA عبر تقنية Embedded Signup</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-white">ردود فورية بأسرع ذكاء اصطناعي</h4>
              <p className="text-xs text-slate-400">مدعوم بـ Google Gemini 3.8 Flash لخدمة عملائك في أجزاء من الثانية</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

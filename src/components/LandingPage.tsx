/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Sparkles,
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Zap,
  Bot,
  QrCode,
  DollarSign,
  TrendingUp,
  ChevronDown,
  Globe,
  Activity,
  CreditCard,
  Send,
  MessageCircle,
} from 'lucide-react';
import { DIALECTS, SUBSCRIPTION_PLANS } from '../data/constants';
import { DialectCode } from '../types';
import { BrandLogo } from './BrandLogo';
import { WebhookInspectorModal } from './WebhookInspectorModal';
import { Footer } from './Footer';

export const LandingPage: React.FC = () => {
  const { setView, updateAIEmployee, state } = useAppStore();
  const [demoDialect, setDemoDialect] = useState<DialectCode>('sa');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

  const currentDialectInfo = DIALECTS.find((d) => d.code === demoDialect) || DIALECTS[0];

  const handleStartOnboarding = () => {
    setView('onboarding');
  };

  const handleTryChat = () => {
    updateAIEmployee({ dialect: demoDialect });
    setView('storefront_chat');
  };

  const faqs = [
    {
      q: 'كيف يعمل الويب هوك الحقيقي للواتساب في 360Resala؟',
      a: 'المنصة مزودة برابط ويب هوك رسمي جاهز (https://360resala-gemini.free-temp.eu.org/api/webhooks/whatsapp) يستقبل رسائل وتفاعلات العملاء من خوادم Meta Cloud API فورياً، ويمررها للموظف الذكي ليرد بلهجة متجرك ويرسل روابط الدفع.',
    },
    {
      q: 'كيف يدفع العميل داخل محادثة الواتساب عبر مدى و Apple Pay؟',
      a: 'بمجرد أن يؤكد العميل رغبته في شراء منتج أو حجز موعد، يرسل الموظف الذكي رابط دفع فوري ومباشر متصل ببوابات الدفع (Moyasar أو Tap Payments)، يدعم بنقرة واحدة سداد مدى أو Pay أو البطاقات البنكية.',
    },
    {
      q: 'هل يمكنني إرسال رسائل جماعية وحملات تسويقية (Broadcast)؟',
      a: 'نعم! تتيح 360Resala إطلاق حملات البرودكاست المعتمدة من ميتا لقاعدة عملائك، وجدولة رسائل التذكير التلقائية للسلات المتروكة مع كوبونات خصم لتحفيز الشراء.',
    },
    {
      q: 'هل يتطلب ربط الواتساب هاتفاً مفتوحاً طوال الوقت؟',
      a: 'الربط السحابي عبر Meta Cloud API يعمل 24/7 دون الحاجة لأي هاتف أو اتصال إنترنت خاص بك. كما نوفر خيار ربط مساند عبر QR Code للأجهزة الإضافية.',
    },
  ];

  return (
    <div className="bg-[#050B0D] text-slate-100 font-['Cairo',sans-serif] selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-28">
        {/* Subtle glow backdrop */}
        <div className="absolute top-1/4 right-1/2 translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left/Right Text Content (RTL) */}
            <div className="lg:col-span-7 space-y-6 text-right">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>المنصة الأولى لأتمتة وتجارة واتساب 360° في الخليج</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.2] tracking-tight">
                حوّل محادثات واتساب إلى{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  مبيعات فورية وحجوزات مؤكدة
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                وفّر موظف مبيعات وحجوزات ذكي على مدار الساعة في <strong>360Resala</strong>، يتحدث بلهجة عميلك، يقترح المنتجات بذكاء، يضيف للسلة تلقائياً، ويصدر روابط الدفع الفوري لـ <strong>مدى و Apple Pay</strong> المباشر عبر واتساب.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleStartOnboarding}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>ابدأ تجربتك المجانية مع 360Resala</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleTryChat}
                  className="px-5 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 font-semibold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>تجربة الشات المباشر الآن</span>
                </button>

                <button
                  onClick={() => setIsWebhookModalOpen(true)}
                  className="px-4 py-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 font-semibold text-xs flex items-center gap-2 transition-all"
                >
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>فاحص الويب هوك (Meta Webhook)</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ربط رسمي مع Meta</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>مدى و Apple Pay</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>10+ لهجات عربية</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>ردود فورية بالذكاء الاصطناعي</span>
                </div>
              </div>
            </div>

            {/* Interactive Dialect & Bot Demo Card (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-[#081518]/90 border border-emerald-500/30 p-5 sm:p-6 shadow-2xl shadow-emerald-950/80 backdrop-blur-xl">
                {/* Header of Chat Mockup */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-lg">
                        👩‍💼
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#081518]"></span>
                    </div>
                    <div className="text-right">
                      <h4 className="text-sm font-bold text-white">سارة - موظفة 360Resala الذكية</h4>
                      <p className="text-[11px] text-emerald-400">
                        {currentDialectInfo.flag} {currentDialectInfo.label}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    أتمتة 360°
                  </span>
                </div>

                {/* Messages stream */}
                <div className="py-4 space-y-3 text-xs text-right">
                  <div className="flex justify-end">
                    <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-none px-3.5 py-2.5 max-w-[80%] shadow-sm">
                      مرحبا، أبي عطر فخم للمناسبات وثابت، وش ترشح لي؟
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3 max-w-[90%] space-y-2.5 shadow-sm">
                      <p className="text-slate-200 leading-relaxed">
                        {demoDialect === 'sa'
                          ? 'يا هلا والله! حيّاك 🌿 أرشح لك عطر الفخامة الملكي (دهن عود كمبودي وورد طائفي)، ثباته 48 ساعة وأكثر عطورنا طلباً!'
                          : demoDialect === 'eg'
                          ? 'أهلاً بحضرتك يا فندم! أرشح لك عطر الفخامة الملكي بالعود والورد الطائفي، ثباته عالي جداً وعليه خصم خاص اليوم!'
                          : demoDialect === 'ae'
                          ? 'مرحبا الساع طال عمرك! فالك طيب، عطر الفخامة الملكي بالعود الكمبودي والورد الطائفي قمة بالثبات والتميز!'
                          : 'أهلاً بك! نرشح لك عطر الفخامة الملكي الفاخر بتركيبة دهن العود الكمبودي والورد الطائفي مع ثبات يدوم طويلاً.'}
                      </p>

                      {/* Mini Product Card Inside Chat */}
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/20 flex items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-100 text-[11px]">عطر الفخامة الملكي 100 مل</div>
                          <div className="text-[10px] text-slate-400">توصيل سريع مجاني</div>
                        </div>
                        <div className="text-left font-['Plus_Jakarta_Sans',sans-serif]">
                          <span className="font-black text-emerald-400 text-sm">290</span>{' '}
                          <span className="text-[10px] text-slate-400">ر.س</span>
                        </div>
                      </div>

                      {/* Instant Payment Badge */}
                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
                        <span>سداد فوري متاح:</span>
                        <div className="flex items-center gap-1 text-emerald-300 font-semibold">
                          <span>mada مدى</span>
                          <span>·</span>
                          <span>Pay</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dialect Switcher in demo */}
                <div className="pt-3 border-t border-slate-800">
                  <div className="text-[11px] text-slate-400 mb-2 font-medium">جرّب نبرة الرد باللهجات المختلفة:</div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { code: 'sa', label: '🇸🇦 سعودي' },
                      { code: 'ae', label: '🇦🇪 إماراتي' },
                      { code: 'kw', label: '🇰🇼 كويتي' },
                      { code: 'eg', label: '🇪🇬 مصري' },
                    ].map((d) => (
                      <button
                        key={d.code}
                        onClick={() => setDemoDialect(d.code as DialectCode)}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all ${
                          demoDialect === d.code
                            ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 CORE ADVANTAGES SECTION */}
      <section className="py-16 bg-[#081215] border-y border-emerald-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              لماذا تختار منصة <span className="text-emerald-400">360Resala</span>؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              بنية تحتية متطورة تدمج الذكاء الاصطناعي مع حلول الدفع والتسويق لرفع مبيعاتك 360 درجة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all text-right group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">موظف مبيعات ذكي 24/7</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                يفهم اللهجات الخليجية والعربية بطلاقة، يجيب فورياً، ويقترح المنتجات المناسبة لحاجة العميل وينهي الطلب.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition-all text-right group">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">بوابات دفع مدى و Apple Pay</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                توليد فواتير سداد فورية عبر Moyasar و Tap Payments مباشرة داخل المحادثة بضمان أعلى معدلات إتمام الشراء.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 transition-all text-right group">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">حجز وتأكيد المواعيد آلياً</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                للعيادات، الصالونات، وشركات الصيانة والتنظيف: اختيار الفترات الزمنية المتاحة وتأكيد الحجز وتذكير العميل عبر واتساب.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all text-right group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">استعادة السلات وحملات البرودكاست</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                محرك ذكي يرصد السلات المتروكة ويرسل عروضاً مخصصة لاسترجاعها، بالإضافة لحملات تسويقية مجدولة لقاعدة عملائك.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANS & PRICING PREVIEW */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              باقات تناسب جميع مراحل نمو نشاطك
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              ابدأ تجربتك المجانية لمدة 14 يوماً بدون بطاقة ائتمانية وقم بالترقية عند التوسع
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all ${
                  plan.id === 'pro'
                    ? 'bg-gradient-to-b from-[#0e2429] to-[#071317] border-2 border-emerald-400 shadow-xl shadow-emerald-950/60'
                    : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px]">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <div className="text-right">
                    <h3 className="text-xl font-bold text-white">{plan.nameAr}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">{plan.name}</p>
                  </div>

                  <div className="my-5 text-right font-['Plus_Jakarta_Sans',sans-serif]">
                    <span className="text-3xl sm:text-4xl font-black text-white">{plan.priceMonthly}</span>
                    <span className="text-xs text-slate-400 font-semibold mr-1.5">{plan.currency} / شهرياً</span>
                  </div>

                  <p className="text-xs text-slate-300 mb-6 text-right leading-relaxed">
                    {plan.descriptionAr}
                  </p>

                  <div className="space-y-2.5 text-right mb-6 text-xs text-slate-300">
                    {plan.features.slice(0, 5).map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setView('plans');
                  }}
                  className={`w-full py-3 rounded-2xl font-bold text-xs transition-all ${
                    plan.id === 'pro'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/25 hover:brightness-110'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  اختر {plan.nameAr}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 bg-[#081215] border-t border-emerald-950/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">الأسئلة الشائعة</h2>
            <p className="text-xs text-slate-400 mt-1">كل ما تحتاج لمعرفته حول تشغيل وربط 360Resala</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden text-right"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 flex items-center justify-between text-right text-sm font-bold text-slate-100 hover:text-emerald-400 transition-colors"
                  >
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-400' : ''
                      }`}
                    />
                    <span>{faq.q}</span>
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RICH SAAS FOOTER */}
      <Footer />

      {/* Webhook Inspector Modal */}
      <WebhookInspectorModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
      />
    </div>
  );
};

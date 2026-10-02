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
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import { DIALECTS, SUBSCRIPTION_PLANS } from '../data/constants';
import { DialectCode } from '../types';

export const LandingPage: React.FC = () => {
  const { setView, updateAIEmployee, state } = useAppStore();
  const [demoDialect, setDemoDialect] = useState<DialectCode>('sa');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
      q: 'هل يتطلب ربط الواتساب هاتفاً مفتوحاً طوال الوقت؟',
      a: 'إذا قمت بالربط عبر Meta Embedded Signup الرسمي، فإن الخدمة تعمل سحابياً بنسبة 100% دون الحاجة إلى تشغيل أي هاتف أو كمبيوتر. أما في خيار QR Code، فيتم الاتصال كجهاز مرتبط إضافي.',
    },
    {
      q: 'كيف يفهم الموظف الذكي اللهجات العامية؟',
      a: 'تم تدريب محرك الذكاء الاصطناعي بنماذج Google Gemini 3.8 Flash المتقدمة لتمييز مفردات ولهجات الخليج (السعودية، الإمارات، الكويت، قطر) ومصر والشام وفهم نية العميل بالعامية سواء رغب في الاستفسار أو الشراء أو حجز موعد.',
    },
    {
      q: 'هل يمكنني التدخل البشري والرد على العميل بنفسي؟',
      a: 'نعم، بكل سهولة! توفر لوحة التاجر زراً للتدخل البشري (Human Takeover)، عند تفعيله يتوقف الذكاء الاصطناعي فوراً في تلك المحادثة لتتمكن من الرد يدوياً.',
    },
    {
      q: 'كيف تتم عملية الدفع داخل المحادثة؟',
      a: 'ينشئ الموظف الذكي بطاقة ملخص السلة ورابط دفع إلكتروني مباشر يدعم مدى، أبل باي، والبطاقات الائتمانية، أو خيار الدفع عند الاستلام، ويتم تسجيل الطلب وتحديث المخزون فورياً.',
    },
  ];

  return (
    <div className="bg-[#070E10] text-slate-100 font-['Cairo',sans-serif] selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle glow backdrop */}
        <div className="absolute top-1/4 right-1/2 translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left/Right Text Content (RTL) */}
            <div className="lg:col-span-7 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>المنصة الأولى للتجارة التحادثية والموظف الذكي في الخليج</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.2] tracking-tight">
                حوّل محادثات واتساب إلى{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                  مبيعات فورية
                </span>{' '}
                وحجوزات مؤكدة
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                وفّر موظف مبيعات ذكي يعمل على مدار الساعة، يتحدث بلهجة عميلك، يقترح المنتجات بذكاء، يضيف للسلة تلقائياً، ويصدر روابط الدفع المباشر عبر واتساب المعتمد.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleStartOnboarding}
                  className="px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-xl shadow-emerald-500/25 flex items-center gap-2 group"
                >
                  <span>ابدأ تجربتك المجانية (14 يوماً)</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleTryChat}
                  className="px-6 py-3.5 bg-[#102023] hover:bg-[#14292d] border border-emerald-500/40 text-emerald-300 font-bold text-sm rounded-xl transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>تجربة الشات المباشر الآن</span>
                </button>
              </div>

              {/* Trust Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">0.8 ثانية</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">سرعة الرد التلقائي</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">28.4%</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">معدل تحويل للمبيعات</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-sky-400 font-mono">Meta Tech</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">شريك معتمد WABA</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl bg-[#0D181A] border border-emerald-900/60 p-4 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
                {/* Chat Mockup Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-300 text-lg flex items-center justify-center font-bold">
                      👩‍💼
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>سارة - الموظف الذكي</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        {currentDialectInfo.flag} {currentDialectInfo.label}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                    تجارة تحادثية
                  </span>
                </div>

                {/* Conversation bubbles */}
                <div className="space-y-3 text-xs">
                  {/* User message */}
                  <div className="flex flex-col items-end">
                    <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tl-none font-medium max-w-[85%] text-right">
                      مرحبا، أبي عطر فخم للمناسبات وثابت، وش ترشح لي؟
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 font-mono">10:02 ص</span>
                  </div>

                  {/* Bot reply with dialect and inline product card */}
                  <div className="flex flex-col items-start">
                    <div className="bg-[#122226] border border-emerald-950/80 text-slate-100 p-3.5 rounded-2xl rounded-tr-none max-w-[90%] text-right space-y-2">
                      <p className="leading-relaxed">
                        يا هلا والله! حيّاك 🌿 أرشح لك عطر الفخامة الملكي (دهن عود كمبودي وورد طائفي)، ثباته 48 ساعة وأكثر عطورنا طلباً!
                      </p>

                      {/* In-chat interactive card */}
                      <div className="p-2.5 rounded-xl bg-[#091416] border border-emerald-500/30 text-right">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-[11px]">عطر الفخامة الملكي 100 مل</span>
                          <span className="text-emerald-400 font-mono font-bold text-xs">290 ر.س</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
                          <span className="text-[10px] text-slate-400">توصيل سريع مجاني</span>
                          <button
                            onClick={handleTryChat}
                            className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-[10px]"
                          >
                            + إضافة للسلة
                          </button>
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 font-mono">10:03 ص</span>
                  </div>
                </div>

                {/* Quick Interactive Dialect Switcher in Hero */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1.5 font-semibold">
                    جرّب نبرة الرد باللهجات المختلفة:
                  </span>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { code: 'sa', flag: '🇸🇦', name: 'سعودي' },
                      { code: 'ae', flag: '🇦🇪', name: 'إماراتي' },
                      { code: 'kw', flag: '🇰🇼', name: 'كويتي' },
                      { code: 'eg', flag: '🇪🇬', name: 'مصري' },
                    ].map((d) => (
                      <button
                        key={d.code}
                        onClick={() => setDemoDialect(d.code as any)}
                        className={`p-1.5 rounded-lg text-center text-[10px] transition-all border ${
                          demoDialect === d.code
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                            : 'bg-[#102023] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{d.flag} {d.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PILLARS & FEATURES SECTION */}
      <section className="py-16 bg-[#0B1517] border-y border-emerald-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              الميزات الاستثنائية
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              كل ما تحتاجه للتحول من محادثات تائهة إلى ماكينة مبيعات
            </h2>
            <p className="text-sm text-slate-400">
              حل متكامل يربط ذكاء المحادثة مع كتالوج منتجاتك ونظام الدفع وإدارة الطلبات في مكان واحد.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#0D181A] border border-emerald-950/80 hover:border-emerald-500/40 transition-colors space-y-3 text-right">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">فهم أصيل لـ 12 لهجة عربية</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                لا ردود جامدة بعد اليوم! موظفك الذكي يتحدث بالنجدي، الحجازي، الإماراتي، الكويتي، المصري، والشامي كما لو كان موظفاً محلياً من فريقك.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#0D181A] border border-emerald-950/80 hover:border-emerald-500/40 transition-colors space-y-3 text-right">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">سلة تسوق ودفع داخل الشات</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                بطاقات المنتجات تظهر بتفاعلية داخل المحادثة مع زر "أضف للسلة" ورابط دفع مباشر مع مدى و Apple Pay لإنهاء الشراء دون خروج العميل.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#0D181A] border border-emerald-950/80 hover:border-emerald-500/40 transition-colors space-y-3 text-right">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Meta Tech Provider & QR Code</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                نوفر خيارين: ربط سحابي معتمد WABA عبر برنامج موفري الحلول من ميتا (Embedded Signup)، أو ربط فوري بمسح رمز QR Code في 10 ثوانٍ.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#0D181A] border border-emerald-950/80 hover:border-emerald-500/40 transition-colors space-y-3 text-right">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">تدخل بشري فوري (Human Takeover)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تحكّم كامل في أي لحظة. يمكنك إيقاف الذكاء الاصطناعي بنقرة واحدة والرد بنفسك على العميل من لوحة التحكم، ثم إعادة التفعيل.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-[#0D181A] border border-emerald-950/80 hover:border-emerald-500/40 transition-colors space-y-3 text-right">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">حجز المواعيد والخدمات</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                مثالي للصالونات، العيادات، خدمات الصيانة، والتنظيف المنزلي؛ حيث يقوم الموظف الذكي باقتراح الأوقات المتاحة وحجزها وتأكيدها.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-[#0D181A] border border-emerald-950/80 hover:border-emerald-500/40 transition-colors space-y-3 text-right">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">استعادة السلات المتروكة</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                إرسال تذكيرات تلقائية ذكية عبر واتساب للعملاء الذين بدأوا المحادثة ولم يكملوا الطلب مع كود خصم تشجيعي لزيادة المبيعات.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              بساطة وسرعة الإطلاق
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              انطلق في 3 خطوات سهلة لا تتجاوز دقيقة واحدة
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
            <div className="p-6 rounded-2xl bg-[#0D181A] border border-slate-800 space-y-3 relative">
              <span className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-base flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-lg text-white">سجّل وحدد طبيعة نشاطك</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                اختر نوع متجرك (منتجات، خدمات، أو الاثنان معاً) وحدد دولتك وعملة حسابك بنقرة زر واحدة.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D181A] border border-slate-800 space-y-3 relative">
              <span className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 font-black text-base flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-lg text-white">خصّص لهجة موظفك الذكي</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                اختر اللهجة التي يفضلها عملاؤك من بين 12 لهجة وأضف خدماتك ومنتجاتك وأسئلتك المتكررة.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D181A] border border-slate-800 space-y-3 relative">
              <span className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 font-black text-base flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-lg text-white">اربط واتساب وابدأ البيع</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                امسح رمز QR Code بهاتفك أو اربط حساب WABA الرسمي عبر موفر خدمات ميتا، ليبدأ الموظف بالرد فورياً.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PLANS OVERVIEW */}
      <section className="py-16 bg-[#0B1517] border-y border-emerald-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              الأسعار والباقات
            </span>
            <h2 className="text-3xl font-extrabold text-white">خطط شفافة تبدأ بتجربة مجانية</h2>
            <p className="text-xs text-slate-400">
              اختر الخطة المناسبة لك وقم بترقية باقتك متى ما توسعت أعمالك.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-right">
            {SUBSCRIPTION_PLANS.map((p) => (
              <div
                key={p.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between ${
                  p.id === 'pro'
                    ? 'bg-[#122226] border-emerald-400 shadow-xl'
                    : 'bg-[#0D181A] border-slate-800'
                }`}
              >
                <div>
                  <h4 className="font-bold text-base text-white mb-1">{p.nameAr}</h4>
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-2xl font-black text-white font-mono">
                      {p.priceMonthly === 0 ? 'مجاناً' : p.priceMonthly}
                    </span>
                    {p.priceMonthly > 0 && (
                      <span className="text-xs text-slate-400">{p.currency} / شهرياً</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-4">{p.descriptionAr}</p>
                </div>
                <button
                  onClick={() => setView('plans')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  تفاصيل الخطة والاشتراك
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              الأسئلة الشائعة
            </span>
            <h2 className="text-3xl font-extrabold text-white">إجابات عن استفساراتك</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#0D181A] border border-slate-800 overflow-hidden text-right"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-emerald-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-emerald-400 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-16 bg-gradient-to-b from-[#0B1517] to-[#070E10] border-t border-emerald-950/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            جاهز لمضاعفة مبيعاتك عبر واتساب اليوم؟
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            انضم الآن لمئات المتاجر التي وفرت مئات الساعات وحولت زوارها إلى عملاء دائمين عبر الموظف الذكي.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handleStartOnboarding}
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-xl shadow-emerald-500/20"
            >
              ابدأ الآن بـ 60 ثانية مجاناً
            </button>
            <button
              onClick={handleTryChat}
              className="px-6 py-3.5 bg-[#122226] border border-slate-700 text-white font-semibold text-sm rounded-xl hover:bg-[#162c31]"
            >
              تجربة المحادثة والسلة
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-slate-900 bg-[#050B0C] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Chat&Cart AI</span>
            <span>• جميع الحقوق محفوظة © {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setView('plans')} className="hover:text-white">الخطط والأسعار</button>
            <button onClick={() => setView('onboarding')} className="hover:text-white">معالج الإعداد</button>
            <button onClick={() => setView('merchant_dashboard')} className="hover:text-white">لوحة التاجر</button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') window.history.pushState(null, '', '/admin');
                setView('super_admin');
              }}
              className="text-sky-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>لوحة الإدارة (/admin)</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

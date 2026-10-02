/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  NatureOfBusiness,
  PricingType,
  ServicePlace,
  DialectCode,
} from '../types';
import {
  DIALECTS,
  GOALS_LIST,
  NATURE_CATEGORIES,
} from '../data/constants';
import {
  Sparkles,
  ShoppingBag,
  Briefcase,
  Layers,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  QrCode,
  Smartphone,
  Globe,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Store,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  Copy,
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const {
    state,
    setOnboardingStep,
    updateMerchant,
    updateAIEmployee,
    addCatalogItem,
    setView,
    startQrSession,
    simulateQrScan,
    simulateMetaEmbeddedConnect,
    disconnectChannel,
  } = useAppStore();

  const step = state.onboardingStep;

  // Step 2 Form States
  const [businessName, setBusinessName] = useState(state.merchant.businessName);
  const [country, setCountry] = useState(state.merchant.country);
  const [currency, setCurrency] = useState(state.merchant.currency);
  const [timezone, setTimezone] = useState(state.merchant.timezone);
  const [primaryLang, setPrimaryLang] = useState<'ar' | 'en'>(state.aiEmployee.primaryLanguage);
  const [selectedDialect, setSelectedDialect] = useState<DialectCode>(state.aiEmployee.dialect);
  const [desc, setDesc] = useState(state.aiEmployee.businessDescription);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(state.aiEmployee.goals);

  // Step 3 Form States (Add Service/Product)
  const [itemName, setItemName] = useState('');
  const [pricingType, setPricingType] = useState<PricingType>('fixed');
  const [itemPrice, setItemPrice] = useState('180');
  const [deliveryPlace, setDeliveryPlace] = useState<ServicePlace>('customer_location');
  const [requiresBooking, setRequiresBooking] = useState(true);
  const [coverageAreas, setCoverageAreas] = useState('الرياض، جدة');
  const [workingHours, setWorkingHours] = useState('السبت - الخميس 9ص - 9م');
  const [itemDesc, setItemDesc] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [executionDeadline, setExecutionDeadline] = useState('خلال 24 ساعة');
  const [cancellationPolicy, setCancellationPolicy] = useState('إلغاء مجاني قبل 12 ساعة');
  const [humanHandoffRule, setHumanHandoffRule] = useState('عند طلب موعد طارئ خارج أوقات العمل');
  const [requiredFields, setRequiredFields] = useState<string[]>(['الاسم', 'الجوال', 'العنوان']);
  const [addedItemSuccess, setAddedItemSuccess] = useState(false);

  // Step 4 Channel Dialogs
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState('+966 50 123 4567');

  // Handle Goal toggle
  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  // AI Suggestion for description based on nature
  const suggestDescription = () => {
    const nature = state.merchant.natureOfBusiness;
    if (nature === 'products') {
      setDesc('متجر متخصص في بيع أجود أنواع العطور ومستحضرات العناية الأصلية، مع شحن سريع وتغليف فاخر لكافة مدن المملكة والخليج.');
    } else if (nature === 'services') {
      setDesc('شركة متخصصة في تقديم خدمات تنظيف المنازل، صيانة المكيفات، وغسيل السيارات المتنقل بحرفية عالية مع ضمان الرضا التام.');
    } else {
      setDesc('نقدم خدمات تنظيف المنازل وغسيل السيارات المتنقل مع حجز فوري عبر واتساب، بالإضافة إلى تشكيلة من منتجات العناية المنزلية والعطور الفاخرة.');
    }
  };

  // Handle nature selection
  const selectNature = (nature: NatureOfBusiness) => {
    updateMerchant({ natureOfBusiness: nature });
    setOnboardingStep(2);
  };

  // Save Step 2
  const handleSaveStep2 = () => {
    updateMerchant({
      businessName,
      country,
      currency,
      timezone,
    });
    updateAIEmployee({
      primaryLanguage: primaryLang,
      dialect: selectedDialect,
      businessDescription: desc,
      goals: selectedGoals,
    });
    setOnboardingStep(3);
  };

  // Save Step 3 (add item)
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    addCatalogItem({
      name: itemName,
      type: state.merchant.natureOfBusiness === 'products' ? 'product' : 'service',
      pricingType,
      price: Number(itemPrice) || 0,
      currency,
      deliveryPlace,
      requiresBooking,
      coverageAreas,
      workingHours,
      description: itemDesc || `خدمة ${itemName} مقدمة بأعلى جودة واحترافية.`,
      executionDeadline,
      cancellationPolicy,
      humanHandoffRule,
      requiredCustomerFields: requiredFields,
      inStock: true,
    });

    setItemName('');
    setItemDesc('');
    setAddedItemSuccess(true);
    setTimeout(() => setAddedItemSuccess(false), 3000);
  };

  // Skip onboarding directly to dashboard
  const handleSkipToDashboard = () => {
    setView('merchant_dashboard');
  };

  // WhatsApp Channel details
  const metaChannel = state.channels.find((c) => c.type === 'whatsapp_meta');
  const qrChannel = state.channels.find((c) => c.type === 'whatsapp_qr');
  const isAnyWhatsAppConnected =
    metaChannel?.status === 'connected' || qrChannel?.status === 'connected';

  return (
    <div className="min-h-screen bg-[#070E10] text-slate-100 py-8 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Subtle Grid Texture matching screenshots */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.15) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      ></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Onboarding Top Header with steps counter and skip button */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-emerald-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
              {step}/4
            </div>
            <div>
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                {step === 1 && 'نوع النشاط'}
                {step === 2 && 'أساسيات الموظف الذكي'}
                {step === 3 && 'الخدمات والمنتجات'}
                {step === 4 && 'ربط القنوات'}
              </span>
              <p className="text-sm font-bold text-slate-200">
                {step === 1 && 'بقي 3 خطوات للإطلاق'}
                {step === 2 && 'بقي خطوتان فقط'}
                {step === 3 && 'الخطوة قبل الأخيرة'}
                {step === 4 && 'الخطوة الأخيرة - ربط القناة'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSkipToDashboard}
              className="text-xs text-slate-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-emerald-500/40 transition-colors flex items-center gap-1.5"
            >
              <span>تخطي الآن والدخول للوحة التحكم</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => setOnboardingStep(s)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-10 bg-emerald-400 shadow-md shadow-emerald-500/30'
                  : s < step
                  ? 'w-6 bg-emerald-700'
                  : 'w-4 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: NATURE OF BUSINESS (الصورة 6) */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto bg-[#0D181A]/95 border border-emerald-900/40 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Store className="w-6 h-6" />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                أهلاً {state.merchant.ownerName} 👋 شو طبيعة شغلك؟
              </h1>
              <p className="text-sm text-slate-400">
                نختار المسار الصحيح لموظفك الذكي – تقدر تغيّره لاحقاً.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Option 1: Products */}
              <button
                onClick={() => selectNature('products')}
                className={`p-5 rounded-xl text-right transition-all border group relative flex flex-col justify-between ${
                  state.merchant.natureOfBusiness === 'products'
                    ? 'bg-emerald-500/15 border-emerald-400 shadow-lg shadow-emerald-500/10'
                    : 'bg-[#102023]/60 border-emerald-950/60 hover:border-emerald-500/40 hover:bg-[#13262A]'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white mb-1">أبيع منتجات</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    سلع ملموسة تُعرض وتُشحن أو تُستلم.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                  {NATURE_CATEGORIES.products.items.map((it) => (
                    <span
                      key={it}
                      className="text-[10px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </button>

              {/* Option 2: Services */}
              <button
                onClick={() => selectNature('services')}
                className={`p-5 rounded-xl text-right transition-all border group relative flex flex-col justify-between ${
                  state.merchant.natureOfBusiness === 'services'
                    ? 'bg-emerald-500/15 border-emerald-400 shadow-lg shadow-emerald-500/10'
                    : 'bg-[#102023]/60 border-emerald-950/60 hover:border-emerald-500/40 hover:bg-[#13262A]'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white mb-1">أقدم خدمات</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    خدمات يحجزها العميل أو يستفسر عنها.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                  {NATURE_CATEGORIES.services.items.slice(0, 6).map((it) => (
                    <span
                      key={it}
                      className="text-[10px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </button>

              {/* Option 3: Both */}
              <button
                onClick={() => selectNature('both')}
                className={`p-5 rounded-xl text-right transition-all border group relative flex flex-col justify-between ${
                  state.merchant.natureOfBusiness === 'both'
                    ? 'bg-emerald-500/15 border-emerald-400 shadow-lg shadow-emerald-500/10'
                    : 'bg-[#102023]/60 border-emerald-950/60 hover:border-emerald-500/40 hover:bg-[#13262A]'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white mb-1">منتجات وخدمات</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    الاثنان معاً – تبيع سلعاً وتقدم خدمات.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                  {NATURE_CATEGORIES.both.items.map((it) => (
                    <span
                      key={it}
                      className="text-[10px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </button>
            </div>

            <div className="text-center text-xs text-slate-400">
              بمجرد اختيارك تنتقل تلقائياً للخطوة التالية.
            </div>
          </div>
        )}

        {/* STEP 2: SETUP SMART EMPLOYEE (الصور 1 و 5) */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto bg-[#0D181A]/95 border border-emerald-900/40 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                خلّينا نجهّز موظفك الذكي
              </h1>
              <p className="text-sm text-slate-400">
                أساسيات سريعة عن نشاطك – دقيقة وحدة وخلصنا.
              </p>
            </div>

            <div className="space-y-6">
              {/* Business Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  اسم النشاط التجاري
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="مثال: 360services"
                  className="w-full bg-[#102023] border border-emerald-950/80 focus:border-emerald-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              {/* Country & Currency Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">الدولة</label>
                  <select
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      if (e.target.value === 'السعودية') setCurrency('SAR');
                      if (e.target.value === 'الإمارات') setCurrency('AED');
                      if (e.target.value === 'الكويت') setCurrency('KWD');
                      if (e.target.value === 'مصر') setCurrency('EGP');
                    }}
                    className="w-full bg-[#102023] border border-emerald-950/80 focus:border-emerald-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  >
                    <option value="السعودية">المملكة العربية السعودية</option>
                    <option value="الإمارات">الإمارات العربية المتحدة</option>
                    <option value="الكويت">الكويت</option>
                    <option value="قطر">قطر</option>
                    <option value="الأردن">الأردن</option>
                    <option value="مصر">مصر</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">عملة الحساب</label>
                    <span className="text-[11px] text-emerald-400 font-mono">{currency}</span>
                  </div>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-[#102023] border border-emerald-950/80 focus:border-emerald-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  >
                    <option value="SAR">SAR (ريال سعودي)</option>
                    <option value="AED">AED (درهم إماراتي)</option>
                    <option value="KWD">KWD (دينار كويتي)</option>
                    <option value="QAR">QAR (ريال قطري)</option>
                    <option value="EGP">EGP (جنيه مصري)</option>
                    <option value="USD">USD (دولار أمريكي)</option>
                  </select>
                </div>
              </div>

              {/* Timezone & Primary Language Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">المنطقة الزمنية</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-[#102023] border border-emerald-950/80 focus:border-emerald-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    لغة العملاء الأساسية
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPrimaryLang('ar')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        primaryLang === 'ar'
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-[#102023] text-slate-300 border border-emerald-950/60 hover:bg-[#14292d]'
                      }`}
                    >
                      العربية
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrimaryLang('en')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        primaryLang === 'en'
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-[#102023] text-slate-300 border border-emerald-950/60 hover:bg-[#14292d]'
                      }`}
                    >
                      الإنجليزية
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    يجاوب بلغة العميل تلقائياً، وهذه لغته الغالبة.
                  </p>
                </div>
              </div>

              {/* Dialect Flags Grid (الصورة 1 و 5) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  لهجة موظفك الذكي
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {DIALECTS.map((d) => {
                    const isSelected = selectedDialect === d.code;
                    return (
                      <button
                        key={d.code}
                        type="button"
                        onClick={() => setSelectedDialect(d.code)}
                        className={`p-3 rounded-xl text-center transition-all border flex flex-col items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md shadow-emerald-500/20'
                            : 'bg-[#102023] border-emerald-950/60 text-slate-300 hover:border-emerald-500/40 hover:bg-[#14292d]'
                        }`}
                      >
                        <span className="text-xl">{d.flag}</span>
                        <span className="text-xs font-semibold">{d.country}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">
                          {d.code === 'msa' ? 'الفصحى' : d.code === 'en' ? 'English' : d.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Business Description with AI Suggestion Button */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    وصف مختصر لنشاطك
                  </label>
                  <button
                    type="button"
                    onClick={suggestDescription}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>اقتراح مبني على نوع نشاطك – عدّله بما يناسبك</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="نقدم خدمات تنظيف المنازل، والاستفسار والحجز عبر واتساب..."
                  className="w-full bg-[#102023] border border-emerald-950/80 focus:border-emerald-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Employee Goals Multi-select Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  هدف الموظف الذكي
                </label>
                <p className="text-[11px] text-slate-400 mb-3">
                  اختر واحداً أو أكثر – يوجّه أسلوب الردود.
                </p>
                <div className="flex flex-wrap gap-2">
                  {GOALS_LIST.map((g) => {
                    const isSelected = selectedGoals.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGoal(g)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm'
                            : 'bg-[#102023] border-emerald-950/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setOnboardingStep(1)}
                  className="px-4 py-2.5 text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveStep2}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <span>التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ADD SERVICES / PRODUCTS (الصور 3 و 4) */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto bg-[#0D181A]/95 border border-emerald-900/40 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6" />
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {state.merchant.natureOfBusiness === 'products' ? 'أضف منتجاتك' : 'أضف خدماتك'}
              </h1>
              <p className="text-sm text-slate-400">
                خدمة واحدة تكفي للمتابعة – الحقول تظهر حسب نوع الخدمة.
              </p>
            </div>

            {/* Quick Helper Examples matching screenshot 4 */}
            <div className="mb-6 p-3 rounded-xl bg-[#102023] border border-emerald-950/60 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-emerald-400 block mb-1">أمثلة سريعة:</span>
              <p>• صالون: قص شعر رجالي – 60 دقيقة – يحتاج حجز</p>
              <p>• صيانة: صيانة مكيفات – في موقع العميل – يبدأ من 150 ر.س</p>
              <p>• استشارة: استشارة أونلاين 45 دقيقة – 250 ر.س</p>
            </div>

            {addedItemSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>تمت إضافة العنصر إلى كتالوج متجرك بنجاح! يمكنك إضافة غيره أو المتابعة.</span>
              </div>
            )}

            <form onSubmit={handleAddItem} className="space-y-5">
              {/* Item Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  اسم الخدمة / المنتج
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="مثال: تنظيف وتلميع واجهات المنازل أو عطر مسك الختام"
                  className="w-full bg-[#102023] border border-emerald-950/80 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              {/* Pricing Type & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    طريقة التسعير
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'fixed', label: 'سعر ثابت' },
                      { id: 'starts_from', label: 'يبدأ من' },
                      { id: 'on_demand', label: 'عند الطلب' },
                    ].map((pt) => (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => setPricingType(pt.id as PricingType)}
                        className={`py-2 px-1 text-center text-xs font-medium rounded-lg border transition-all ${
                          pricingType === pt.id
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-[#102023] border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {pt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    السعر ({currency})
                  </label>
                  <input
                    type="number"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    disabled={pricingType === 'on_demand'}
                    placeholder="0"
                    className="w-full bg-[#102023] border border-emerald-950/80 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Place of Service */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  مكان تقديم الخدمة
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'branch', label: 'في الفرع' },
                    { id: 'customer_location', label: 'عند العميل' },
                    { id: 'online', label: 'أونلاين' },
                  ].map((pl) => (
                    <button
                      key={pl.id}
                      type="button"
                      onClick={() => setDeliveryPlace(pl.id as ServicePlace)}
                      className={`py-2 px-2 text-center text-xs font-medium rounded-lg border transition-all ${
                        deliveryPlace === pl.id
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-[#102023] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {pl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Requires Booking Toggle (مطابق للصورة) */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#102023] border border-emerald-950/60">
                <div>
                  <div className="text-xs font-bold text-white">تحتاج حجز موعد؟</div>
                  <div className="text-[11px] text-slate-400">
                    يفعّل نظام المواعيد ويطلب تحديد تاريخ ووقت الخدمة.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRequiresBooking(!requiresBooking)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    requiresBooking ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                      requiresBooking ? 'translate-x-[-24px]' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Coverage & Working Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    مناطق التغطية
                  </label>
                  <input
                    type="text"
                    value={coverageAreas}
                    onChange={(e) => setCoverageAreas(e.target.value)}
                    placeholder="الرياض، جدة"
                    className="w-full bg-[#102023] border border-emerald-950/80 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    أوقات العمل
                  </label>
                  <input
                    type="text"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    placeholder="السبت-الخميس 9ص-9م"
                    className="w-full bg-[#102023] border border-emerald-950/80 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Advanced Customization (Collapsible) */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full p-3 bg-[#102023] flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white"
                >
                  <span>تخصيص متقدم (اختياري)</span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="p-4 bg-[#0D181A] space-y-3 border-t border-slate-800 text-xs">
                    <div>
                      <label className="block font-medium text-slate-400 mb-1">مهلة التنفيذ</label>
                      <input
                        type="text"
                        value={executionDeadline}
                        onChange={(e) => setExecutionDeadline(e.target.value)}
                        placeholder="مثال: خلال 24 ساعة"
                        className="w-full bg-[#102023] border border-slate-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-400 mb-1">سياسة الإلغاء</label>
                      <input
                        type="text"
                        value={cancellationPolicy}
                        onChange={(e) => setCancellationPolicy(e.target.value)}
                        placeholder="إلغاء مجاني قبل 24 ساعة"
                        className="w-full bg-[#102023] border border-slate-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-400 mb-1">التحويل لموظف بشري</label>
                      <input
                        type="text"
                        value={humanHandoffRule}
                        onChange={(e) => setHumanHandoffRule(e.target.value)}
                        placeholder="عند طلب حالة طارئة أو استفسار خارج الكتالوج"
                        className="w-full bg-[#102023] border border-slate-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Required Customer Data (الاسم، الجوال، الإيميل، العنوان، ملاحظات) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  البيانات المطلوبة من العميل
                </label>
                <div className="flex flex-wrap gap-2">
                  {['الاسم', 'الجوال', 'الإيميل', 'العنوان', 'ملاحظات'].map((field) => {
                    const isChecked = requiredFields.includes(field);
                    return (
                      <button
                        key={field}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setRequiredFields(requiredFields.filter((f) => f !== field));
                          } else {
                            setRequiredFields([...requiredFields, field]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isChecked
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-[#102023] border-slate-800 text-slate-400'
                        }`}
                      >
                        {field}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add item button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ حفظ وإضافة إلى قائمة الخدمات/المنتجات</span>
              </button>

              {/* Added Items preview */}
              {state.catalogItems.length > 0 && (
                <div className="pt-3">
                  <div className="text-[11px] text-slate-400 mb-2 font-semibold">
                    العناصر المضافة حالياً ({state.catalogItems.length}):
                  </div>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {state.catalogItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#102023] border border-slate-800 text-xs"
                      >
                        <span className="font-semibold text-white">{item.name}</span>
                        <span className="text-emerald-400 font-mono">
                          {item.price} {item.currency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setOnboardingStep(2)}
                  className="px-4 py-2.5 text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOnboardingStep(4)}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <span>التالي (ربط القنوات)</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4: CONNECT CHANNELS (الصورة 2) */}
        {step === 4 && (
          <div className="max-w-2xl mx-auto bg-[#0D181A]/95 border border-emerald-900/40 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-6 h-6" />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                اربط قناتك
              </h1>
              <p className="text-sm text-slate-400">
                اختر قناة وابدأ الربط – تتحقق تلقائياً أن الاتصال يعمل فعلياً قبل المتابعة.
              </p>
            </div>

            {/* Channels List matching screenshot 2 */}
            <div className="space-y-4 mb-8">
              {/* WhatsApp Card (The Primary Channel) */}
              <div className="p-6 rounded-2xl bg-[#102023] border border-emerald-900/60 relative overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-white">WhatsApp</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          الأكثر استخداماً
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        ردود فورية على رقمك وسلة تسوق مدمجة.
                      </p>
                    </div>
                  </div>

                  {isAnyWhatsAppConnected && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>متصل الآن</span>
                    </span>
                  )}
                </div>

                {isAnyWhatsAppConnected ? (
                  <div className="p-4 rounded-xl bg-[#0D181A] border border-emerald-500/30 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block mb-0.5">الرقم المربوط بالموظف الذكي:</span>
                      <span className="font-mono text-emerald-300 font-bold text-sm">
                        {metaChannel?.phoneNumber || qrChannel?.phoneNumber || '+966 50 123 4567'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        disconnectChannel('whatsapp_meta');
                        disconnectChannel('whatsapp_qr');
                      }}
                      className="px-3 py-1 text-[11px] text-rose-400 hover:bg-rose-500/10 rounded-lg border border-rose-500/20"
                    >
                      فصل الرقم
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Method 1: Meta Official Embedded Signup (For Tech Providers) */}
                    <div className="p-4 rounded-xl bg-[#0D181A] border border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-sky-400" />
                          <span className="text-xs font-bold text-white">
                            الربط الرسمي المعتمد (Meta Embedded Signup)
                          </span>
                        </div>
                        <span className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                          Meta Tech Provider
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                        تسجيل رسمي مباشر عبر موفر خدمات ميتا المعتمد. يتيح حساب أعمال WABA دون التعرض للحظر مع سرعة إرسال فائقة.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowMetaModal(true)}
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>ابدأ ربط واتساب (Meta Embedded Signup)</span>
                      </button>
                    </div>

                    {/* Method 2: Fast QR Code Pairing */}
                    <div className="p-4 rounded-xl bg-[#0D181A] border border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-white">
                            الربط السريع عبر مسح الكود (QR Code)
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          فوري في 10 ثوانٍ
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                        امسح الكود مباشرة بكاميرا واتساب من هاتفك لربط الموظف الذكي بجهازك في ثوانٍ.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          startQrSession();
                          setShowQrModal(true);
                        }}
                        className="w-full py-2.5 bg-[#14292d] hover:bg-[#19353a] border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>مسح باركود واتساب (Scan QR Code)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Facebook Messenger Card */}
              <div className="p-4 rounded-xl bg-[#102023] border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Facebook Messenger</h4>
                    <p className="text-xs text-slate-400">ردود على رسائل صفحتك في ماسنجر</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('ميزة ربط صفحة الفيسبوك مفعلة عبر حساب موفر الخدمة.')}
                  className="px-4 py-2 bg-[#14292d] hover:bg-[#19353a] text-xs font-semibold text-slate-300 rounded-lg border border-slate-700"
                >
                  ربط صفحة فيسبوك
                </button>
              </div>

              {/* Instagram Card */}
              <div className="p-4 rounded-xl bg-[#102023] border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Instagram</h4>
                    <p className="text-xs text-slate-400">الرسائل المباشرة على إنستغرام</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('ميزة ربط إنستغرام متاحة من خلال حساب فيسبوك للأعمال.')}
                  className="px-4 py-2 bg-[#14292d] hover:bg-[#19353a] text-xs font-semibold text-slate-300 rounded-lg border border-slate-700"
                >
                  ربط حساب إنستغرام
                </button>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setOnboardingStep(3)}
                className="px-4 py-2.5 text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowRight className="w-4 h-4" />
                <span>السابق</span>
              </button>

              <button
                type="button"
                onClick={() => setView('merchant_dashboard')}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <span>إنهاء والذهاب للوحة التحكم</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: META EMBEDDED SIGNUP (Tech Provider Flow) */}
      {showMetaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0E1A1C] border border-emerald-800/80 rounded-2xl max-w-lg w-full p-6 text-right shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-base text-white">
                  نافذة ربط Meta Embedded Signup الرسمية
                </h3>
              </div>
              <button
                onClick={() => setShowMetaModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 leading-relaxed">
                <strong>حساب موفر حلول ميتا المعتمد:</strong> يتم تشغيل الربط عبر تطبيق{' '}
                <span className="font-mono">{state.metaConfig.partnerName}</span> المعتمد من قبل Meta.
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                    1
                  </span>
                  <p>اختر حساب فيسبوك للأعمال المرتبط بنشاطك التجاري.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                    2
                  </span>
                  <p>اختر أو أضف رقم هاتف واتساب للأعمال الذي سيجيب منه موظفك الذكي.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                    3
                  </span>
                  <p>وافق على صلاحيات المراسلة وإدارة قوالب المحادثات.</p>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  رقم الهاتف المعتمد للربط:
                </label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full bg-[#102023] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  simulateMetaEmbeddedConnect(phoneInput);
                  setShowMetaModal(false);
                }}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>الموافقة وتأكيد الربط السحابي (Connect WABA)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowMetaModal(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QR CODE CONNECT (Scan QR Flow) */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0E1A1C] border border-emerald-800/80 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-right">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">
                  مسح رمز الاستجابة السريعة (WhatsApp QR Code)
                </h3>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              افتح تطبيق واتساب على هاتفك &gt; الإعدادات &gt; الأجهزة المرتبطة &gt; ربط جهاز، ثم امسح الكود أدناه:
            </p>

            {/* QR Code Container */}
            <div className="w-56 h-56 mx-auto bg-white p-3 rounded-2xl shadow-xl mb-4 flex items-center justify-center relative overflow-hidden">
              {state.qrSession.status === 'scanned' || state.qrSession.status === 'syncing' ? (
                <div className="flex flex-col items-center justify-center gap-2 text-slate-900">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                  <span className="font-bold text-xs">جاري مزامنة المحادثات وتفعيل الموظف...</span>
                </div>
              ) : state.qrSession.status === 'connected' ? (
                <div className="flex flex-col items-center justify-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  <span className="font-bold text-xs">تم الاتصال بنجاح!</span>
                </div>
              ) : (
                /* Generated SVG QR Code Pattern */
                <svg
                  className="w-full h-full text-slate-950"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer corner boxes */}
                  <rect x="5" y="5" width="25" height="25" rx="3" stroke="currentColor" strokeWidth="5" />
                  <rect x="12" y="12" width="11" height="11" fill="currentColor" />
                  <rect x="70" y="5" width="25" height="25" rx="3" stroke="currentColor" strokeWidth="5" />
                  <rect x="77" y="12" width="11" height="11" fill="currentColor" />
                  <rect x="5" y="70" width="25" height="25" rx="3" stroke="currentColor" strokeWidth="5" />
                  <rect x="12" y="77" width="11" height="11" fill="currentColor" />

                  {/* QR Matrix Dots */}
                  <rect x="36" y="8" width="5" height="5" fill="currentColor" />
                  <rect x="44" y="8" width="5" height="5" fill="currentColor" />
                  <rect x="55" y="8" width="5" height="5" fill="currentColor" />
                  <rect x="36" y="20" width="5" height="5" fill="currentColor" />
                  <rect x="48" y="20" width="5" height="5" fill="currentColor" />
                  <rect x="58" y="20" width="5" height="5" fill="currentColor" />
                  <rect x="10" y="38" width="5" height="5" fill="currentColor" />
                  <rect x="20" y="38" width="5" height="5" fill="currentColor" />
                  <rect x="36" y="38" width="5" height="5" fill="currentColor" />
                  <rect x="48" y="38" width="5" height="5" fill="currentColor" />
                  <rect x="60" y="38" width="5" height="5" fill="currentColor" />
                  <rect x="74" y="38" width="5" height="5" fill="currentColor" />
                  <rect x="86" y="38" width="5" height="5" fill="currentColor" />
                  <rect x="38" y="50" width="8" height="8" rx="2" fill="#10B981" />
                  <rect x="52" y="50" width="5" height="5" fill="currentColor" />
                  <rect x="68" y="50" width="5" height="5" fill="currentColor" />
                  <rect x="80" y="50" width="5" height="5" fill="currentColor" />
                  <rect x="36" y="64" width="5" height="5" fill="currentColor" />
                  <rect x="48" y="64" width="5" height="5" fill="currentColor" />
                  <rect x="60" y="64" width="5" height="5" fill="currentColor" />
                  <rect x="72" y="64" width="5" height="5" fill="currentColor" />
                  <rect x="84" y="64" width="5" height="5" fill="currentColor" />
                  <rect x="36" y="78" width="5" height="5" fill="currentColor" />
                  <rect x="48" y="78" width="5" height="5" fill="currentColor" />
                  <rect x="60" y="78" width="5" height="5" fill="currentColor" />
                  <rect x="76" y="78" width="5" height="5" fill="currentColor" />
                </svg>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-6">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>يتجدد الرمز تلقائياً للحفاظ على أمان حسابك</span>
            </div>

            {/* Quick Simulate Scan Button for testing */}
            <div className="p-3 rounded-xl bg-[#102023] border border-slate-800 mb-4">
              <p className="text-[11px] text-slate-300 mb-2">
                زر تجريبي لمحاكاة المسح الفوري من الجوال الآن:
              </p>
              <button
                type="button"
                onClick={() => simulateQrScan(phoneInput)}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>محاكاة مسح الكود بهاتف التاجر (Simulate Phone Scan)</span>
              </button>
            </div>

            {state.qrSession.status === 'connected' && (
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                إغلاق والمتابعة
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

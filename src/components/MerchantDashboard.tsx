/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  MessageSquare,
  Users,
  ShoppingBag,
  Calendar,
  Sparkles,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  UserCheck,
  Send,
  Plus,
  Trash2,
  Settings,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Globe,
  Clock,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { DIALECTS } from '../data/constants';
import { DialectCode } from '../types';

export const MerchantDashboard: React.FC = () => {
  const {
    state,
    updateAIEmployee,
    deleteCatalogItem,
    addCatalogItem,
    addChatMessage,
    toggleHumanTakeover,
    setView,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<
    'inbox' | 'analytics' | 'employee' | 'catalog' | 'orders' | 'channels'
  >('inbox');

  // Inbox state
  const [replyInput, setReplyInput] = useState('');

  // AI Employee settings state
  const [empDialect, setEmpDialect] = useState<DialectCode>(state.aiEmployee.dialect);
  const [empName, setEmpName] = useState(state.aiEmployee.name);
  const [empWelcome, setEmpWelcome] = useState(state.aiEmployee.welcomeMessage);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // Quick Catalog add
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('150');
  const [newProdType, setNewProdType] = useState<'service' | 'product'>('service');

  const metaChannel = state.channels.find((c) => c.type === 'whatsapp_meta');
  const qrChannel = state.channels.find((c) => c.type === 'whatsapp_qr');
  const isConnected =
    metaChannel?.status === 'connected' || qrChannel?.status === 'connected';

  // Total sales calculated from orders
  const totalSales = state.orders.reduce((sum, ord) => sum + ord.total, 0);

  const handleSendManualReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    addChatMessage({
      id: `msg_manual_${Date.now()}`,
      role: 'assistant',
      content: `[تدخل بشري من الموظف]: ${replyInput}`,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    });

    setReplyInput('');
  };

  const handleSaveEmployeeSettings = () => {
    updateAIEmployee({
      name: empName,
      dialect: empDialect,
      welcomeMessage: empWelcome,
    });
    alert('تم حفظ إعدادات الموظف الذكي بنجاح وتحديث أسلوب الردود!');
  };

  const handleAddFaq = () => {
    if (!newFaqQ || !newFaqA) return;
    const currentFaqs = state.aiEmployee.faqs || [];
    updateAIEmployee({
      faqs: [...currentFaqs, { question: newFaqQ, answer: newFaqA }],
    });
    setNewFaqQ('');
    setNewFaqA('');
  };

  const handleAddProductQuick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    addCatalogItem({
      name: newProdName,
      type: newProdType,
      pricingType: 'fixed',
      price: Number(newProdPrice) || 0,
      currency: state.merchant.currency,
      description: `تمت الإضافة السريعة: ${newProdName}`,
      inStock: true,
      requiresBooking: newProdType === 'service',
      coverageAreas: 'الرياض',
      workingHours: '9ص - 10م',
    });
    setNewProdName('');
  };

  return (
    <div className="min-h-screen bg-[#070E10] text-slate-100 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Business Status & Switcher Bar */}
        <div className="bg-[#0D181A] border border-emerald-950/80 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-bold flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
              {state.merchant.businessName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{state.merchant.businessName}</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                  {state.merchant.country}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-medium">
                  {state.merchant.currentPlanId === 'trial' ? 'باقة تجريبية (14 يوم)' : state.merchant.currentPlanId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                {state.aiEmployee.businessDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('storefront_chat')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>تجربة الموظف الذكي مباشرة</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView('onboarding')}
              className="px-3.5 py-2 bg-[#122226] hover:bg-[#162c31] border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
            >
              إعادة تشغيل معالج Onboarding
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-emerald-950/60 text-xs font-semibold">
          {[
            { id: 'inbox', label: 'صندوق الوارد والمحادثات الحية', icon: <MessageSquare className="w-4 h-4" />, count: 1 },
            { id: 'analytics', label: 'التحليلات والمبيعات', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'employee', label: 'استوديو الموظف الذكي واللهجات', icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
            { id: 'catalog', label: 'الخدمات والمنتجات', icon: <ShoppingBag className="w-4 h-4" />, count: state.catalogItems.length },
            { id: 'orders', label: 'الطلبات والحجوزات', icon: <Calendar className="w-4 h-4" />, count: state.orders.length },
            { id: 'channels', label: 'قنوات واتساب والربط', icon: <Smartphone className="w-4 h-4" />, statusDot: isConnected },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
                    {tab.count}
                  </span>
                )}
                {tab.statusDot && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OMNICHANNEL INBOX (LIVE WHATSAPP CHATS & HUMAN TAKEOVER) */}
        {activeTab === 'inbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversation Threads List */}
            <div className="bg-[#0D181A] border border-emerald-950/80 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">محادثات واتساب النشطة</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                  متصل ومباشر
                </span>
              </div>

              {/* Chat Thread Item */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 cursor-pointer text-right">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">فيصل الشمري</span>
                  <span className="text-[10px] text-slate-400 font-mono">10:14 ص</span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-1 mb-2">
                  {state.chatMessages[state.chatMessages.length - 1]?.content || 'يا هلا والله! آمرني...'}
                </p>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-emerald-400 font-mono">+966 50 123 4567</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300">
                    لهجة سعودية 🇸🇦
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#102023] border border-slate-800/80 opacity-70 text-right">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">سارة الدوسري</span>
                  <span className="text-[10px] text-slate-400 font-mono">أمس</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                  تم تأكيد طلب عطر الفخامة الملكي وإصدار فاتورة الدفع #CC-9183
                </p>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-mono">+966 55 987 6543</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    تم البيع ✓
                  </span>
                </div>
              </div>
            </div>

            {/* Conversation Window with Human Takeover */}
            <div className="lg:col-span-2 bg-[#0D181A] border border-emerald-950/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-[560px]">
              {/* Chat Top Banner with Human Takeover Switch */}
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ف.ش
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">فيصل الشمري</span>
                      <span className="text-[10px] text-emerald-400 font-mono">+966 50 123 4567</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>الرياض - حي النرجس</span>
                      <span>•</span>
                      <span>سلة بقيمة 240 ر.س</span>
                    </div>
                  </div>
                </div>

                {/* Human Takeover Toggle */}
                <div className="flex items-center gap-2 bg-[#102023] px-3 py-1.5 rounded-xl border border-slate-700">
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">
                      {state.isHumanTakeover ? 'التدخل البشري مفعّل' : 'الذكاء الاصطناعي يجيب'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {state.isHumanTakeover ? 'البوت متوقف مؤقتاً' : 'ردود آلية فورية'}
                    </span>
                  </div>
                  <button
                    onClick={toggleHumanTakeover}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      state.isHumanTakeover ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                        state.isHumanTakeover ? 'translate-x-[-24px]' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
                {state.chatMessages.map((msg) => {
                  const isAssistant = msg.role === 'assistant';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isAssistant
                            ? 'bg-[#122226] text-slate-100 rounded-tr-none border border-emerald-950/60'
                            : 'bg-emerald-600 text-white rounded-tl-none font-medium'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Manual Send Input */}
              <form onSubmit={handleSendManualReply} className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder={
                    state.isHumanTakeover
                      ? 'اكتب رداً يدوياً لإرساله مباشرة إلى واتساب العميل...'
                      : 'الذكاء الاصطناعي يتولى الرد تلقائياً (يمكنك التبديل للتدخل البشري أعلاه)...'
                  }
                  className="flex-1 bg-[#102023] border border-slate-700 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: ANALYTICS & GMV */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0D181A] border border-emerald-950/80">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>إجمالي مبيعات الشات (GMV)</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {totalSales.toLocaleString()} {state.merchant.currency}
                </div>
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+34.2% مقارنة بالشهر السابق</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D181A] border border-emerald-950/80">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>معدل التحويل (Chat to Sale)</span>
                  <ShoppingBag className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">28.4%</div>
                <div className="text-[11px] text-teal-400 mt-2">
                  أعلى من متوسط التجارة التقليدية بـ 4 أضعاف
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D181A] border border-emerald-950/80">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>إجمالي الطلبات والحجوزات</span>
                  <Calendar className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {state.orders.length}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  {state.orders.filter((o) => o.status === 'confirmed').length} مؤكدة وجاهزة
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D181A] border border-emerald-950/80">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>السلات المتروكة المستعادة</span>
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">14</div>
                <div className="text-[11px] text-amber-400 mt-2">عبر رسائل التذكير التلقائية</div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-[#0D181A] border border-emerald-950/80 rounded-2xl p-6">
              <h3 className="font-bold text-base text-white mb-4">أحدث العمليات المسجلة من المحادثات</h3>
              <div className="divide-y divide-slate-800">
                {state.orders.map((ord) => (
                  <div key={ord.id} className="py-3.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">{ord.orderNumber}</span>
                        <span className="font-semibold text-slate-200">{ord.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{ord.customerPhone}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {ord.items.map((i) => `${i.item.name} (${i.quantity})`).join('، ')}
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-bold text-emerald-400 font-mono">
                        {ord.total} {ord.currency}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {ord.paymentStatus === 'paid' ? 'تم الدفع الإلكتروني' : 'عند الاستلام'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AI EMPLOYEE STUDIO & DIALECTS */}
        {activeTab === 'employee' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#0D181A] border border-emerald-950/80 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-base text-white">تخصيص نبرة وشخصية الموظف الذكي</h3>
                </div>
                <button
                  onClick={handleSaveEmployeeSettings}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  حفظ التعديلات
                </button>
              </div>

              {/* Name & Greeting */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    اسم الموظف الذكي
                  </label>
                  <input
                    type="text"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full bg-[#102023] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    رسالة الترحيب الأولى للعميل
                  </label>
                  <textarea
                    rows={2}
                    value={empWelcome}
                    onChange={(e) => setEmpWelcome(e.target.value)}
                    className="w-full bg-[#102023] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white resize-none"
                  />
                </div>

                {/* Dialect Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    تغيير اللهجة المعتمدة
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {DIALECTS.map((d) => (
                      <button
                        key={d.code}
                        type="button"
                        onClick={() => {
                          setEmpDialect(d.code);
                          setEmpWelcome(
                            `${d.sampleGreeting} أنا الموظف الذكي لـ ${state.merchant.businessName}. كيف نقدر نساعدك؟`
                          );
                        }}
                        className={`p-2.5 rounded-xl text-center text-xs border transition-all flex flex-col items-center gap-1 ${
                          empDialect === d.code
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                            : 'bg-[#102023] border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-lg">{d.flag}</span>
                        <span>{d.country}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* FAQ Knowledge Base */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="font-bold text-xs text-white">
                  قاعدة المعرفة والأسئلة الشائعة (FAQ Knowledge Base)
                </h4>
                <div className="space-y-2">
                  {(state.aiEmployee.faqs || []).map((faq, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#102023] border border-slate-800 text-xs">
                      <div className="font-bold text-emerald-300 mb-1">س: {faq.question}</div>
                      <div className="text-slate-300">ج: {faq.answer}</div>
                    </div>
                  ))}
                </div>

                {/* Add new FAQ */}
                <div className="p-4 rounded-xl bg-[#091315] border border-slate-800 space-y-2">
                  <input
                    type="text"
                    value={newFaqQ}
                    onChange={(e) => setNewFaqQ(e.target.value)}
                    placeholder="السؤال المتكرر (مثال: هل يوجد توصيل لنفس اليوم؟)"
                    className="w-full bg-[#102023] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={newFaqA}
                    onChange={(e) => setNewFaqA(e.target.value)}
                    placeholder="الإجابة الدقيقة للموظف الذكي"
                    className="w-full bg-[#102023] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-lg hover:bg-emerald-500/30"
                  >
                    + إضافة السؤال لقاعدة المعرفة
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Live Preview Card */}
            <div className="bg-[#0D181A] border border-emerald-950/80 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-sm text-white">بطاقة الموظف الذكي</h4>
              </div>

              <div className="text-center p-4 rounded-xl bg-[#102023] border border-slate-800">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-3xl flex items-center justify-center mx-auto mb-2">
                  {state.aiEmployee.avatar}
                </div>
                <div className="font-bold text-base text-white">{empName}</div>
                <div className="text-xs text-emerald-400 mt-0.5">
                  وكيل مبيعات وحجوزات • {empDialect.toUpperCase()}
                </div>
                <div className="text-[11px] text-slate-400 mt-3 p-2 rounded bg-[#0D181A] border border-slate-800 leading-relaxed text-right">
                  "{empWelcome}"
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-2">
                <div className="font-semibold text-slate-300">الأهداف المبرمجة:</div>
                <div className="flex flex-wrap gap-1.5">
                  {state.aiEmployee.goals.map((g) => (
                    <span key={g} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CATALOG & SERVICES */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Quick Add Bar */}
            <form
              onSubmit={handleAddProductQuick}
              className="p-4 rounded-2xl bg-[#0D181A] border border-emerald-950/80 flex flex-col sm:flex-row items-center gap-3 text-xs"
            >
              <input
                type="text"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                placeholder="اسم الخدمة أو المنتج الجديد..."
                className="flex-1 bg-[#102023] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <select
                  value={newProdType}
                  onChange={(e) => setNewProdType(e.target.value as any)}
                  className="bg-[#102023] border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                >
                  <option value="service">خدمة (حجز موعد)</option>
                  <option value="product">منتج (سلعة وشحن)</option>
                </select>
                <input
                  type="number"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  placeholder="السعر"
                  className="w-24 bg-[#102023] border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors whitespace-nowrap"
                >
                  + إضافة فورية
                </button>
              </div>
            </form>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {state.catalogItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#0D181A] border border-emerald-950/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.type === 'service' ? 'خدمة وحجز' : 'منتج وسلة'}
                      </span>
                      <button
                        onClick={() => deleteCatalogItem(item.id)}
                        className="text-slate-400 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-bold text-sm text-white mb-1">{item.name}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-base font-bold text-emerald-400 font-mono">
                      {item.price} {item.currency}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.requiresBooking ? 'يتطلب موعد' : 'شحن مباشر'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ORDERS & BOOKINGS */}
        {activeTab === 'orders' && (
          <div className="bg-[#0D181A] border border-emerald-950/80 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white pb-3 border-b border-slate-800">
              سجل الطلبات وسلات الشراء المكتملة
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-3">رقم الطلب</th>
                    <th className="py-3 px-3">النوع</th>
                    <th className="py-3 px-3">العميل</th>
                    <th className="py-3 px-3">الهاتف</th>
                    <th className="py-3 px-3">العناصر</th>
                    <th className="py-3 px-3">المجموع</th>
                    <th className="py-3 px-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {state.orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {ord.type === 'booking' ? 'حجز موعد' : 'طلب منتج'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-200">{ord.customerName}</td>
                      <td className="py-3 px-3 font-mono text-slate-300">{ord.customerPhone}</td>
                      <td className="py-3 px-3 text-slate-300">
                        {ord.items.map((i) => `${i.item.name} (${i.quantity})`).join(', ')}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        {ord.total} {ord.currency}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                          {ord.status === 'confirmed' ? 'مؤكد ومنفذ' : ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: CHANNELS & CONNECTIONS */}
        {activeTab === 'channels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Meta Official Cloud Channel */}
            <div className="p-6 rounded-2xl bg-[#0D181A] border border-emerald-950/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Meta Cloud API (WABA)</h4>
                    <span className="text-[10px] text-sky-400">Tech Provider Embedded Signup</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    metaChannel?.status === 'connected'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {metaChannel?.status === 'connected' ? 'متصل رسمياً' : 'غير متصل'}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                الربط السحابي المعتمد من ميتا بدون الحاجة لهاتف شغال طوال الوقت، ومعدل إرسال غير محدود.
              </p>
              <button
                onClick={() => setView('onboarding')}
                className="w-full py-2.5 bg-[#122226] hover:bg-[#162c31] border border-slate-700 text-xs font-semibold text-slate-200 rounded-xl"
              >
                إدارة ربط WABA عبر Onboarding
              </button>
            </div>

            {/* QR Code Channel */}
            <div className="p-6 rounded-2xl bg-[#0D181A] border border-emerald-950/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">WhatsApp QR Code</h4>
                    <span className="text-[10px] text-emerald-400">مسح الكود الفوري</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    qrChannel?.status === 'connected'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {qrChannel?.status === 'connected' ? 'متصل عبر QR' : 'غير متصل'}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                ربط سريع ومباشر بمسح الكود من تطبيق واتساب العادي أو الأعمال على هاتفك في ثوانٍ.
              </p>
              <button
                onClick={() => setView('onboarding')}
                className="w-full py-2.5 bg-[#122226] hover:bg-[#162c31] border border-slate-700 text-xs font-semibold text-slate-200 rounded-xl"
              >
                إدارة ومسح رمز الـ QR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

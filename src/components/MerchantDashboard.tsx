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
  CheckCircle2,
  TrendingUp,
  DollarSign,
  UserCheck,
  Send,
  Plus,
  Trash2,
  Settings,
  ShieldCheck,
  QrCode,
  Globe,
  Clock,
  MapPin,
  RefreshCw,
  CreditCard,
  Bell,
  AlertCircle,
  ExternalLink,
  Activity,
  Layers,
  Mail,
} from 'lucide-react';
import { DIALECTS } from '../data/constants';
import { DialectCode, CatalogItem, Appointment } from '../types';
import { PaymentCheckoutModal } from './PaymentCheckoutModal';
import { WebhookInspectorModal } from './WebhookInspectorModal';
import { SmtpSettingsView } from './SmtpSettingsView';

export const MerchantDashboard: React.FC = () => {
  const {
    state,
    updateAIEmployee,
    deleteCatalogItem,
    addCatalogItem,
    addChatMessage,
    toggleHumanTakeover,
    setView,
    addAppointment,
    updateAppointmentStatus,
    triggerCartRecovery,
    createBroadcastCampaign,
    sendBroadcastCampaign,
    updatePaymentConfig,
    createPaymentInvoice,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<
    'inbox' | 'appointments' | 'catalog' | 'orders' | 'marketing' | 'payments' | 'smtp' | 'channels' | 'analytics'
  >('inbox');

  // Inbox state
  const [replyInput, setReplyInput] = useState('');

  // AI Employee settings state
  const [empDialect, setEmpDialect] = useState<DialectCode>(state.aiEmployee.dialect);
  const [empName, setEmpName] = useState(state.aiEmployee.name);
  const [empWelcome, setEmpWelcome] = useState(state.aiEmployee.welcomeMessage);

  // Quick Catalog add
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('150');
  const [newProdType, setNewProdType] = useState<'product' | 'service'>('service');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Appointments Form
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [appCustomerName, setAppCustomerName] = useState('');
  const [appCustomerPhone, setAppCustomerPhone] = useState('+96650');
  const [appServiceName, setAppServiceName] = useState('باقة تنظيف المنازل المتكاملة (4 ساعات)');
  const [appDate, setAppDate] = useState('2026-10-06');
  const [appTimeSlot, setAppTimeSlot] = useState('04:00 م');

  // Marketing Campaign State
  const [campTitle, setCampTitle] = useState('عرض منتصف الأسبوع: خصم 15%');
  const [campAudience, setCampAudience] = useState<'all' | 'repeat_buyers' | 'inactive_30d'>('all');
  const [campTemplate, setCampTemplate] = useState('يا هلا بك! جهزنا لك كود خصم خاص 15% [MID15] ساري لـ 48 ساعة فقط!');

  // Payment checkout inspection modal
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<any>(null);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

  // Quick Reply handler from Merchant
  const handleMerchantSendReply = () => {
    if (!replyInput.trim()) return;
    addChatMessage({
      id: `msg_human_${Date.now()}`,
      role: 'assistant',
      content: `[رد التاجر البشري]: ${replyInput}`,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    });
    setReplyInput('');
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    updateAIEmployee({
      name: empName,
      dialect: empDialect,
      welcomeMessage: empWelcome,
    });
    alert('تم حفظ إعدادات موظف 360Resala بنجاح!');
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appCustomerName || !appCustomerPhone) return;
    addAppointment({
      customerName: appCustomerName,
      customerPhone: appCustomerPhone,
      serviceName: appServiceName,
      date: appDate,
      timeSlot: appTimeSlot,
      status: 'confirmed',
    });
    setShowAddAppModal(false);
    setAppCustomerName('');
    setAppCustomerPhone('+96650');
  };

  const handleCreateCampaign = () => {
    if (!campTitle.trim()) return;
    const newCamp = createBroadcastCampaign({
      title: campTitle,
      targetAudience: campAudience,
      messageTemplate: campTemplate,
      totalRecipients: 350,
    });
    sendBroadcastCampaign(newCamp.id);
  };

  return (
    <div className="min-h-screen bg-[#050B0D] text-slate-100 font-['Cairo',sans-serif] pb-16">
      {/* Top Banner */}
      <div className="bg-[#081518] border-b border-emerald-950/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h1 className="text-2xl font-black text-white">لوحة تحكم تاجر 360Resala</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {state.merchant.businessName}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              إدارة الموظف الذكي، حجز المواعيد، الفواتير ومدفوعات مدى/Apple Pay، واستعادة السلات
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWebhookModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 hover:border-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Activity className="w-4 h-4 animate-pulse" />
              <span>فاحص الويب هوك (Meta Webhook)</span>
            </button>

            <button
              onClick={() => setView('storefront_chat')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:brightness-110 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>فتح شات المتجر الحي</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-semibold custom-scrollbar">
          {[
            { id: 'inbox', label: 'المحادثات الحية (Inbox)', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'appointments', label: 'حجز المواعيد والتقويم', icon: <Calendar className="w-4 h-4" />, badge: `${state.appointments.length}` },
            { id: 'orders', label: 'الطلبات وفواتير الدفع', icon: <DollarSign className="w-4 h-4" />, badge: `${state.orders.length}` },
            { id: 'marketing', label: 'السلات المتروكة والبرودكاست', icon: <TrendingUp className="w-4 h-4 text-amber-400" /> },
            { id: 'catalog', label: 'المنتجات والخدمات', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'payments', label: 'بوابات الدفع (Moyasar/Tap)', icon: <CreditCard className="w-4 h-4 text-teal-400" /> },
            { id: 'smtp', label: 'البريد و SMTP', icon: <Mail className="w-4 h-4 text-emerald-400" /> },
            { id: 'channels', label: 'قنوات واتساب والربط', icon: <Globe className="w-4 h-4" /> },
            { id: 'analytics', label: 'التقارير والأداء', icon: <TrendingUp className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: INBOX & HUMAN TAKEOVER */}
        {activeTab === 'inbox' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Conversation Feed */}
            <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col h-[600px] text-right">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg">
                    💬
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">محادثة العميل (واتساب النشط)</h3>
                    <p className="text-[11px] text-slate-400">
                      اللهجة: <span className="text-emerald-400 font-bold">{state.aiEmployee.dialect.toUpperCase()}</span>
                    </p>
                  </div>
                </div>

                {/* Human Takeover Toggle */}
                <button
                  onClick={toggleHumanTakeover}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    state.isHumanTakeover
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>
                    {state.isHumanTakeover
                      ? 'التدخل البشري مفعل (الموظف الذكي متوقف)'
                      : 'الموظف الذكي يعمل تلقائياً'}
                  </span>
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
                {state.chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.role === 'assistant' ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                        m.role === 'assistant'
                          ? 'bg-slate-950 border border-emerald-950 text-slate-200 rounded-tr-none'
                          : 'bg-emerald-600 text-white rounded-tl-none font-medium'
                      }`}
                    >
                      {m.content}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">{m.timestamp}</span>
                  </div>
                ))}
              </div>

              {/* Merchant Manual Reply Bar */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleMerchantSendReply()}
                  placeholder="اكتب رداً يدوياً للعميل كـ (تاجر بشري)..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleMerchantSendReply}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال</span>
                </button>
              </div>
            </div>

            {/* AI Assistant Quick Controls (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <form onSubmit={handleSaveEmployee} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 text-right space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">إعدادات الموظف الذكي</h3>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">اسم الموظف الذكي</label>
                  <input
                    type="text"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">اللهجة المعتمدة</label>
                  <select
                    value={empDialect}
                    onChange={(e) => setEmpDialect(e.target.value as DialectCode)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {DIALECTS.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.flag} {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">رسالة الترحيب الأولى</label>
                  <textarea
                    rows={3}
                    value={empWelcome}
                    onChange={(e) => setEmpWelcome(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  حفظ التعديلات
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS & CALENDAR */}
        {activeTab === 'appointments' && (
          <div className="mt-6 space-y-6 text-right">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">نظام حجز وتأكيد المواعيد</h2>
                <p className="text-xs text-slate-400">إدارة حجوزات الخدمات، التوقيتات، وإرسال تنبيهات واتساب التلقائية</p>
              </div>

              <button
                onClick={() => setShowAddAppModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة موعد جديد يدوي</span>
              </button>
            </div>

            {/* Appointments List */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4 font-semibold">الخدمة المطلوبة</th>
                      <th className="p-4 font-semibold">العميل والجوال</th>
                      <th className="p-4 font-semibold">التاريخ والوقت</th>
                      <th className="p-4 font-semibold">الحالة</th>
                      <th className="p-4 font-semibold">إشعارات الواتساب</th>
                      <th className="p-4 font-semibold">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {state.appointments.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 font-bold text-white">{app.serviceName}</td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-200">{app.customerName}</div>
                          <div className="font-mono text-slate-400 text-[11px]">{app.customerPhone}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-slate-300">
                            <Calendar className="w-3.5 h-3.5 text-teal-400" />
                            <span>{app.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{app.timeSlot}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              app.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : app.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {app.status === 'confirmed' ? 'مؤكد ✓' : app.status === 'pending' ? 'قيد الانتظار' : app.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                            <Bell className="w-3.5 h-3.5" />
                            <span>تأكيد فوري مرسل عبر واتساب</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {app.status !== 'confirmed' && (
                              <button
                                onClick={() => updateAppointmentStatus(app.id, 'confirmed')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[10px]"
                              >
                                تأكيد
                              </button>
                            )}
                            <button
                              onClick={() => updateAppointmentStatus(app.id, 'completed')}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px]"
                            >
                              اكتمل
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Add Appointment */}
            {showAddAppModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#091518] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full text-right shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">إضافة حجز موعد جديد</h3>
                  <form onSubmit={handleCreateAppointment} className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-300 block mb-1">اسم العميل</label>
                      <input
                        type="text"
                        value={appCustomerName}
                        onChange={(e) => setAppCustomerName(e.target.value)}
                        placeholder="مثال: عبد الرحمن الغامدي"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">رقم الواتساب</label>
                      <input
                        type="text"
                        value={appCustomerPhone}
                        onChange={(e) => setAppCustomerPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                        dir="ltr"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">الخدمة</label>
                      <select
                        value={appServiceName}
                        onChange={(e) => setAppServiceName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="باقة تنظيف المنازل المتكاملة (4 ساعات)">باقة تنظيف المنازل المتكاملة (4 ساعات)</option>
                        <option value="غسيل وتلميع سيارات متنقل VIP">غسيل وتلميع سيارات متنقل VIP</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 block mb-1">تاريخ الحجز</label>
                        <input
                          type="date"
                          value={appDate}
                          onChange={(e) => setAppDate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 block mb-1">الفترة الزمنية</label>
                        <input
                          type="text"
                          value={appTimeSlot}
                          onChange={(e) => setAppTimeSlot(e.target.value)}
                          placeholder="مثال: 04:00 م"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                      >
                        تأكيد وحفظ الموعد
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddAppModal(false)}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS & PAYMENT INVOICES */}
        {activeTab === 'orders' && (
          <div className="mt-6 space-y-6 text-right">
            <div>
              <h2 className="text-xl font-bold text-white">الطلبات وفواتير الدفع المباشر</h2>
              <p className="text-xs text-slate-400">إدارة فواتير مدى و Apple Pay الصادرة آلياً عبر محادثات واتساب</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Invoices List */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-white text-sm">فواتير السداد الإلكتروني الصادرة</h3>
                  <span className="text-[10px] text-teal-400 font-mono">
                    بوابة {state.paymentConfig.activeProvider.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3">
                  {state.paymentInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400 font-bold">{inv.id}</span>
                          <span className="text-slate-200 font-semibold">{inv.customerName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-mono">{inv.customerPhone}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          تاريخ الإصدار: {new Date(inv.createdAt).toLocaleDateString('ar-SA')}
                        </div>
                      </div>

                      <div className="text-left space-y-1.5">
                        <div className="text-base font-black text-white font-['Plus_Jakarta_Sans',sans-serif]">
                          {inv.amount} <span className="text-xs font-semibold text-slate-400">{inv.currency}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.status === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {inv.status === 'paid' ? 'مدفوع ✓' : 'بانتظار السداد'}
                          </span>

                          <button
                            onClick={() => setSelectedInvoiceForModal(inv)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] transition-colors"
                          >
                            سداد/معاينة
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
                <h3 className="font-bold text-white text-sm pb-3 border-b border-slate-800">
                  سجل طلبات العملاء ({state.orders.length})
                </h3>

                <div className="space-y-3">
                  {state.orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400 font-bold">{ord.orderNumber}</span>
                          <span className="text-slate-200 font-semibold">{ord.customerName}</span>
                        </div>
                        <span className="font-black text-white font-mono">
                          {ord.total} {ord.currency}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400">
                        {ord.items.map((i) => `${i.item.name} (${i.quantity})`).join('، ')}
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">طريقة الدفع: {ord.paymentMethod || 'مدى / Apple Pay'}</span>
                        <span className="text-emerald-400 font-bold">مؤكد وجاهز للتنفيذ</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MARKETING & ABANDONED CARTS */}
        {activeTab === 'marketing' && (
          <div className="mt-6 space-y-6 text-right">
            <div>
              <h2 className="text-xl font-bold text-white">حملات التسويق وإعادة الاستهداف (Broadcast & Recovery)</h2>
              <p className="text-xs text-slate-400">استعادة السلات المتروكة آلياً وإطلاق رسائل البرودكاست المعتمدة من ميتا</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Abandoned Carts (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-white text-sm">السلات المتروكة المرصودة ({state.abandonedCarts.length})</h3>
                  </div>
                  <span className="text-[10px] text-slate-400">معدل الاسترجاع: 42%</span>
                </div>

                <div className="space-y-3">
                  {state.abandonedCarts.map((cart) => (
                    <div
                      key={cart.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200">{cart.customerName}</span>
                          <span className="font-mono text-slate-400 text-[11px]">{cart.customerPhone}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          المنتجات: {cart.items.map((i) => i.item.name).join('، ')}
                        </div>
                        <div className="text-[10px] text-amber-400">
                          كود الخصم المجهز: <strong className="font-mono">{cart.couponCode || 'RESALA10'} (10% خصم)</strong>
                        </div>
                      </div>

                      <div className="text-left space-y-2">
                        <div className="font-black text-white font-mono">
                          {cart.total} {cart.currency}
                        </div>
                        <button
                          onClick={() => triggerCartRecovery(cart.id)}
                          disabled={cart.recoveryStatus === 'sent'}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                            cart.recoveryStatus === 'sent'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-sm'
                          }`}
                        >
                          <Send className="w-3 h-3" />
                          <span>{cart.recoveryStatus === 'sent' ? 'تم إرسال التذكير ✓' : 'إرسال تذكير واتساب'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Broadcast Campaigns (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-white text-sm pb-3 border-b border-slate-800">
                  إطلاق حملة برودكاست جديدة
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">عنوان الحملة</label>
                    <input
                      type="text"
                      value={campTitle}
                      onChange={(e) => setCampTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">الجمهور المستهدف</label>
                    <select
                      value={campAudience}
                      onChange={(e) => setCampAudience(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="all">جميع العملاء والمشتركين (350 جهة اتصال)</option>
                      <option value="repeat_buyers">العملاء الدائمين وأصحاب الطلبات المكتملة</option>
                      <option value="inactive_30d">العملاء غير النشطين منذ أكثر من 30 يوماً</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">نص رسالة البرودكاست</label>
                    <textarea
                      rows={3}
                      value={campTemplate}
                      onChange={(e) => setCampTemplate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white"
                    />
                  </div>

                  <button
                    onClick={handleCreateCampaign}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال البرودكاست الآن عبر Meta Cloud API</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CATALOG ITEMS */}
        {activeTab === 'catalog' && (
          <div className="mt-6 space-y-6 text-right">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">كتالوج المنتجات والخدمات</h2>
                <p className="text-xs text-slate-400">إدارة المنتجات والخدمات التي يقترحها الموظف الذكي ويبيعها</p>
              </div>
            </div>

            {/* Quick Add Form */}
            <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end">
              <div>
                <label className="text-slate-300 block mb-1">اسم المنتج أو الخدمة</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="مثال: غسيل سيارات VIP"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">النوع</label>
                <select
                  value={newProdType}
                  onChange={(e) => setNewProdType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="service">خدمة (حجز موعد)</option>
                  <option value="product">منتج (شحن وتوصيل)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">السعر (ر.س)</label>
                <input
                  type="number"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <button
                onClick={() => {
                  if (!newProdName.trim()) return;
                  addCatalogItem({
                    name: newProdName,
                    price: Number(newProdPrice),
                    type: newProdType,
                    currency: 'SAR',
                    pricingType: 'fixed',
                    description: newProdDesc || 'خدمة متميزة من 360Resala',
                    inStock: true,
                    requiresBooking: newProdType === 'service',
                  });
                  setNewProdName('');
                }}
                className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة للكتالوج</span>
              </button>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.catalogItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                        {item.type === 'service' ? 'خدمة قابلة للحجز' : 'منتج متوفر'}
                      </span>
                      <button
                        onClick={() => deleteCatalogItem(item.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-base font-black text-emerald-400 font-mono">
                      {item.price} {item.currency}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.requiresBooking ? 'يتطلب تحديد موعد' : 'شحن مباشر'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PAYMENT GATEWAYS CONFIGURATION */}
        {activeTab === 'payments' && (
          <div className="mt-6 space-y-6 text-right">
            <div>
              <h2 className="text-xl font-bold text-white">إعدادات بوابات الدفع الإلكتروني المباشر</h2>
              <p className="text-xs text-slate-400">تفعيل سداد فواتير واتساب عبر مدى و Apple Pay وبطاقات الائتمان</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gateway Selection & Keys */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-white text-sm pb-3 border-b border-slate-800">
                  بوابة الدفع النشطة (Provider)
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'moyasar', name: 'Moyasar (ميسر)', desc: 'الأكثر شيوعاً في السعودية' },
                    { id: 'tap', name: 'Tap Payments', desc: 'دعم خليجي شامل' },
                    { id: 'hyperpay', name: 'HyperPay', desc: 'للشركات والمؤسسات' },
                  ].map((gw) => (
                    <button
                      key={gw.id}
                      onClick={() => updatePaymentConfig({ activeProvider: gw.id as any })}
                      className={`p-3 rounded-2xl border text-right transition-all ${
                        state.paymentConfig.activeProvider === gw.id
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-bold text-xs">{gw.name}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{gw.desc}</div>
                    </button>
                  ))}
                </div>

                <div className="space-y-3 text-xs pt-2">
                  <div>
                    <label className="text-slate-300 block mb-1">المفتاح السري (Secret Key)</label>
                    <input
                      type="password"
                      value={state.paymentConfig.moyasarSecretKey}
                      onChange={(e) => updatePaymentConfig({ moyasarSecretKey: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">المفتاح العام (Publishable Key)</label>
                    <input
                      type="text"
                      value={state.paymentConfig.moyasarPublishableKey}
                      onChange={(e) => updatePaymentConfig({ moyasarPublishableKey: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Supported Payment Channels */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-white text-sm pb-3 border-b border-slate-800">
                  وسائل الدفع المفعلة لعملاء واتساب
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-black text-xs">mada مدى</span>
                      <span className="text-xs font-semibold text-slate-200">بطاقات مدى السعودية</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={state.paymentConfig.enableMada}
                      onChange={(e) => updatePaymentConfig({ enableMada: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]"> Apple Pay</span>
                      <span className="text-xs font-semibold text-slate-200">الدفع الفوري بأجهزة آبل</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={state.paymentConfig.enableApplePay}
                      onChange={(e) => updatePaymentConfig({ enableApplePay: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-teal-400" />
                      <span className="text-xs font-semibold text-slate-200">البطاقات الائتمانية (Visa / Mastercard)</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={state.paymentConfig.enableCreditCard}
                      onChange={(e) => updatePaymentConfig({ enableCreditCard: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SMTP & EMAIL NOTIFICATIONS */}
        {activeTab === 'smtp' && (
          <div className="mt-6">
            <SmtpSettingsView />
          </div>
        )}

        {/* TAB 7: CHANNELS & META WEBHOOK */}
        {activeTab === 'channels' && (
          <div className="mt-6 space-y-6 text-right">
            <div>
              <h2 className="text-xl font-bold text-white">قنوات واتساب والويب هوك الرسمي</h2>
              <p className="text-xs text-slate-400">إدارة ربط Meta Cloud API و QR Code وفحص الاتصال</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.channels.map((ch) => (
                <div key={ch.type} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-white text-sm">{ch.title}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {ch.status === 'connected' ? 'متصل ✓' : 'غير متصل'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{ch.details}</p>
                    {ch.phoneNumber && (
                      <div className="mt-2 text-xs font-mono text-emerald-300 font-bold">
                        الرقم: {ch.phoneNumber}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => setIsWebhookModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>فحص حالة الويب هوك</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-right">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">إجمالي المبيعات المؤكدة</span>
              <span className="text-3xl font-black text-emerald-400 font-mono">1,820 ر.س</span>
              <span className="text-[11px] text-emerald-500 block mt-2">↑ 28% نمو هذا الأسبوع</span>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">المحادثات المحولة لمبيعات</span>
              <span className="text-3xl font-black text-teal-400 font-mono">76.4%</span>
              <span className="text-[11px] text-slate-400 block mt-2">عبر الرد الفوري واللهجة المحلية</span>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">السلات المسترجعة بالواتساب</span>
              <span className="text-3xl font-black text-amber-400 font-mono">42%</span>
              <span className="text-[11px] text-amber-500 block mt-2">مع كود الخصم RESALA10</span>
            </div>
          </div>
        )}
      </div>

      {/* Payment Checkout Modal */}
      {selectedInvoiceForModal && (
        <PaymentCheckoutModal
          invoice={selectedInvoiceForModal}
          onClose={() => setSelectedInvoiceForModal(null)}
        />
      )}

      {/* Webhook Inspector Modal */}
      <WebhookInspectorModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
      />
    </div>
  );
};

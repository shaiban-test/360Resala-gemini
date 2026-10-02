/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Send,
  ShoppingBag,
  Sparkles,
  Calendar,
  CheckCircle2,
  Trash2,
  X,
  CreditCard,
  Plus,
  Minus,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { DIALECTS } from '../data/constants';
import { CatalogItem, PaymentInvoice } from '../types';
import { PaymentCheckoutModal } from './PaymentCheckoutModal';

export const StorefrontChatView: React.FC = () => {
  const {
    state,
    addChatMessage,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder,
    setView,
  } = useAppStore();

  const [inputMessage, setInputMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [customerName, setCustomerName] = useState('فيصل الشمري');
  const [customerPhone, setCustomerPhone] = useState('+966 50 123 4567');
  const [customerAddress, setCustomerAddress] = useState('الرياض - حي النرجس');
  const [confirmedOrderNum, setConfirmedOrderNum] = useState<string | null>(null);
  const [activeCheckoutInvoice, setActiveCheckoutInvoice] = useState<PaymentInvoice | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatMessages, isAiLoading]);

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isAiLoading) return;

    const userMsgId = `msg_user_${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

    // 1. Add user message
    addChatMessage({
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp,
    });

    if (!textToSend) setInputMessage('');
    setIsAiLoading(true);

    try {
      // 2. Call server-side route
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          dialect: state.aiEmployee.dialect,
          businessName: state.merchant.businessName,
          businessDescription: state.aiEmployee.businessDescription,
          catalogItems: state.catalogItems,
          goals: state.aiEmployee.goals,
          history: state.chatMessages.slice(-6),
        }),
      });

      const data = await response.json();
      const reply = data.reply || 'يا هلا بك! نسعد بخدمتك دائماً في متجرنا.';

      // Check if text triggers product/service cards
      const matchedCards: any[] = [];
      const lowerText = (text + ' ' + reply).toLowerCase();

      state.catalogItems.forEach((item) => {
        if (
          lowerText.includes(item.name.toLowerCase()) ||
          (item.name.includes('تنظيف') && lowerText.includes('تنظيف')) ||
          (item.name.includes('سيارات') && lowerText.includes('سيار')) ||
          (item.name.includes('عطر') && lowerText.includes('عطر'))
        ) {
          if (!matchedCards.some((c) => c.data.id === item.id)) {
            matchedCards.push({
              type: item.type === 'service' ? 'service' : 'product',
              data: item,
            });
          }
        }
      });

      addChatMessage({
        id: `msg_asst_${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        cards: matchedCards.length > 0 ? matchedCards : undefined,
        suggestedQuickReplies: [
          'وش العروض والخدمات المتوفرة؟',
          'أبي أحجز موعد غداً',
          'طرق الدفع بمدى و Apple Pay',
        ],
      });
    } catch {
      addChatMessage({
        id: `msg_asst_${Date.now()}`,
        role: 'assistant',
        content: 'يا هلا والله! آمرني وش في خاطرك؟ أنا هنا لمساعدتك في أي استفسار أو حجز خدمة.',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = createOrder(customerName, customerPhone, customerAddress, 'apple_pay');
    if (order) {
      setConfirmedOrderNum(order.orderNumber);
      setCheckoutModal(false);
      setShowCartDrawer(false);

      // Check if invoice was created in state
      const matchingInvoice = state.paymentInvoices[0];
      if (matchingInvoice) {
        addChatMessage({
          id: `msg_pay_${Date.now()}`,
          role: 'assistant',
          content: `ألف مبروك! تم تسجيل طلبك بنجاح برقم ${order.orderNumber} 🎉\n\nتم إصدار رابط الدفع المباشر لـ مدى و Apple Pay:\n${matchingInvoice.paymentUrl}\n\nيرجى الضغط على زر السداد أدناه لإتمام الدفع الآمن فوراً.`,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        });

        // Open checkout modal for instant payment experience
        setActiveCheckoutInvoice(matchingInvoice);
      }
    }
  };

  const totalCart = state.cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const activeDialect = DIALECTS.find((d) => d.code === state.aiEmployee.dialect);

  return (
    <div className="min-h-screen bg-[#050B0D] text-slate-100 py-6 px-3 sm:px-6 relative font-['Cairo',sans-serif]">
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-6rem)] bg-[#071317] border border-emerald-950/80 rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Chat Top WhatsApp-like Header */}
        <div className="p-4 bg-[#09171b] border-b border-emerald-950/80 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-emerald-500/20 text-emerald-300 text-2xl flex items-center justify-center border border-emerald-500/40">
                {state.aiEmployee.avatar}
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#09171b] absolute bottom-0 right-0"></span>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-white">{state.aiEmployee.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {activeDialect?.flag} {activeDialect?.country}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                موظف 360Resala الذكي • متصل على مدار 24 ساعة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCartDrawer(true)}
              className="relative p-2.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {state.cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-md">
                  {state.cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Chat Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-right">
          {/* Welcome Announcement Card */}
          <div className="p-3.5 rounded-2xl bg-[#0b1c20]/80 border border-emerald-500/20 text-center text-xs text-slate-300 max-w-md mx-auto">
            <span>
              🔒 محادثة تجارة ذكية مشفرة عبر <strong>360Resala</strong>، مدعومة بنماذج الذكاء الاصطناعي باللهجة{' '}
              <strong className="text-emerald-400">{activeDialect?.label}</strong>.
            </span>
          </div>

          {state.chatMessages.map((msg) => {
            const isAssistant = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
              >
                {/* Text Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl text-xs leading-relaxed shadow-md ${
                    isAssistant
                      ? 'bg-[#0a181c] text-slate-100 rounded-tr-none border border-emerald-900/40 text-right'
                      : 'bg-emerald-600 text-white rounded-tl-none font-medium text-right'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Inline Product/Service Cards */}
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-700/60">
                      {msg.cards.map((c: any, idx: number) => {
                        const item: CatalogItem = c.data;
                        return (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-[#061013] border border-emerald-500/30 flex items-center justify-between gap-3 text-right"
                          >
                            <div className="flex-1">
                              <span className="text-[10px] text-emerald-400 font-bold block mb-0.5">
                                {item.type === 'service' ? 'خدمة قابلة للحجز' : 'منتج متوفر'}
                              </span>
                              <div className="font-bold text-white text-xs">{item.name}</div>
                              <div className="text-[11px] text-emerald-300 font-mono font-bold mt-1">
                                {item.price} {item.currency}
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                addToCart(item);
                                setShowCartDrawer(true);
                              }}
                              className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-bold rounded-xl text-xs transition-all shrink-0 shadow-sm"
                            >
                              {item.type === 'service' ? 'حجز وإضافة' : '+ أضف للسلة'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {isAiLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce delay-200" />
              <span className="text-[11px] mr-1">الموظف الذكي يكتب رداً...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#09171b] border-t border-emerald-950/80 z-20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="تحدث مع الموظف الذكي بلهجتك..."
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isAiLoading || !inputMessage.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold hover:brightness-110 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* CART DRAWER */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#091518] border-r border-emerald-950 p-6 flex flex-col justify-between text-right shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-base text-white">سلة التسوق والحجز</h3>
                </div>
                <button
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {state.cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto text-slate-600" />
                  <p className="text-xs">سلتك فارغة حالياً. اطلب من الموظف الذكي اقتراح المنتجات!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 mt-4">
                  {state.cart.map((c) => (
                    <div
                      key={c.item.id}
                      className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <span className="font-bold text-white block mb-0.5">{c.item.name}</span>
                        <span className="text-emerald-400 font-mono font-semibold">
                          {c.item.price} {c.item.currency}
                        </span>
                        {c.item.requiresBooking && (
                          <span className="text-[10px] text-teal-400 block mt-0.5">
                            يتطلب حجز موعد
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-700">
                          <button
                            onClick={() => updateCartQuantity(c.item.id, -1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs px-1 text-white">{c.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(c.item.id, 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(c.item.id)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {state.cart.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">الإجمالي المطلوب:</span>
                  <span className="font-bold text-xl text-emerald-400 font-mono">
                    {totalCart} {state.merchant.currency}
                  </span>
                </div>

                <button
                  onClick={() => setCheckoutModal(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>إتمام الطلب والدفع الفوري (مدى / Pay)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {checkoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#091518] border border-emerald-500/30 rounded-3xl max-w-md w-full p-6 text-right shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">تأكيد الطلب وبيانات التوصيل</h3>
              <button onClick={() => setCheckoutModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">اسم العميل</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">رقم الواتساب</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">العنوان / المدينة</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-slate-200 mb-2">طريقة الدفع المعتمدة:</div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-bold">
                    مدى / Apple Pay
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                    عند الاستلام
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                <span>المبلغ المطلوب:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {totalCart} {state.merchant.currency}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>إصدار رابط الدفع الفوري عبر واتساب</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Checkout Modal Simulation */}
      {activeCheckoutInvoice && (
        <PaymentCheckoutModal
          invoice={activeCheckoutInvoice}
          onClose={() => setActiveCheckoutInvoice(null)}
        />
      )}
    </div>
  );
};

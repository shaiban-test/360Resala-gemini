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
} from 'lucide-react';
import { DIALECTS } from '../data/constants';
import { CatalogItem } from '../types';

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
      // 2. Call server-side Gemini 3.8 Flash route
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
          'أضف عطر الفخامة الملكي للسلة',
        ],
      });
    } catch (e) {
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
    const order = createOrder(customerName, customerPhone, customerAddress);
    if (order) {
      setConfirmedOrderNum(order.orderNumber);
      setCheckoutModal(false);
      setShowCartDrawer(false);
    }
  };

  const totalCart = state.cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const activeDialect = DIALECTS.find((d) => d.code === state.aiEmployee.dialect);

  return (
    <div className="min-h-screen bg-[#070E10] text-slate-100 py-6 px-3 sm:px-6 relative">
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-6rem)] bg-[#0C1719] border border-emerald-950/80 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Chat Top WhatsApp-like Header */}
        <div className="p-4 bg-[#102023] border-b border-emerald-950/80 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-emerald-500/20 text-emerald-300 text-2xl flex items-center justify-center border border-emerald-500/40">
                {state.aiEmployee.avatar}
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#102023] absolute bottom-0 right-0"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-white">{state.aiEmployee.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {activeDialect?.flag} {activeDialect?.country}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                الموظف الذكي لـ {state.merchant.businessName} • متصل دائماً
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Cart Button */}
            <button
              onClick={() => setShowCartDrawer(true)}
              className="relative p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">سلة الشراء</span>
              {state.cart.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center">
                  {state.cart.reduce((s, c) => s + c.quantity, 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => setView('merchant_dashboard')}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800"
            >
              لوحة التاجر
            </button>
          </div>
        </div>

        {/* Chat Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Welcome Announcement Card */}
          <div className="p-3 rounded-xl bg-[#102023]/70 border border-emerald-950/60 text-center text-xs text-slate-400 max-w-md mx-auto">
            <span>
              🔒 هذه محادثة مشفرة وتجارة تحادثية ذكية مع موظف {state.merchant.businessName}، يتحدث باللهجة{' '}
              <strong className="text-emerald-400 font-bold">{activeDialect?.label}</strong>.
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
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed shadow-md ${
                    isAssistant
                      ? 'bg-[#122226] text-slate-100 rounded-tr-none border border-emerald-950/80'
                      : 'bg-emerald-600 text-white rounded-tl-none font-medium'
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
                            className="p-3 rounded-xl bg-[#091416] border border-emerald-500/30 flex items-center justify-between gap-3 text-right"
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
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shrink-0 shadow-sm"
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

                {/* Suggested Quick Replies */}
                {isAssistant && msg.suggestedQuickReplies && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                    {msg.suggestedQuickReplies.map((qr, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(qr)}
                        className="px-3 py-1 rounded-full bg-[#102023] hover:bg-[#14292d] border border-emerald-500/30 text-emerald-300 text-[11px] transition-colors"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isAiLoading && (
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#122226] text-emerald-400 text-xs w-24">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Order Confirmed Banner Toast */}
        {confirmedOrderNum && (
          <div className="p-3 bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-between px-6 z-20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم إتمام طلبك بنجاح برقم {confirmedOrderNum}! مسجل في لوحة التاجر.</span>
            </div>
            <button
              onClick={() => setConfirmedOrderNum(null)}
              className="text-slate-950 hover:underline text-[11px]"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* Input Message Area */}
        <div className="p-3 sm:p-4 bg-[#102023] border-t border-emerald-950/80">
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
              placeholder={`تحدث مع ${state.aiEmployee.name} بلهجتك (${activeDialect?.label})...`}
              className="flex-1 bg-[#091416] border border-emerald-950/80 focus:border-emerald-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isAiLoading || !inputMessage.trim()}
              className="p-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 rounded-xl font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              <Send className="w-4 h-4 fill-current" />
            </button>
          </form>
        </div>
      </div>

      {/* SLIDING CART DRAWER (سلة التسوق المدمجة) */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-start">
          <div className="w-full max-w-md bg-[#0D181A] border-r border-emerald-900/60 h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
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
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {state.cart.map((c) => (
                    <div
                      key={c.item.id}
                      className="p-3 rounded-xl bg-[#102023] border border-slate-800 text-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <span className="font-bold text-white block mb-0.5">{c.item.name}</span>
                        <span className="text-emerald-400 font-mono font-semibold">
                          {c.item.price} {c.item.currency}
                        </span>
                        {c.item.requiresBooking && (
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            يتطلب حجز موعد
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-[#091416] p-1 rounded-lg border border-slate-700">
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
                  <span className="text-slate-400">الإجمالي النهائي:</span>
                  <span className="font-bold text-lg text-emerald-400 font-mono">
                    {totalCart} {state.merchant.currency}
                  </span>
                </div>

                <button
                  onClick={() => setCheckoutModal(true)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>إتمام الطلب والدفع الفوري (Checkout)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL SIMULATION */}
      {checkoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0E1A1C] border border-emerald-800/80 rounded-2xl max-w-md w-full p-6 text-right shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">إتمام الطلب وتأكيد الحجز</h3>
              <button onClick={() => setCheckoutModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">اسم العميل</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#102023] border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">رقم الجوال (واتساب)</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#102023] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">العنوان / المدينة</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-[#102023] border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              {/* Payment Methods */}
              <div className="p-3 rounded-xl bg-[#102023] border border-slate-800">
                <div className="font-bold text-slate-200 mb-2">طريقة الدفع المعتمدة:</div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold">
                    مدى / Apple Pay
                  </div>
                  <div className="p-2 rounded-lg bg-[#0D181A] border border-slate-700 text-slate-400">
                    فيزا / ماستركارد
                  </div>
                  <div className="p-2 rounded-lg bg-[#0D181A] border border-slate-700 text-slate-400">
                    عند الاستلام
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                <span>المبلغ المطلوب:</span>
                <span className="text-emerald-400 font-mono">
                  {totalCart} {state.merchant.currency}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تأكيد الطلب والدفع الفوري</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

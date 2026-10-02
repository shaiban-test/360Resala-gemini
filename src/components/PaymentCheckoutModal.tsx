/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PaymentInvoice } from '../types';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  X,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface PaymentCheckoutModalProps {
  invoice: PaymentInvoice | null;
  onClose: () => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  invoice,
  onClose,
}) => {
  const { payInvoice, state } = useAppStore();
  const [selectedMethod, setSelectedMethod] = useState<'mada' | 'apple_pay' | 'credit_card'>('apple_pay');
  const [cardNumber, setCardNumber] = useState('5888 5000 1234 5678');
  const [cardHolder, setCardHolder] = useState('MOHAMMED AL-SAUD');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('321');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(invoice?.status === 'paid');

  if (!invoice) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      payInvoice(invoice.id, selectedMethod);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#091417] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/80 text-right overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 blur-3xl pointer-events-none rounded-full" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">بوابة الدفع الفوري 360Resala</h3>
                <p className="text-xs text-slate-400">دفع آمن ومشفر متوافق مع بنوك المملكة</p>
              </div>
            </div>

            {/* Invoice Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>رقم الفاتورة:</span>
                <span className="font-mono text-emerald-400 font-semibold">{invoice.id}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>اسم العميل:</span>
                <span className="text-slate-200">{invoice.customerName}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span>بوابة الدفع النشطة:</span>
                <span className="text-teal-300 font-medium uppercase">{state.paymentConfig.activeProvider} Gateway</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-200">المبلغ الإجمالي:</span>
                <span className="text-2xl font-black text-emerald-400 font-['Plus_Jakarta_Sans',sans-serif]">
                  {invoice.amount} <span className="text-sm font-semibold">{invoice.currency}</span>
                </span>
              </div>
            </div>

            {/* Payment Methods Tabs */}
            <div className="space-y-3 mb-6">
              <label className="text-xs font-semibold text-slate-300 block">اختر وسيلة الدفع:</label>

              {/* Apple Pay Button */}
              {state.paymentConfig.enableApplePay && (
                <button
                  type="button"
                  onClick={() => setSelectedMethod('apple_pay')}
                  className={`w-full py-3 px-4 rounded-2xl border flex items-center justify-between transition-all ${
                    selectedMethod === 'apple_pay'
                      ? 'bg-black text-white border-white/60 shadow-lg ring-1 ring-white/40'
                      : 'bg-black/60 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg"></span>
                    <span className="text-sm font-bold font-['Plus_Jakarta_Sans',sans-serif]">Apple Pay</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">سداد فوري بنقرة واحدة</span>
                </button>
              )}

              {/* Mada Button */}
              {state.paymentConfig.enableMada && (
                <button
                  type="button"
                  onClick={() => setSelectedMethod('mada')}
                  className={`w-full py-3 px-4 rounded-2xl border flex items-center justify-between transition-all ${
                    selectedMethod === 'mada'
                      ? 'bg-emerald-950/40 text-emerald-200 border-emerald-500/60 shadow-lg'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-[11px] tracking-wider">
                      mada مدى
                    </span>
                    <span className="text-sm font-semibold">بطاقة مدى البنكية</span>
                  </div>
                  <span className="text-xs text-slate-400">جميع البنوك السعودية</span>
                </button>
              )}

              {/* Credit Card Button */}
              {state.paymentConfig.enableCreditCard && (
                <button
                  type="button"
                  onClick={() => setSelectedMethod('credit_card')}
                  className={`w-full py-3 px-4 rounded-2xl border flex items-center justify-between transition-all ${
                    selectedMethod === 'credit_card'
                      ? 'bg-teal-950/40 text-teal-200 border-teal-500/60 shadow-lg'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-teal-400" />
                    <span className="text-sm font-semibold">بطاقة فيزا / ماستركارد</span>
                  </div>
                  <span className="text-xs text-slate-400">Visa / Mastercard</span>
                </button>
              )}
            </div>

            {/* Mada / Credit Card Form Fields */}
            {selectedMethod !== 'apple_pay' && (
              <div className="space-y-3 mb-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">رقم البطاقة</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-left focus:border-emerald-500 focus:outline-none"
                    dir="ltr"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">تاريخ الانتهاء</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-center focus:border-emerald-500 focus:outline-none"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">رمز الأمان (CVV)</label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-center focus:border-emerald-500 focus:outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>جارٍ معالجة الدفع الآمن...</span>
                </>
              ) : selectedMethod === 'apple_pay' ? (
                <>
                  <span>ادفع الآن عبر Pay</span>
                  <span className="font-mono">({invoice.amount} {invoice.currency})</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>تأكيد ودفع {invoice.amount} {invoice.currency}</span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>مشفر بشهادة SSL 256-bit ومعتمد من البنك المركزي السعودي SAMA</span>
            </div>
          </div>
        ) : (
          /* Payment Success State */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-in zoom-in duration-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">تم الدفع بنجاح! 🎉</h3>
              <p className="text-xs text-slate-300 mt-1">
                تم استلام مبلغ <span className="text-emerald-400 font-bold">{invoice.amount} {invoice.currency}</span> بنجاح عبر{' '}
                <span className="text-teal-300 font-bold uppercase">{invoice.paymentMethod || selectedMethod}</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 text-xs text-right space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>رقم العملية (Moyasar Reference):</span>
                <span className="font-mono text-emerald-400">MOY-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>رقم الطلب المرتبط:</span>
                <span className="font-mono text-slate-200">{invoice.orderId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>تاريخ السداد:</span>
                <span className="text-slate-200">{new Date().toLocaleTimeString('ar-SA')}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 text-right">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>تم إرسال إشعار تأكيد وفاتورة إلكترونية رسمية إلى واتساب العميل فورياً!</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>إغلاق والعودة للمنصة</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

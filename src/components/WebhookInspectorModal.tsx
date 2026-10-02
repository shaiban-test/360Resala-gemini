/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Activity,
  Send,
  CheckCircle2,
  Copy,
  Terminal,
  RefreshCw,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface WebhookInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WebhookInspectorModal: React.FC<WebhookInspectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { state, simulateInboundWebhook } = useAppStore();
  const [senderPhone, setSenderPhone] = useState('+966503602026');
  const [testMessage, setTestMessage] = useState('مرحباً، أبي أحجز موعد تنظيف شقة بكرة؟');
  const [isSimulating, setIsSimulating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);

  if (!isOpen) return null;

  const webhookUrl = state.metaConfig.webhookCallbackUrl;
  const verifyToken = state.metaConfig.webhookVerifyToken;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulate = async () => {
    if (!testMessage.trim()) return;
    setIsSimulating(true);
    await simulateInboundWebhook(senderPhone, testMessage);
    setIsSimulating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#071114] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/80 text-right overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">فاحص الويب هوك المباشر (Meta Webhook Inspector)</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  متصل ومفعل
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                فحص واستقبال رسائل Meta WhatsApp Cloud API الحقيقية ومحاكاتها
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Webhook Configuration Box */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-slate-300 block">رابط الويب هوك الرسمي (Callback URL):</span>
              <code className="text-xs text-emerald-400 font-mono select-all break-all">{webhookUrl}</code>
            </div>
            <button
              onClick={() => handleCopy(webhookUrl)}
              className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span className="text-slate-500">رمز التحقق (Verify Token): </span>
              <span className="font-mono text-teal-300 font-semibold">{verifyToken}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>جاهز للاعتماد في Meta for Developers</span>
            </div>
          </div>
        </div>

        {/* Live Simulator & Logs Columns */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 overflow-hidden">
          {/* Simulator Panel (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>محاكي إرسال رسالة من عميل واتساب</span>
              </h4>
              <p className="text-[11px] text-slate-400 mb-4">
                جرّب إرسال رسالة تجريبية لترى كيف يستجيب الويب هوك والموظف الذكي
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">رقم هاتف العميل (محاكاة)</label>
                  <input
                    type="text"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-left focus:border-emerald-500 focus:outline-none"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">نص الرسالة الواردة</label>
                  <textarea
                    rows={3}
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="اكتب رسالة العميل هنا..."
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 w-full">أمثلة سريعة:</span>
                  {[
                    'بكم عطر الفخامة الملكي؟',
                    'أبي أحجز تنظيف منزلي',
                    'طرق الدفع المتوفرة؟',
                    'أبي أتكلم مع موظف بشري',
                  ].map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => setTestMessage(sample)}
                      className="text-[10px] px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-emerald-300 hover:bg-slate-700 transition-colors"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>جارٍ المعالجة عبر الويب هوك...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال الرسالة للويب هوك فوراً</span>
                </>
              )}
            </button>
          </div>

          {/* Real-time Logs List (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-slate-200">سجل الأحداث والويب هوك المباشر</h4>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {state.webhookLogs.length} سجلات
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-xs">
              {state.webhookLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    log.direction === 'inbound'
                      ? 'bg-slate-900/90 border-emerald-500/20 hover:border-emerald-500/50'
                      : 'bg-[#09171a] border-teal-500/20 hover:border-teal-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.direction === 'inbound'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                      }`}
                    >
                      {log.direction === 'inbound' ? 'وارد (Inbound)' : 'صادر (Outbound)'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>

                  <p className="text-slate-200 text-xs font-medium line-clamp-2">{log.content}</p>

                  {log.senderPhone && (
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span>الرقم: <span className="font-mono text-slate-400">{log.senderPhone}</span></span>
                      <span className="text-emerald-400 text-[10px] font-bold">200 OK</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Selected Log JSON Preview */}
            {selectedLog && (
              <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] max-h-36 overflow-y-auto">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="font-semibold text-emerald-400">تفاصيل الحمولة (Payload):</span>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    إغلاق
                  </button>
                </div>
                <pre className="font-mono text-slate-300 text-[10px] whitespace-pre-wrap" dir="ltr">
                  {JSON.stringify(selectedLog.rawPayload, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

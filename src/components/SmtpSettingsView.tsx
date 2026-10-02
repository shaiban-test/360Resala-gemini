/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Mail,
  Server,
  Key,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Lock,
  Sparkles,
} from 'lucide-react';

export const SmtpSettingsView: React.FC = () => {
  const { state, updateSmtpConfig, sendTestEmail, sendVerificationOtp, sendPasswordResetEmail } = useAppStore();

  const [host, setHost] = useState(state.smtpConfig.host);
  const [port, setPort] = useState(state.smtpConfig.port.toString());
  const [encryption, setEncryption] = useState(state.smtpConfig.encryption);
  const [username, setUsername] = useState(state.smtpConfig.username);
  const [password, setPassword] = useState(state.smtpConfig.password);
  const [senderName, setSenderName] = useState(state.smtpConfig.senderName);
  const [senderEmail, setSenderEmail] = useState(state.smtpConfig.senderEmail);

  const [testEmailAddress, setTestEmailAddress] = useState('wise2881@gmail.com');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testAlert, setTestAlert] = useState<{ success: boolean; message: string } | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSmtpConfig({
      host,
      port: Number(port),
      encryption,
      username,
      password,
      senderName,
      senderEmail,
      status: 'configured',
    });
    setTestAlert({
      success: true,
      message: 'تم حفظ إعدادات خادم SMTP بنجاح!',
    });
    setTimeout(() => setTestAlert(null), 3000);
  };

  const handleSendTest = async () => {
    if (!testEmailAddress.trim()) return;
    setIsSendingTest(true);
    setTestAlert(null);
    try {
      const res = await sendTestEmail(testEmailAddress);
      setTestAlert(res);
    } catch {
      setTestAlert({ success: false, message: 'حدث خطأ أثناء الاتصال بخادم البريد' });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSimulateOtp = () => {
    const otp = sendVerificationOtp(testEmailAddress);
    setTestAlert({
      success: true,
      message: `تم إرسال بريد يحمل رمز التحقق OTP (${otp}) إلى ${testEmailAddress} بنجاح!`,
    });
  };

  const handleSimulateReset = () => {
    sendPasswordResetEmail(testEmailAddress);
    setTestAlert({
      success: true,
      message: `تم إرسال رابط استعادة كلمة المرور المشفر إلى ${testEmailAddress} بنجاح!`,
    });
  };

  return (
    <div className="space-y-6 text-right font-['Cairo',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">إعدادات خادم البريد الإلكتروني (SMTP & Notifications)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            تهيئة استقبال العملاء الجدد وإرسال رسائل التحقق (OTP) وروابط استعادة كلمة المرور وإشعارات الفواتير
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>حالة SMTP: {state.smtpConfig.status === 'tested_success' ? 'تم الاختبار بنجاح ✓' : 'مضبوط وجاهز'}</span>
          </span>
        </div>
      </div>

      {testAlert && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2 border animate-in fade-in duration-200 ${
            testAlert.success
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
          }`}
        >
          {testAlert.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
          <span>{testAlert.message}</span>
        </div>
      )}

      {/* Main Grid: Settings (7 cols) + Test & Simulator (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Settings (7 cols) */}
        <form onSubmit={handleSaveConfig} className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Server className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">بيانات اتصال خادم SMTP</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">خادم SMTP (Host)</label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="mail.360services.org"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-left"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">المنفذ (Port)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-center"
                  dir="ltr"
                  required
                />
                <select
                  value={encryption}
                  onChange={(e) => setEncryption(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white text-xs text-center"
                >
                  <option value="tls">TLS (موصى به)</option>
                  <option value="ssl">SSL (465)</option>
                  <option value="none">بدون تشفير</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">اسم المستخدم / البريد (Username)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="notifications@360services.org"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-left"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">كلمة مرور التطبيق (App Password)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-left"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">اسم المرسل (Sender Name)</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="منصة 360Resala"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">عنوان بريد المرسل (From Email)</label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="noreply@360services.org"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-left"
                dir="ltr"
                required
              />
            </div>
          </div>

          {/* Trigger Toggles */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 block mb-1">الرسائل التلقائية المفعلة للعملاء:</span>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs cursor-pointer">
              <span className="text-slate-200">إرسال كود التحقق (OTP) عند تسجيل عميل جديد</span>
              <input
                type="checkbox"
                checked={state.smtpConfig.enableSignupVerification}
                onChange={(e) => updateSmtpConfig({ enableSignupVerification: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs cursor-pointer">
              <span className="text-slate-200">إرسال رابط آمن عند تغيير أو نسيان كلمة المرور</span>
              <input
                type="checkbox"
                checked={state.smtpConfig.enablePasswordReset}
                onChange={(e) => updateSmtpConfig({ enablePasswordReset: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs cursor-pointer">
              <span className="text-slate-200">إرسال إشعار فوري بفاتورة السداد وإيصال الدفع</span>
              <input
                type="checkbox"
                checked={state.smtpConfig.enablePaymentReceipts}
                onChange={(e) => updateSmtpConfig({ enablePaymentReceipts: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:brightness-110 transition-all shadow-md shadow-emerald-500/20"
          >
            حفظ إعدادات خادم SMTP
          </button>
        </form>

        {/* Live Test & Simulator Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Send className="w-4 h-4 text-teal-400" />
              <h3 className="font-bold text-white text-sm">اختبار الإرسال الحي والمحاكاة</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">البريد الإلكتروني المستلم للتجربة</label>
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono text-left"
                  dir="ltr"
                />
              </div>

              <button
                type="button"
                onClick={handleSendTest}
                disabled={isSendingTest}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                {isSendingTest ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>جارٍ الاتصال بالخادم والإرسال...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>إرسال بريد تجريبي الآن (Ping SMTP)</span>
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 block font-semibold">محاكاة الرسائل الرسمية للعملاء:</span>

                <button
                  type="button"
                  onClick={handleSimulateOtp}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs text-right flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>محاكاة إرسال كود تحقق OTP (تسجيل حساب)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">6 أرقام</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateReset}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs text-right flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-teal-400" />
                    <span>محاكاة إرسال رابط نسيت كلمة المرور</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">مشفر</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Delivery Logs Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">سجل رسائل البريد المرسلة للعملاء</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{state.emailLogs.length} رسائل</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3 font-semibold">المستلم</th>
                <th className="p-3 font-semibold">موضوع الرسالة</th>
                <th className="p-3 font-semibold">النوع</th>
                <th className="p-3 font-semibold">التوقيت</th>
                <th className="p-3 font-semibold">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {state.emailLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-mono text-slate-200" dir="ltr">{log.recipient}</td>
                  <td className="p-3">
                    <div className="font-semibold text-white">{log.subject}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{log.previewText}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                      {log.type === 'verification_code' ? 'تفعيل OTP' : log.type === 'password_reset' ? 'استعادة كلمة المرور' : 'إشعار'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                  <td className="p-3">
                    <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>تم التسليم</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { BrandLogo } from './BrandLogo';
import {
  Lock,
  Mail,
  User,
  Phone,
  Building2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { googleSignIn } from '../services/googleAuth';

export const MerchantAuthView: React.FC = () => {
  const {
    state,
    loginMerchant,
    registerMerchant,
    sendVerificationOtp,
    sendPasswordResetEmail,
    setView,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('contact@360services.org');
  const [loginPassword, setLoginPassword] = useState('demo123456');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regOwnerName, setRegOwnerName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+966 50 ');
  const [regPassword, setRegPassword] = useState('');
  const [regNature, setRegNature] = useState<'products' | 'services' | 'both'>('both');
  const [regError, setRegError] = useState<string | null>(null);

  // Forgot password / OTP modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('contact@360services.org');
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Quick OTP login state
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [sentOtpCode, setSentOtpCode] = useState<string | null>(null);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (isOtpMode) {
      if (enteredOtp.trim() === sentOtpCode) {
        loginMerchant(loginEmailOrPhone);
        return;
      } else {
        setLoginError('رمز التحقق المدخل غير صحيح. يرجى إعادة المحاولة.');
        return;
      }
    }

    if (!loginEmailOrPhone || !loginPassword) {
      setLoginError('يرجى ملء جميع الحقول للمتابعة.');
      return;
    }

    const success = loginMerchant(loginEmailOrPhone, loginPassword);
    if (!success) {
      setLoginError('البريد أو كلمة المرور غير مطابقة. يمكنك تجربة البيانات التجريبية أو الدخول برمز OTP.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regBusinessName.trim() || !regOwnerName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('يرجى تعبئة كافة الحقول المطلوبة لإنشاء حساب التاجر.');
      return;
    }

    registerMerchant({
      businessName: regBusinessName,
      ownerName: regOwnerName,
      email: regEmail,
      phone: regPhone,
      natureOfBusiness: regNature,
    });
  };

  const handleRequestOtp = () => {
    if (!loginEmailOrPhone.trim()) {
      setLoginError('يرجى إدخال البريد الإلكتروني أو رقم الهاتف لاستلام الرمز.');
      return;
    }
    const code = sendVerificationOtp(loginEmailOrPhone);
    setSentOtpCode(code);
    setIsOtpMode(true);
    setOtpNotice(`تم إرسال كود التحقق السري (${code}) بنجاح إلى ${loginEmailOrPhone}`);
  };

  const handleSendForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    sendPasswordResetEmail(forgotEmail);
    setForgotSuccess(`تم إرسال رابط استعادة كلمة المرور المشفر إلى ${forgotEmail}`);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(null);
    }, 3500);
  };

  const handleGoogleAuth = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        loginMerchant(res.user.email || 'google_user@360services.org');
      }
    } catch (err: any) {
      setLoginError(err.message || 'فشل تسجيل الدخول بحساب Google');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative font-['Cairo',sans-serif] text-right">
      {/* Glow backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-[#071317] border border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand Logo & Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="lg" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            بوابة تجار 360Resala
          </h2>
          <p className="text-xs text-slate-400">
            سجّل الدخول لإدارة موظفك الذكي، استقبال طلبات واتساب، ومتابعة مبيعاتك
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="p-1 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setLoginError(null);
            }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setRegError(null);
            }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            إنشاء حساب تاجر
          </button>
        </div>

        {/* Demo Credentials Box */}
        {activeTab === 'login' && !isOtpMode && (
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <KeyRound className="w-3.5 h-3.5" />
              <span>بيانات تجريبية جاهزة للاختبار السريع:</span>
            </div>
            <div className="flex justify-between font-mono text-[10px]">
              <span className="text-slate-400">البريد: contact@360services.org</span>
              <span className="text-slate-400">المرور: demo123456</span>
            </div>
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            {otpNotice && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{otpNotice}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                البريد الإلكتروني أو رقم الواتساب
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={loginEmailOrPhone}
                  onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                  placeholder="contact@360services.org"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pl-10 text-white font-mono text-left focus:border-emerald-500 focus:outline-none"
                  dir="ltr"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            {!isOtpMode ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-semibold">كلمة المرور</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-white font-mono text-left focus:border-emerald-500 focus:outline-none"
                    dir="ltr"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="text-slate-500 hover:text-slate-300 absolute right-3 top-3"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  رمز التحقق (OTP) المكون من 6 أرقام
                </label>
                <input
                  type="text"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full bg-slate-950 border border-emerald-500 rounded-xl px-4 py-2.5 text-center text-lg font-mono text-emerald-400 tracking-widest focus:outline-none"
                  dir="ltr"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isOtpMode ? 'تأكيد الدخول برمز التحقق' : 'الدخول إلى لوحة التاجر'}</span>
            </button>

            {/* Quick OTP toggle */}
            {!isOtpMode ? (
              <button
                type="button"
                onClick={handleRequestOtp}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all text-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>دخول سريع بدون كلمة مرور (إرسال كود OTP)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsOtpMode(false)}
                className="w-full text-center text-[11px] text-slate-400 hover:text-white"
              >
                العودة للدخول بكلمة المرور
              </button>
            )}

            {/* Google Sign-in Alternative */}
            <div className="pt-3 border-t border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 block mb-2">أو الدخول بحساب Google المعتمد:</span>
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span>الدخول السريع عبر Google</span>
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            {regError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{regError}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">اسم المتجر / النشاط التجاري</label>
              <div className="relative">
                <input
                  type="text"
                  value={regBusinessName}
                  onChange={(e) => setRegBusinessName(e.target.value)}
                  placeholder="مثال: عطور الزمرد، مركز النخبة"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 pl-9 text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">اسم المالك / المدير</label>
              <div className="relative">
                <input
                  type="text"
                  value={regOwnerName}
                  onChange={(e) => setRegOwnerName(e.target.value)}
                  placeholder="مثال: عبد العزيز القحطاني"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 pl-9 text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="merchant@example.sa"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 pl-9 text-white font-mono text-left focus:border-emerald-500 focus:outline-none"
                  dir="ltr"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">رقم الواتساب الرسمي</label>
              <div className="relative">
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+966 50 123 4567"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 pl-9 text-white font-mono text-left focus:border-emerald-500 focus:outline-none"
                  dir="ltr"
                  required
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">طبيعة النشاط</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'products', label: 'منتجات' },
                  { id: 'services', label: 'خدمات ومواعيد' },
                  { id: 'both', label: 'كلاهما معاً' },
                ].map((nat) => (
                  <button
                    key={nat.id}
                    type="button"
                    onClick={() => setRegNature(nat.id as any)}
                    className={`py-2 px-1 rounded-xl text-center font-bold text-xs transition-all border ${
                      regNature === nat.id
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {nat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 pl-9 text-white font-mono text-left focus:border-emerald-500 focus:outline-none"
                  dir="ltr"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>إنشاء الحساب وبدء التجربة المجانية</span>
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="pt-2 text-center">
          <button
            onClick={() => setView('landing')}
            className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>العودة للصفحة الرئيسية</span>
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#091518] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full text-right shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">استعادة كلمة المرور</h3>
            <p className="text-xs text-slate-400 mb-4">
              أدخل بريدك الإلكتروني المسجل لإرسال رابط إعادة تعيين كلمة المرور فوراً عبر خادم SMTP
            </p>

            {forgotSuccess ? (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{forgotSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSendForgotPassword} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">البريد الإلكتروني المسجل</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="contact@360services.org"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-left focus:border-emerald-500 focus:outline-none"
                    dir="ltr"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs"
                  >
                    إرسال رابط الاستعادة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

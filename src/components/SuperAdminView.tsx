/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  ShieldCheck,
  Key,
  Server,
  CheckCircle2,
  AlertCircle,
  Copy,
  RefreshCw,
  Users,
  MessageSquare,
  Activity,
  Layers,
  ExternalLink,
  Code2,
  Lock,
} from 'lucide-react';

export const SuperAdminView: React.FC = () => {
  const { state, updateMetaConfig, updateAdminCredentials, logoutAdmin, pushToGitHub } = useAppStore();
  const [config, setConfig] = useState(state.metaConfig);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // GitHub Push State
  const [githubToken, setGithubToken] = useState('');
  const [githubRepoUrl, setGithubRepoUrl] = useState('https://github.com/shaiban-test/Chatapp.git');
  const [isPushingGit, setIsPushingGit] = useState(false);
  const [gitPushResult, setGitPushResult] = useState<{ success: boolean; message: string; output?: string } | null>(null);

  // Admin Credentials State
  const [newUsername, setNewUsername] = useState(state.adminCredentials.username);
  const [newPassword, setNewPassword] = useState(state.adminCredentials.passwordHash);
  const [credSaved, setCredSaved] = useState(false);

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePushGit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubToken.trim()) {
      setGitPushResult({
        success: false,
        message: 'يرجى إدخال رمز الوصول الشخصي (GitHub Personal Access Token) بصلاحية repo للمتابعة.',
      });
      return;
    }
    setIsPushingGit(true);
    setGitPushResult(null);
    try {
      const res = await pushToGitHub(githubToken.trim(), githubRepoUrl.trim());
      setGitPushResult(res);
    } catch (err: any) {
      setGitPushResult({
        success: false,
        message: err.message || 'حدث خطأ أثناء رفع الملفات إلى GitHub.',
      });
    } finally {
      setIsPushingGit(false);
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminCredentials(newUsername, newPassword);
    setCredSaved(true);
    setTimeout(() => setCredSaved(false), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMetaConfig(config);
    setTestResult({
      success: true,
      message: 'تم حفظ إعدادات موفر خدمات ميتا (Meta Tech Provider) بنجاح!',
    });
    setTimeout(() => setTestResult(null), 3500);
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/meta/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      setTestResult({
        success: data.success,
        message: data.message || 'تم فحص الاتصال بميتا بنجاح.',
      });
    } catch (e: any) {
      setTestResult({
        success: false,
        message: 'تعذر الاتصال بـ Meta Graph API، تحقق من المفاتيح والشبكة.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070E10] text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-950/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold">
                لوحة الإدارة العليا • Super Admin Console
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Meta Tech Provider Verified ✓
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              تهيئة موفر خدمات ميتا (Meta Business Solutions & Embedded Signup)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              إدارة مفاتيح تطبيق Meta، وتفعيل الربط السحابي للعملاء عبر Embedded Signup، ومراقبة حسابات التجار.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={testConnection}
              disabled={isTesting}
              className="px-4 py-2 bg-[#122226] hover:bg-[#162c31] border border-sky-500/30 text-sky-300 font-semibold text-xs rounded-xl transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>فحص الاتصال مع Meta API</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold text-xs rounded-xl transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* GITHUB REPOSITORY SYNC SECTION (Chatapp Repository) */}
        <div className="p-6 rounded-2xl bg-[#0D181A] border border-emerald-500/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  مزامنة ونقل الملفات إلى GitHub (shaiban-test/Chatapp)
                </h3>
                <p className="text-xs text-slate-400">
                  المستودع الهدف: <span className="font-mono text-emerald-400">https://github.com/shaiban-test/Chatapp.git</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              جاهز للرفع
            </span>
          </div>

          {gitPushResult && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                gitPushResult.success
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
              }`}
            >
              {gitPushResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <div className="leading-relaxed whitespace-pre-wrap">{gitPushResult.message}</div>
            </div>
          )}

          <form onSubmit={handlePushGit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  رابط المستودع في GitHub
                </label>
                <input
                  type="text"
                  value={githubRepoUrl}
                  onChange={(e) => setGithubRepoUrl(e.target.value)}
                  className="w-full bg-[#102023] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  رمز الوصول الشخصي من GitHub (Personal Access Token)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (بصلاحية repo)"
                    className="w-full bg-[#102023] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                  />
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-slate-400">
                <span>أو يمكنك الرفع يدوياً عبر سطر الأوامر: </span>
                <code className="text-emerald-400 bg-slate-900 px-2 py-0.5 rounded font-mono text-[10px]">
                  git push https://&lt;TOKEN&gt;@github.com/shaiban-test/Chatapp.git main
                </code>
              </div>

              <button
                type="submit"
                disabled={isPushingGit}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPushingGit ? 'animate-spin' : ''}`} />
                <span>{isPushingGit ? 'جاري رفع الملفات إلى GitHub...' : 'رفع ومزامنة المستودع إلى GitHub الآن'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* ADMIN ACCOUNT & SECURITY SETTINGS */}
        <div className="p-6 rounded-2xl bg-[#0D181A] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-sky-400" />
              <h3 className="font-bold text-sm text-white">إدارة بيانات حساب الأدمن (Admin Credentials)</h3>
            </div>
            {credSaved && (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                تم حفظ بيانات الدخول الجديدة بنجاح!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveCredentials} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">اسم المستخدم</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full bg-[#102023] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">كلمة المرور الجديدة</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#102023] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-4 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-bold text-xs rounded-lg transition-colors"
            >
              حفظ بيانات الدخول
            </button>
          </form>
        </div>

        {/* Global Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0D181A] border border-emerald-950/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>التجار المشتركون</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">148</div>
            <div className="text-[10px] text-emerald-400 mt-1">+12 متجر هذا الأسبوع</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D181A] border border-emerald-950/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>أرقام WABA النشطة</span>
              <ShieldCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">132</div>
            <div className="text-[10px] text-sky-400 mt-1">عبر Embedded Signup الرسمي</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D181A] border border-emerald-950/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>أرقام QR Code المربوطة</span>
              <MessageSquare className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">16</div>
            <div className="text-[10px] text-slate-400 mt-1">ربط سريع ومباشر</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D181A] border border-emerald-950/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>رسائل الموظف الذكي اليوم</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">48,290</div>
            <div className="text-[10px] text-emerald-400 mt-1">معدل استجابة 0.8 ثانية</div>
          </div>
        </div>

        {/* Test Result Banner */}
        {testResult && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
              testResult.success
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            )}
            <div className="leading-relaxed">{testResult.message}</div>
          </div>
        )}

        {/* Configuration Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0D181A] border border-emerald-950/80 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-400" />
                <h2 className="font-bold text-base text-white">
                  بيانات حساب موفر حلول ميتا (Meta Tech Provider App)
                </h2>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">v24.0 Graph API</span>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Meta App ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Meta App ID
                  </label>
                  <input
                    type="text"
                    value={config.appId}
                    onChange={(e) => setConfig({ ...config, appId: e.target.value })}
                    placeholder="e.g. 184920491827402"
                    className="w-full bg-[#102023] border border-slate-800 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none transition-colors"
                  />
                </div>

                {/* Embedded Signup Config ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Embedded Signup Config ID
                  </label>
                  <input
                    type="text"
                    value={config.embeddedSignupConfigId}
                    onChange={(e) =>
                      setConfig({ ...config, embeddedSignupConfigId: e.target.value })
                    }
                    placeholder="e.g. 298172640192837"
                    className="w-full bg-[#102023] border border-slate-800 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none transition-colors"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    المعرّف الذي يربط نافذة فيسبوك بتطبيقك المعتمد لتمكين العملاء من ربط أرقامهم.
                  </p>
                </div>
              </div>

              {/* Meta App Secret */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Meta App Secret
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={config.appSecret}
                    onChange={(e) => setConfig({ ...config, appSecret: e.target.value })}
                    placeholder="••••••••••••••••••••••••"
                    className="w-full bg-[#102023] border border-slate-800 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none transition-colors"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* System User Token */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  System User Access Token (Meta Permanent Token)
                </label>
                <textarea
                  rows={2}
                  value={config.systemUserToken}
                  onChange={(e) => setConfig({ ...config, systemUserToken: e.target.value })}
                  placeholder="EAAGNo...v24.0..."
                  className="w-full bg-[#102023] border border-slate-800 focus:border-emerald-400 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Webhook URLs */}
              <div className="p-4 rounded-xl bg-[#102023] border border-slate-800 space-y-3">
                <div className="font-semibold text-xs text-emerald-400 flex items-center gap-1.5">
                  <Server className="w-4 h-4" />
                  <span>إعدادات رابط الويب هوك (Meta Webhook Endpoint)</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Callback URL:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(config.webhookCallbackUrl, 'webhookUrl')}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedKey === 'webhookUrl' ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={config.webhookCallbackUrl}
                    className="w-full bg-[#0D181A] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Verify Token:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(config.webhookVerifyToken, 'verifyToken')}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedKey === 'verifyToken' ? 'تم النسخ!' : 'نسخ الرمز'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={config.webhookVerifyToken}
                    onChange={(e) =>
                      setConfig({ ...config, webhookVerifyToken: e.target.value })
                    }
                    className="w-full bg-[#0D181A] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono"
                  />
                </div>
              </div>

              {/* Partner Name & BM ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    اسم الشريك المعتمد (Partner Brand Name)
                  </label>
                  <input
                    type="text"
                    value={config.partnerName}
                    onChange={(e) => setConfig({ ...config, partnerName: e.target.value })}
                    className="w-full bg-[#102023] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Business Manager ID
                  </label>
                  <input
                    type="text"
                    value={config.businessManagerId}
                    onChange={(e) => setConfig({ ...config, businessManagerId: e.target.value })}
                    className="w-full bg-[#102023] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20"
                >
                  حفظ وتحديث إعدادات موفر حلول ميتا
                </button>
              </div>
            </form>
          </div>

          {/* Embedded Signup Integration Code Preview */}
          <div className="bg-[#0D181A] border border-emerald-950/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Code2 className="w-5 h-5 text-sky-400" />
              <h3 className="font-bold text-sm text-white">
                تفعيل الـ Embedded Signup للعملاء
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              عندما يضغط العميل على زر "ربط واتساب" في الـ Onboarding، يُستدعى Facebook JavaScript SDK مع معرّف التكوين المعتمد الخاص بك:
            </p>

            <div className="bg-[#060D0F] p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto space-y-1">
              <div>// Launch Embedded Signup</div>
              <div className="text-sky-300">FB.login(function(response) &#123;</div>
              <div className="pl-4 text-slate-400">if (response.authResponse) &#123;</div>
              <div className="pl-8 text-white">const code = response.authResponse.code;</div>
              <div className="pl-8 text-emerald-400">// Send to backend to exchange WABA ID</div>
              <div className="pl-4 text-slate-400">&#125;</div>
              <div className="text-sky-300">&#125;, &#123;</div>
              <div className="pl-4 text-amber-300">config_id: '{config.embeddedSignupConfigId}',</div>
              <div className="pl-4 text-amber-300">response_type: 'code',</div>
              <div className="pl-4 text-amber-300">override_default_response_type: true</div>
              <div className="text-sky-300">&#125;);</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-2">
              <div className="font-semibold text-slate-200">الصلاحيات المعتمدة تلقائياً:</div>
              <div className="space-y-1">
                <div>✓ whatsapp_business_management</div>
                <div>✓ whatsapp_business_messaging</div>
                <div>✓ business_management</div>
              </div>
            </div>
          </div>
        </div>

        {/* Registered Tenants / Merchants Table */}
        <div className="bg-[#0D181A] border border-emerald-950/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base text-white">قائمة متاجر العملاء والاشتراكات النشطة</h3>
            </div>
            <span className="text-xs text-slate-400">عرض أحدث الحسابات</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3">اسم النشاط</th>
                  <th className="py-3 px-3">المالك</th>
                  <th className="py-3 px-3">الباقة</th>
                  <th className="py-3 px-3">قناة واتساب</th>
                  <th className="py-3 px-3">اللهجة المختارة</th>
                  <th className="py-3 px-3">حالة الموظف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-semibold text-white">
                    {state.merchant.businessName}
                  </td>
                  <td className="py-3 px-3 text-slate-300">{state.merchant.ownerName}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                      {state.merchant.currentPlanId === 'trial'
                        ? 'تجربة مجانية'
                        : state.merchant.currentPlanId}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {state.channels.find((c) => c.status === 'connected')?.phoneNumber ||
                      'بانتظار الربط'}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    🇸🇦 {state.aiEmployee.dialect}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>نشط ويجيب</span>
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-semibold text-white">أطياب النخبة للعطور</td>
                  <td className="py-3 px-3 text-slate-300">سعود القحطاني</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-medium">
                      Pro Growth
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">+966 54 888 1234</td>
                  <td className="py-3 px-3 text-slate-300">🇸🇦 سعودية</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>WABA متصل</span>
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-semibold text-white">صالون بريق الشرق للتجميل</td>
                  <td className="py-3 px-3 text-slate-300">نورة السبيعي</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                      Starter Plan
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">+966 50 999 4321</td>
                  <td className="py-3 px-3 text-slate-300">🇸🇦 سعودية</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>QR Code متصل</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

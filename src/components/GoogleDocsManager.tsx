/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken,
  getCurrentGoogleUser,
} from '../services/googleAuth';
import {
  listMerchantGoogleDocs,
  exportOrdersReportToGoogleDoc,
  exportCatalogToGoogleDoc,
  createGoogleDoc,
  deleteGoogleDoc,
  GoogleDocFile,
} from '../services/googleDocsService';
import {
  FileText,
  ExternalLink,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  User,
  LogOut,
  FolderOpen,
  Trash2,
} from 'lucide-react';

export const GoogleDocsManager: React.FC = () => {
  const { state } = useAppStore();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [docsList, setDocsList] = useState<GoogleDocFile[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<{ title: string; url: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New Doc Dialog
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('تقرير مبيعات جديد');
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);

  // Destructive delete confirmation dialog state
  const [docToDelete, setDocToDelete] = useState<GoogleDocFile | null>(null);
  const [isDeletingDoc, setIsDeletingDoc] = useState(false);

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, accessToken) => {
        setCurrentUser(user);
        setToken(accessToken);
        fetchDocs(accessToken);
      },
      () => {
        setCurrentUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const fetchDocs = async (accessToken: string) => {
    setIsLoadingDocs(true);
    try {
      const list = await listMerchantGoogleDocs(accessToken);
      setDocsList(list);
    } catch (err: any) {
      console.warn('Could not fetch docs list:', err.message);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setToken(result.accessToken);
        await fetchDocs(result.accessToken);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل تسجيل الدخول بحساب Google');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setToken(null);
    setDocsList([]);
  };

  const handleExportOrders = async () => {
    if (!token) return;
    setIsExporting(true);
    setErrorMsg(null);
    setExportSuccess(null);
    try {
      const result = await exportOrdersReportToGoogleDoc({
        merchantName: state.merchant.businessName,
        orders: state.orders,
        appointmentsCount: state.appointments.length,
        accessToken: token,
      });
      setExportSuccess(result);
      await fetchDocs(token);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء تصدير التقرير إلى Google Docs');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCatalog = async () => {
    if (!token) return;
    setIsExporting(true);
    setErrorMsg(null);
    setExportSuccess(null);
    try {
      const result = await exportCatalogToGoogleDoc({
        merchantName: state.merchant.businessName,
        catalogItems: state.catalogItems,
        accessToken: token,
      });
      setExportSuccess(result);
      await fetchDocs(token);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء تصدير الكتالوج إلى Google Docs');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateNewDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newDocTitle.trim()) return;
    setIsCreatingDoc(true);
    setErrorMsg(null);
    try {
      const doc = await createGoogleDoc(newDocTitle.trim(), token);
      setShowNewDocModal(false);
      setExportSuccess({ title: doc.title, url: doc.webViewLink || '' });
      await fetchDocs(token);
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل إنشاء المستند');
    } finally {
      setIsCreatingDoc(false);
    }
  };

  const confirmDeleteDoc = async () => {
    if (!token || !docToDelete) return;
    setIsDeletingDoc(true);
    setErrorMsg(null);
    try {
      await deleteGoogleDoc(docToDelete.id, token);
      setDocToDelete(null);
      await fetchDocs(token);
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل حذف المستند من Google Drive');
    } finally {
      setIsDeletingDoc(false);
    }
  };

  return (
    <div className="space-y-6 text-right font-['Cairo',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">تكامل Google Docs & Google Drive</h2>
              <p className="text-xs text-slate-400">
                تصدير ومزامنة تقارير المبيعات، الحجوزات، والكتالوجات مباشرة إلى حسابك في Google Docs
              </p>
            </div>
          </div>
        </div>

        {/* User Connection Status */}
        {currentUser ? (
          <div className="flex items-center gap-3 bg-[#0a181c] border border-emerald-500/30 rounded-2xl p-2 px-3">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Google User'}
                className="w-8 h-8 rounded-full border border-emerald-500/40"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            )}
            <div className="text-right">
              <div className="text-xs font-bold text-white leading-tight">
                {currentUser.displayName || 'حساب Google متصل'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono leading-tight">
                {currentUser.email}
              </div>
            </div>
            <button
              onClick={handleGoogleLogout}
              title="تسجيل الخروج من Google"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Official Styled Sign in with Google Button */
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
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
            <span>{isLoggingIn ? 'جارٍ الاتصال بـ Google...' : 'ربط حساب Google Docs'}</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {exportSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-xs">تم إنشاء وتحديث المستند في Google Docs بنجاح!</div>
              <div className="text-[11px] text-emerald-300">{exportSuccess.title}</div>
            </div>
          </div>
          <a
            href={exportSuccess.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
          >
            <span>فتح في Google Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* When user is NOT authenticated with Google */}
      {!currentUser ? (
        <div className="p-8 rounded-3xl bg-[#091518] border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xl">
            <FileText className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">قم بربط حساب Google لبدء إدارة التقارير</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              يتيح لك هذا التكامل تصدير تقارير الطلبات، سجلات محادثات العملاء، وقوائم الكتالوج تلقائياً كملفات Google Docs رسمية ومشاركتها مع فريق عملك.
            </p>
          </div>
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg transition-all active:scale-95"
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
            <span>تسجيل الدخول وربط Google Docs</span>
          </button>
        </div>
      ) : (
        /* Action Hub for Google Docs */
        <div className="space-y-6">
          {/* 3 Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Sales & Orders Report */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">تقرير المبيعات والحجوزات</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  توليد مستند شامل يحتوي على إحصائيات الإيرادات، تفاصيل طلبات العملاء، وحجوزات المواعيد.
                </p>
              </div>

              <button
                onClick={handleExportOrders}
                disabled={isExporting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>جارٍ إنشاء التقرير...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير إلى Google Docs</span>
                  </>
                )}
              </button>
            </div>

            {/* Card 2: Catalog Export */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">كتالوج وقائمة الأسعار</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  تصدير جميع المنتجات والخدمات بالأسعار ومناطق التغطية إلى ملف Docs رسمي جاهز للطباعة والمشاركة.
                </p>
              </div>

              <button
                onClick={handleExportCatalog}
                disabled={isExporting}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير الكتالوج إلى Docs</span>
              </button>
            </div>

            {/* Card 3: Custom New Doc */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
                  <Plus className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">إنشاء مستند جديد مخصص</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  إنشاء ملف Google Doc فارغ أو مسودة مخصصة وتخزينها مباشرة داخل مجلد Google Drive الخاص بك.
                </p>
              </div>

              <button
                onClick={() => setShowNewDocModal(true)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إنشاء مستند فارغ</span>
              </button>
            </div>
          </div>

          {/* List of Docs in Google Drive */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">مستندات Google Docs في حسابك</h3>
              </div>
              <button
                onClick={() => token && fetchDocs(token)}
                disabled={isLoadingDocs}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDocs ? 'animate-spin' : ''}`} />
                <span>تحديث القائمة</span>
              </button>
            </div>

            {isLoadingDocs ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <RefreshCw className="w-5 h-5 mx-auto animate-spin text-emerald-400" />
                <span>جارٍ جلب المستندات من Google Drive...</span>
              </div>
            ) : docsList.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                لم يتم العثور على مستندات Google Docs بعد. اضغط على أزرار التصدير أعلاه لإنشاء تقريرك الأول!
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {docsList.map((doc) => (
                  <div
                    key={doc.id}
                    className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-800/20 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-200">{doc.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {new Date(doc.createdTime).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={doc.webViewLink || `https://docs.google.com/document/d/${doc.id}/edit`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <span>فتح في Google Docs</span>
                        <ExternalLink className="w-3 h-3 text-emerald-400" />
                      </a>

                      <button
                        onClick={() => setDocToDelete(doc)}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 transition-colors"
                        title="حذف المستند من Google Drive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: New Custom Doc */}
      {showNewDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#091518] border border-blue-500/40 rounded-3xl p-6 max-w-md w-full text-right shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">إنشاء مستند جديد في Google Docs</h3>
            <p className="text-xs text-slate-400 mb-4">
              سيتم إنشاء المستند وحفظه تلقائياً في حساب Google Drive الخاص بنشاطك
            </p>

            <form onSubmit={handleCreateNewDoc} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">عنوان المستند</label>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="مثال: خطة المبيعات والردود لشهر أكتوبر"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={isCreatingDoc}
                  className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {isCreatingDoc ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>جارٍ الإنشاء...</span>
                    </>
                  ) : (
                    <span>إنشاء المستند</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewDocModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Dialog for Destructive Operations (Delete Google Doc) */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#091518] border border-rose-500/40 rounded-3xl p-6 max-w-md w-full text-right shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">تأكيد حذف المستند من Google Drive</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف المستند التالي نهائياً من حساب Google Drive الخاص بك؟
              </p>
              <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 font-bold text-white text-xs">
                📄 {docToDelete.name}
              </div>
              <p className="text-[11px] text-rose-400 mt-2">
                ⚠️ تنبيه: هذا الإجراء سيقوم بحذف الملف من مساحة Google السحابية ولا يمكن التراجع عنه.
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={confirmDeleteDoc}
                disabled={isDeletingDoc}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {isDeletingDoc ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>جارٍ الحذف...</span>
                  </>
                ) : (
                  <span>نعم، حذف المستند نهائياً</span>
                )}
              </button>
              <button
                onClick={() => setDocToDelete(null)}
                disabled={isDeletingDoc}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                إلغاء الأمر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

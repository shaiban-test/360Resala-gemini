/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GoogleDocFile {
  id: string;
  name: string;
  createdTime: string;
  webViewLink?: string;
}

export const createGoogleDoc = async (
  title: string,
  accessToken: string
): Promise<{ documentId: string; title: string; webViewLink?: string }> => {
  const res = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'فشل في إنشاء مستند Google Docs');
  }

  const data = await res.json();
  const documentId = data.documentId;
  const webViewLink = `https://docs.google.com/document/d/${documentId}/edit`;

  return { documentId, title: data.title || title, webViewLink };
};

export const insertTextToGoogleDoc = async (
  documentId: string,
  text: string,
  accessToken: string
): Promise<any> => {
  const res = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text,
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'فشل في إضافة المحتوى إلى مستند Google Docs');
  }

  return await res.json();
};

export const getGoogleDoc = async (documentId: string, accessToken: string): Promise<any> => {
  const res = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'فشل في قراءة مستند Google Docs');
  }

  return await res.json();
};

export const listMerchantGoogleDocs = async (accessToken: string): Promise<GoogleDocFile[]> => {
  const query = encodeURIComponent("mimeType = 'application/vnd.google-apps.document' and trashed = false");
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=createdTime desc&pageSize=20&fields=files(id,name,createdTime,webViewLink)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'فشل في جلب مستندات Google Docs من Drive');
  }

  const data = await res.json();
  return (data.files || []).map((f: any) => ({
    id: f.id,
    name: f.name,
    createdTime: f.createdTime,
    webViewLink: f.webViewLink || `https://docs.google.com/document/d/${f.id}/edit`,
  }));
};

export const deleteGoogleDoc = async (fileId: string, accessToken: string): Promise<void> => {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'فشل في حذف المستند من Google Drive');
  }
};

export const exportOrdersReportToGoogleDoc = async ({
  merchantName,
  orders,
  appointmentsCount,
  accessToken,
}: {
  merchantName: string;
  orders: any[];
  appointmentsCount: number;
  accessToken: string;
}): Promise<{ documentId: string; url: string; title: string }> => {
  const dateStr = new Date().toLocaleDateString('ar-SA');
  const title = `تقرير مبيعات وحجوزات 360Resala - ${merchantName} (${new Date().toISOString().split('T')[0]})`;

  // 1. Create Doc
  const doc = await createGoogleDoc(title, accessToken);

  // 2. Build Rich Text content
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');

  let reportContent = `══════════════════════════════════════════════════════════════════════\n`;
  reportContent += `تقرير مبيعات وحجوزات واتساب - منصة 360Resala\n`;
  reportContent += `النشاط التجاري: ${merchantName}\n`;
  reportContent += `تاريخ التصدير: ${dateStr}\n`;
  reportContent += `══════════════════════════════════════════════════════════════════════\n\n`;

  reportContent += `ملخص الأداء والمؤشرات:\n`;
  reportContent += `• إجمالي الإيرادات المؤكدة: ${totalRevenue} ر.س\n`;
  reportContent += `• عدد الطلبات المكتملة والمدفوعة: ${paidOrders.length} طلب\n`;
  reportContent += `• إجمالي مواعيد وحجوزات الخدمات: ${appointmentsCount} موعد\n`;
  reportContent += `• قناة الربط: WhatsApp Meta Cloud API الرسمية\n\n`;

  reportContent += `تفاصيل طلبات العملاء:\n`;
  reportContent += `----------------------------------------------------------------------\n`;

  orders.forEach((ord, index) => {
    reportContent += `${index + 1}. رقم الطلب: ${ord.orderNumber || ord.id}\n`;
    reportContent += `   العميل: ${ord.customerName} (${ord.customerPhone})\n`;
    reportContent += `   المبلغ: ${ord.total} ${ord.currency} | طريقة الدفع: ${ord.paymentMethod || 'مدى / Apple Pay'}\n`;
    reportContent += `   الحالة: ${ord.status === 'confirmed' ? 'مؤكد' : ord.status} | السداد: ${ord.paymentStatus === 'paid' ? 'مدفوع' : 'غير مدفوع'}\n`;
    reportContent += `   العناصر: ${ord.items?.map((i: any) => `${i.item?.name} (x${i.quantity})`).join(', ')}\n\n`;
  });

  reportContent += `══════════════════════════════════════════════════════════════════════\n`;
  reportContent += `تم إصدار هذا التقرير تلقائياً بواسطة منصة 360Resala للتجارة التحادثية والموظف الذكي.\n`;

  // 3. Insert Text
  await insertTextToGoogleDoc(doc.documentId, reportContent, accessToken);

  return {
    documentId: doc.documentId,
    url: doc.webViewLink || `https://docs.google.com/document/d/${doc.documentId}/edit`,
    title,
  };
};

export const exportCatalogToGoogleDoc = async ({
  merchantName,
  catalogItems,
  accessToken,
}: {
  merchantName: string;
  catalogItems: any[];
  accessToken: string;
}): Promise<{ documentId: string; url: string; title: string }> => {
  const dateStr = new Date().toLocaleDateString('ar-SA');
  const title = `كتالوج وقائمة أسعار 360Resala - ${merchantName}`;

  const doc = await createGoogleDoc(title, accessToken);

  let catalogContent = `══════════════════════════════════════════════════════════════════════\n`;
  catalogContent += `كتالوج المنتجات والخدمات الرسمية - ${merchantName}\n`;
  catalogContent += `تاريخ التحديث: ${dateStr}\n`;
  catalogContent += `══════════════════════════════════════════════════════════════════════\n\n`;

  catalogItems.forEach((it, idx) => {
    catalogContent += `${idx + 1}. ${it.name}\n`;
    catalogContent += `   النوع: ${it.type === 'service' ? 'خدمة (حجز موعد)' : 'منتج (توصيل وشحن)'}\n`;
    catalogContent += `   السعر: ${it.price} ${it.currency}\n`;
    catalogContent += `   الوصف: ${it.description || 'لا يوجد وصف'}\n`;
    if (it.coverageAreas) catalogContent += `   مناطق التغطية: ${it.coverageAreas}\n`;
    catalogContent += `\n`;
  });

  await insertTextToGoogleDoc(doc.documentId, catalogContent, accessToken);

  return {
    documentId: doc.documentId,
    url: doc.webViewLink || `https://docs.google.com/document/d/${doc.documentId}/edit`,
    title,
  };
};

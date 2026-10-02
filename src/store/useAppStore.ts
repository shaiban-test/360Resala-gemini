/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  AppView,
  MerchantProfile,
  AIEmployeeConfig,
  CatalogItem,
  ChannelConnection,
  MetaTechProviderConfig,
  OrderBooking,
  CartItem,
  ChatMessage,
  DialectCode,
  PaymentGatewayConfig,
  PaymentInvoice,
  Appointment,
  AbandonedCart,
  BroadcastCampaign,
  WebhookLogEntry,
} from '../types';
import {
  DEFAULT_META_CONFIG,
  DEFAULT_PAYMENT_CONFIG,
  INITIAL_CATALOG_ITEMS,
  INITIAL_APPOINTMENTS,
  INITIAL_ABANDONED_CARTS,
  INITIAL_CAMPAIGNS,
  DIALECTS,
} from '../data/constants';

const STORAGE_KEY = '360resala_app_state_v2';

interface AppState {
  currentView: AppView;
  onboardingStep: number;
  merchant: MerchantProfile;
  aiEmployee: AIEmployeeConfig;
  catalogItems: CatalogItem[];
  channels: ChannelConnection[];
  metaConfig: MetaTechProviderConfig;
  paymentConfig: PaymentGatewayConfig;
  orders: OrderBooking[];
  paymentInvoices: PaymentInvoice[];
  appointments: Appointment[];
  abandonedCarts: AbandonedCart[];
  broadcastCampaigns: BroadcastCampaign[];
  webhookLogs: WebhookLogEntry[];
  activeCheckoutInvoice: PaymentInvoice | null;
  cart: CartItem[];
  chatMessages: ChatMessage[];
  isHumanTakeover: boolean;
  isAdminAuthenticated: boolean;
  adminCredentials: {
    username: string;
    passwordHash: string;
  };
  qrSession: {
    code: string;
    status: 'idle' | 'waiting_scan' | 'scanned' | 'syncing' | 'connected';
    phone?: string;
    expiresIn: number;
  };
}

const defaultInitialState: AppState = {
  currentView:
    typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
      ? 'super_admin'
      : 'landing',
  onboardingStep: 1,
  isAdminAuthenticated: false,
  adminCredentials: {
    username: 'admin',
    passwordHash: 'admin123456',
  },
  merchant: {
    id: 'm_101',
    businessName: '360services',
    ownerName: 'عبد الله',
    email: 'contact@360services.org',
    country: 'السعودية',
    currency: 'SAR',
    timezone: 'Asia/Riyadh (GMT+3)',
    natureOfBusiness: 'both',
    selectedCategories: ['خدمات منزلية', 'صيانة', 'عطور'],
    currentPlanId: 'trial',
    createdAt: new Date().toISOString(),
  },
  aiEmployee: {
    id: 'emp_101',
    merchantId: 'm_101',
    name: 'سارة - مساعدتك الذكية 360Resala',
    avatar: '👩‍💼',
    primaryLanguage: 'ar',
    dialect: 'sa',
    businessDescription:
      'نقدم خدمات تنظيف المنازل، وغسيل السيارات، والاستفسار والحجز الفوري عبر واتساب، بالإضافة إلى منتجات العناية والعطور الخاصة بنا.',
    goals: ['الرد على الأسئلة', 'بيع منتجات', 'حجز مواعيد', 'استقبال طلبات', 'خدمة العملاء'],
    tone: 'friendly',
    welcomeMessage:
      'يا هلا والله! حيّاك الله في 360Resala (360services). آمرني، تبي تستفسر عن باقات النظافة، أو حجز موعد، أو تطلب من منتجاتنا؟ أنا بالخدمة!',
    humanHandoffCondition: 'عند طلب حالة طارئة، أو شكوى، أو الاستفسار عن مشاريع كبرى',
    faqs: [
      {
        question: 'ما هي أوقات العمل لديكم؟',
        answer: 'نعمل من السبت إلى الخميس من الساعة 9:00 صباحاً وحتى 10:00 مساءً.',
      },
      {
        question: 'هل الدفع متاح عبر مدى وأبل باي؟',
        answer:
          'نعم، نوفر الدفع الإلكتروني المباشر الفوري عبر مدى و Apple Pay و Visa، أو نقداً عند استلام الخدمة.',
      },
      {
        question: 'هل تتوفر باقات اشتراك شهرية؟',
        answer:
          'بالتأكيد! نوفر خصومات 20% للاشتراكات الشهرية في تنظيف المنازل وغسيل وتلميع السيارات.',
      },
    ],
  },
  catalogItems: INITIAL_CATALOG_ITEMS,
  channels: [
    {
      type: 'whatsapp_meta',
      title: 'WhatsApp Cloud API (Meta Official)',
      status: 'connected',
      phoneNumber: '+966 50 360 2026',
      wabaId: 'WABA_360_RESALA_LIVE',
      phoneNumberId: 'PN_90182740192',
      businessName: '360Resala Official Store',
      details: 'ربط رسمي موثق عبر Meta Cloud API v24.0 لاستقبال وإرسال الرسائل الحقيقية',
    },
    {
      type: 'whatsapp_qr',
      title: 'WhatsApp QR Code Web Connect',
      status: 'disconnected',
      details: 'ربط مساند سريع عبر مسح الكود من تطبيق واتساب بهاتفك',
    },
    {
      type: 'messenger',
      title: 'Facebook Messenger',
      status: 'disconnected',
      details: 'ربط رسائل صفحة الفيسبوك الخاصة بنشاطك',
    },
    {
      type: 'instagram',
      title: 'Instagram Direct Automation',
      status: 'disconnected',
      details: 'ردود تلقائية ذكية على الرسائل المباشرة في إنستغرام',
    },
  ],
  metaConfig: DEFAULT_META_CONFIG,
  paymentConfig: DEFAULT_PAYMENT_CONFIG,
  orders: [
    {
      id: 'ord_9182',
      orderNumber: '#RESALA-9182',
      type: 'booking',
      customerName: 'فيصل الشمري',
      customerPhone: '+966 50 123 4567',
      items: [
        {
          item: INITIAL_CATALOG_ITEMS[0],
          quantity: 1,
          selectedTimeSlot: 'غداً، 4:00 عصراً',
        },
      ],
      total: 240,
      currency: 'SAR',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'apple_pay',
      bookingDate: '2026-10-04',
      bookingTime: '16:00',
      address: 'الرياض - حي النرجس',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'ord_9183',
      orderNumber: '#RESALA-9183',
      type: 'order',
      customerName: 'سارة الدوسري',
      customerPhone: '+966 55 987 6543',
      items: [
        {
          item: INITIAL_CATALOG_ITEMS[2],
          quantity: 2,
        },
      ],
      total: 580,
      currency: 'SAR',
      status: 'new',
      paymentStatus: 'paid',
      paymentMethod: 'mada',
      address: 'جدة - حي الروضة',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ],
  paymentInvoices: [
    {
      id: 'inv_8491',
      orderId: 'ord_9182',
      amount: 240,
      currency: 'SAR',
      customerName: 'فيصل الشمري',
      customerPhone: '+966 50 123 4567',
      status: 'paid',
      paymentUrl: 'https://360resala-gemini.free-temp.eu.org/pay/inv_8491',
      gateway: 'moyasar',
      paymentMethod: 'apple_pay',
      paidAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'inv_8492',
      orderId: 'ord_9183',
      amount: 580,
      currency: 'SAR',
      customerName: 'سارة الدوسري',
      customerPhone: '+966 55 987 6543',
      status: 'paid',
      paymentUrl: 'https://360resala-gemini.free-temp.eu.org/pay/inv_8492',
      gateway: 'moyasar',
      paymentMethod: 'mada',
      paidAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ],
  appointments: INITIAL_APPOINTMENTS,
  abandonedCarts: INITIAL_ABANDONED_CARTS,
  broadcastCampaigns: INITIAL_CAMPAIGNS,
  webhookLogs: [
    {
      id: 'log_init',
      timestamp: new Date().toLocaleTimeString('ar-SA'),
      direction: 'inbound',
      type: 'status_update',
      content: 'Webhook endpoint verified successfully: /api/webhooks/whatsapp',
      rawPayload: { mode: 'subscribe', status: 'verified', challenge_sent: true },
      status: 'success',
    },
  ],
  activeCheckoutInvoice: null,
  cart: [],
  chatMessages: [
    {
      id: 'msg_welcome',
      role: 'assistant',
      content:
        'يا هلا والله! حيّاك الله في 360Resala 🌿\nآمرني وش في خاطرك اليوم؟ تبي تحجز خدمة تنظيف للمنزل، أو تطلب من العطور الفاخرة، أو تستفسر عن الأسعار والدفع بمدى وأبل باي؟ أنا هنا بالخدمة!',
      timestamp: '10:00 ص',
      suggestedQuickReplies: [
        'أبي أحجز خدمة تنظيف منزلي',
        'وش العروض والخدمات المتوفرة؟',
        'أبي عطر الفخامة الملكي',
        'طرق الدفع المتوفرة؟',
      ],
    },
  ],
  isHumanTakeover: false,
  qrSession: {
    code: 'https://360resala-gemini.free-temp.eu.org/pair/session_71928_sa_whatsapp_token',
    status: 'idle',
    expiresIn: 60,
  },
};

let listeners: Array<() => void> = [];
let memoryState: AppState = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...defaultInitialState, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading stored state', e);
  }
  return defaultInitialState;
})();

function emitChange() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
  } catch (e) {
    console.error('Error persisting state', e);
  }
  for (const listener of listeners) {
    listener();
  }
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(memoryState);

  useEffect(() => {
    const listener = () => setState({ ...memoryState });
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const setView = (view: AppView) => {
    memoryState.currentView = view;
    emitChange();
  };

  const setOnboardingStep = (step: number) => {
    memoryState.onboardingStep = step;
    emitChange();
  };

  const selectPlan = (planId: 'trial' | 'starter' | 'pro' | 'enterprise') => {
    memoryState.merchant.currentPlanId = planId;
    memoryState.currentView = 'onboarding';
    memoryState.onboardingStep = 1;
    emitChange();
  };

  const updateMerchant = (partial: Partial<MerchantProfile>) => {
    memoryState.merchant = { ...memoryState.merchant, ...partial };
    emitChange();
  };

  const updateAIEmployee = (partial: Partial<AIEmployeeConfig>) => {
    memoryState.aiEmployee = { ...memoryState.aiEmployee, ...partial };
    if (partial.dialect) {
      const d = DIALECTS.find((item) => item.code === partial.dialect);
      if (d) {
        memoryState.aiEmployee.welcomeMessage = `${d.sampleGreeting} أنا الموظف الذكي لـ ${memoryState.merchant.businessName}. كيف نقدر نساعدك؟`;
      }
    }
    emitChange();
  };

  const addCatalogItem = (item: Omit<CatalogItem, 'id' | 'merchantId'>) => {
    const newItem: CatalogItem = {
      ...item,
      id: `item_${Date.now()}`,
      merchantId: memoryState.merchant.id,
    };
    memoryState.catalogItems.push(newItem);
    emitChange();
  };

  const updateCatalogItem = (id: string, partial: Partial<CatalogItem>) => {
    memoryState.catalogItems = memoryState.catalogItems.map((it) =>
      it.id === id ? { ...it, ...partial } : it
    );
    emitChange();
  };

  const deleteCatalogItem = (id: string) => {
    memoryState.catalogItems = memoryState.catalogItems.filter((it) => it.id !== id);
    emitChange();
  };

  const updateChannelStatus = (
    type: ChannelConnection['type'],
    status: ChannelConnection['status'],
    phone?: string
  ) => {
    memoryState.channels = memoryState.channels.map((ch) =>
      ch.type === type
        ? {
            ...ch,
            status,
            phoneNumber: phone || ch.phoneNumber,
            connectedAt: status === 'connected' ? new Date().toLocaleDateString('ar-SA') : undefined,
          }
        : ch
    );
    emitChange();
  };

  const updateMetaConfig = (partial: Partial<MetaTechProviderConfig>) => {
    memoryState.metaConfig = { ...memoryState.metaConfig, ...partial };
    emitChange();
  };

  const updatePaymentConfig = (partial: Partial<PaymentGatewayConfig>) => {
    memoryState.paymentConfig = { ...memoryState.paymentConfig, ...partial };
    emitChange();
  };

  // Payment Invoices
  const createPaymentInvoice = (
    orderId: string,
    amount: number,
    customerName: string,
    customerPhone: string,
    gateway: 'moyasar' | 'tap' | 'hyperpay' = memoryState.paymentConfig.activeProvider
  ) => {
    const invId = `inv_${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: PaymentInvoice = {
      id: invId,
      orderId,
      amount,
      currency: memoryState.merchant.currency,
      customerName,
      customerPhone,
      status: 'pending',
      paymentUrl: `https://360resala-gemini.free-temp.eu.org/pay/${invId}`,
      gateway,
      createdAt: new Date().toISOString(),
    };
    memoryState.paymentInvoices.unshift(newInvoice);
    emitChange();
    return newInvoice;
  };

  const payInvoice = (
    invoiceId: string,
    method: 'mada' | 'apple_pay' | 'credit_card' = 'apple_pay'
  ) => {
    const inv = memoryState.paymentInvoices.find((i) => i.id === invoiceId);
    if (inv) {
      inv.status = 'paid';
      inv.paymentMethod = method;
      inv.paidAt = new Date().toISOString();

      // update corresponding order if exists
      const relatedOrder = memoryState.orders.find((o) => o.id === inv.orderId);
      if (relatedOrder) {
        relatedOrder.paymentStatus = 'paid';
        relatedOrder.paymentMethod = method;
        relatedOrder.status = 'confirmed';
      }

      // log webhook event
      addWebhookLog({
        direction: 'inbound',
        type: 'payment_callback',
        senderPhone: inv.customerPhone,
        content: `تم استلام دفعة بنجاح بقيمة ${inv.amount} ${inv.currency} عبر ${method.toUpperCase()}`,
        rawPayload: { invoiceId, amount: inv.amount, status: 'PAID', method },
        status: 'success',
      });

      emitChange();
    }
  };

  const openCheckout = (invoice: PaymentInvoice) => {
    memoryState.activeCheckoutInvoice = invoice;
    memoryState.currentView = 'checkout';
    emitChange();
  };

  // Appointments
  const addAppointment = (
    appData: Omit<Appointment, 'id' | 'createdAt' | 'reminder24hSent' | 'reminder2hSent'>
  ) => {
    const newApp: Appointment = {
      ...appData,
      id: `app_${Date.now()}`,
      reminder24hSent: false,
      reminder2hSent: false,
      createdAt: new Date().toISOString(),
    };
    memoryState.appointments.unshift(newApp);

    // log webhook notification
    addWebhookLog({
      direction: 'outbound',
      type: 'message',
      recipientPhone: newApp.customerPhone,
      content: `إشعار حجز موعد جديد: تم تأكيد موعدك لخدمة ${newApp.serviceName} بتاريخ ${newApp.date} في ${newApp.timeSlot}`,
      rawPayload: { recipient: newApp.customerPhone, appointmentId: newApp.id },
      status: 'success',
    });

    emitChange();
    return newApp;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    memoryState.appointments = memoryState.appointments.map((a) =>
      a.id === id ? { ...a, status } : a
    );
    emitChange();
  };

  // Abandoned Carts
  const triggerCartRecovery = (cartId: string) => {
    const targetCart = memoryState.abandonedCarts.find((c) => c.id === cartId);
    if (targetCart) {
      targetCart.recoveryStatus = 'sent';
      targetCart.lastReminderSentAt = new Date().toISOString();

      // Log outbound WhatsApp recovery message
      addWebhookLog({
        direction: 'outbound',
        type: 'message',
        recipientPhone: targetCart.customerPhone,
        content: `رسالة استرجاع سلة متروكة لـ ${targetCart.customerName}: مرحباً بك! لاحظنا أنك تركت مشترياتك في السلة، يسعدنا تقديم كود خصم 10% [${targetCart.couponCode || 'RESALA10'}] لإتمام طلبك الآن!`,
        rawPayload: { recipient: targetCart.customerPhone, cartId, action: 'abandoned_cart_recovery' },
        status: 'success',
      });

      emitChange();
    }
  };

  // Broadcast Campaigns
  const createBroadcastCampaign = (
    camp: Omit<BroadcastCampaign, 'id' | 'createdAt' | 'sentCount' | 'deliveredCount' | 'readCount' | 'status'>
  ) => {
    const newCamp: BroadcastCampaign = {
      ...camp,
      id: `camp_${Date.now()}`,
      status: 'draft',
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      createdAt: new Date().toISOString(),
    };
    memoryState.broadcastCampaigns.unshift(newCamp);
    emitChange();
    return newCamp;
  };

  const sendBroadcastCampaign = (campaignId: string) => {
    const camp = memoryState.broadcastCampaigns.find((c) => c.id === campaignId);
    if (camp) {
      camp.status = 'sending';
      emitChange();

      setTimeout(() => {
        camp.status = 'completed';
        camp.sentCount = camp.totalRecipients;
        camp.deliveredCount = Math.floor(camp.totalRecipients * 0.98);
        camp.readCount = Math.floor(camp.totalRecipients * 0.85);

        addWebhookLog({
          direction: 'outbound',
          type: 'message',
          content: `اكتمل إرسال حملة البرودكاست "${camp.title}" إلى ${camp.totalRecipients} عميل عبر Meta Cloud API`,
          rawPayload: { campaignId, recipients: camp.totalRecipients, status: 'DELIVERED' },
          status: 'success',
        });

        emitChange();
      }, 1500);
    }
  };

  // Webhook Logs
  const addWebhookLog = (entry: Omit<WebhookLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: WebhookLogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('ar-SA'),
    };
    memoryState.webhookLogs.unshift(newEntry);
    if (memoryState.webhookLogs.length > 50) {
      memoryState.webhookLogs.pop();
    }
    emitChange();
  };

  const simulateInboundWebhook = async (phone: string, text: string) => {
    // 1. Log inbound message
    addWebhookLog({
      direction: 'inbound',
      type: 'message',
      senderPhone: phone,
      content: text,
      rawPayload: {
        object: 'whatsapp_business_account',
        entry: [
          {
            changes: [
              {
                value: {
                  messaging_product: 'whatsapp',
                  messages: [{ from: phone, text: { body: text }, type: 'text' }],
                },
              },
            ],
          },
        ],
      },
      status: 'simulated',
    });

    // 2. Query Chat API for AI response
    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          dialect: memoryState.aiEmployee.dialect,
          businessName: memoryState.merchant.businessName,
          businessDescription: memoryState.aiEmployee.businessDescription,
          catalogItems: memoryState.catalogItems,
          goals: memoryState.aiEmployee.goals,
        }),
      });
      const data = await response.json();
      const reply = data.reply || 'يا هلا والله! أبشر، تم استلام رسالتك عبر 360Resala.';

      // 3. Log outbound reply from bot
      setTimeout(() => {
        addWebhookLog({
          direction: 'outbound',
          type: 'message',
          recipientPhone: phone,
          content: reply,
          rawPayload: {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: phone,
            type: 'text',
            text: { body: reply },
          },
          status: 'success',
        });
      }, 500);

      return reply;
    } catch (e) {
      console.error('Error simulating webhook reply', e);
      return 'يا هلا والله! تم استقبال رسالتك.';
    }
  };

  const startQrSession = () => {
    memoryState.qrSession = {
      code: `https://360resala-gemini.free-temp.eu.org/pair/qr_${Date.now()}_auth_token`,
      status: 'waiting_scan',
      expiresIn: 60,
    };
    emitChange();
  };

  const simulateQrScan = (customPhone = '+966 54 819 2039') => {
    memoryState.qrSession.status = 'scanned';
    emitChange();

    setTimeout(() => {
      memoryState.qrSession.status = 'syncing';
      emitChange();

      setTimeout(() => {
        memoryState.qrSession.status = 'connected';
        memoryState.qrSession.phone = customPhone;
        updateChannelStatus('whatsapp_qr', 'connected', customPhone);
        emitChange();
      }, 1500);
    }, 1200);
  };

  const simulateMetaEmbeddedConnect = (
    phone = '+966 50 360 2026',
    waba = 'WABA_360_RESALA_LIVE'
  ) => {
    memoryState.channels = memoryState.channels.map((ch) =>
      ch.type === 'whatsapp_meta'
        ? {
            ...ch,
            status: 'connected',
            phoneNumber: phone,
            wabaId: waba,
            businessName: memoryState.merchant.businessName,
            connectedAt: new Date().toLocaleDateString('ar-SA'),
          }
        : ch
    );
    emitChange();
  };

  const disconnectChannel = (type: ChannelConnection['type']) => {
    updateChannelStatus(type, 'disconnected');
    if (type === 'whatsapp_qr') {
      memoryState.qrSession.status = 'idle';
      memoryState.qrSession.phone = undefined;
    }
    emitChange();
  };

  const addToCart = (item: CatalogItem, timeSlot?: string) => {
    const existing = memoryState.cart.find((c) => c.item.id === item.id);
    if (existing) {
      existing.quantity += 1;
      if (timeSlot) existing.selectedTimeSlot = timeSlot;
    } else {
      memoryState.cart.push({ item, quantity: 1, selectedTimeSlot: timeSlot });
    }
    emitChange();
  };

  const removeFromCart = (itemId: string) => {
    memoryState.cart = memoryState.cart.filter((c) => c.item.id !== itemId);
    emitChange();
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    const existing = memoryState.cart.find((c) => c.item.id === itemId);
    if (existing) {
      existing.quantity += delta;
      if (existing.quantity <= 0) {
        memoryState.cart = memoryState.cart.filter((c) => c.item.id !== itemId);
      }
    }
    emitChange();
  };

  const clearCart = () => {
    memoryState.cart = [];
    emitChange();
  };

  const createOrder = (
    customerName: string,
    customerPhone: string,
    address?: string,
    paymentMethod: 'mada' | 'apple_pay' | 'credit_card' | 'cod' = 'apple_pay'
  ) => {
    if (memoryState.cart.length === 0) return null;
    const isBooking = memoryState.cart.some((c) => c.item.type === 'service');
    const total = memoryState.cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

    const newOrder: OrderBooking = {
      id: `ord_${Date.now()}`,
      orderNumber: `#RESALA-${Math.floor(1000 + Math.random() * 9000)}`,
      type: isBooking ? 'booking' : 'order',
      customerName: customerName || 'عميل واتساب',
      customerPhone: customerPhone || '+966 50 000 0000',
      items: [...memoryState.cart],
      total,
      currency: memoryState.merchant.currency,
      status: 'confirmed',
      paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
      paymentMethod,
      address: address || 'الرياض - تسليم مباشر',
      createdAt: new Date().toISOString(),
    };

    memoryState.orders.unshift(newOrder);

    // If service booking, automatically register appointment
    const serviceItem = memoryState.cart.find((c) => c.item.type === 'service');
    if (serviceItem) {
      addAppointment({
        serviceId: serviceItem.item.id,
        serviceName: serviceItem.item.name,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        timeSlot: serviceItem.selectedTimeSlot || '04:00 م',
        status: 'confirmed',
        notes: newOrder.address,
      });
    }

    // Create payment invoice if electronic payment
    if (paymentMethod !== 'cod') {
      createPaymentInvoice(newOrder.id, newOrder.total, newOrder.customerName, newOrder.customerPhone);
    }

    memoryState.cart = [];
    emitChange();
    return newOrder;
  };

  const addChatMessage = (msg: ChatMessage) => {
    memoryState.chatMessages.push(msg);
    emitChange();
  };

  const toggleHumanTakeover = () => {
    memoryState.isHumanTakeover = !memoryState.isHumanTakeover;
    emitChange();
  };

  const loginAdmin = (user: string, pass: string): boolean => {
    if (
      user.trim() === memoryState.adminCredentials.username &&
      pass === memoryState.adminCredentials.passwordHash
    ) {
      memoryState.isAdminAuthenticated = true;
      memoryState.currentView = 'super_admin';
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/admin');
      }
      emitChange();
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    memoryState.isAdminAuthenticated = false;
    memoryState.currentView = 'landing';
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
    }
    emitChange();
  };

  const updateAdminCredentials = (newUsername: string, newPassword: string) => {
    memoryState.adminCredentials = {
      username: newUsername,
      passwordHash: newPassword,
    };
    emitChange();
  };

  const pushToGitHub = async (
    token: string,
    repoUrl = 'https://github.com/shaiban-test/360Resala-gemini.git'
  ) => {
    const response = await fetch('/api/github/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, repoUrl }),
    });
    return await response.json();
  };

  const resetStore = () => {
    memoryState = { ...defaultInitialState };
    emitChange();
  };

  return {
    state,
    setView,
    setOnboardingStep,
    selectPlan,
    updateMerchant,
    updateAIEmployee,
    addCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
    updateChannelStatus,
    updateMetaConfig,
    updatePaymentConfig,
    createPaymentInvoice,
    payInvoice,
    openCheckout,
    addAppointment,
    updateAppointmentStatus,
    triggerCartRecovery,
    createBroadcastCampaign,
    sendBroadcastCampaign,
    addWebhookLog,
    simulateInboundWebhook,
    startQrSession,
    simulateQrScan,
    simulateMetaEmbeddedConnect,
    disconnectChannel,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder,
    addChatMessage,
    toggleHumanTakeover,
    loginAdmin,
    logoutAdmin,
    updateAdminCredentials,
    pushToGitHub,
    resetStore,
  };
}

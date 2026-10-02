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
} from '../types';
import {
  DEFAULT_META_CONFIG,
  INITIAL_CATALOG_ITEMS,
  SUBSCRIPTION_PLANS,
  DIALECTS,
} from '../data/constants';

const STORAGE_KEY = 'chatandcart_app_state_v1';

interface AppState {
  currentView: AppView;
  onboardingStep: number;
  merchant: MerchantProfile;
  aiEmployee: AIEmployeeConfig;
  catalogItems: CatalogItem[];
  channels: ChannelConnection[];
  metaConfig: MetaTechProviderConfig;
  orders: OrderBooking[];
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
  currentView: typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') ? 'super_admin' : 'landing',
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
    email: 'abdullah@360services.sa',
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
    name: 'سارة - مساعدتك الذكية',
    avatar: '👩‍💼',
    primaryLanguage: 'ar',
    dialect: 'sa',
    businessDescription: 'نقدم خدمات تنظيف المنازل، وغسيل السيارات، والاستفسار والحجز الفوري عبر واتساب، بالإضافة إلى منتجات العناية والعطور الخاصة بنا.',
    goals: ['الرد على الأسئلة', 'بيع منتجات', 'حجز مواعيد', 'استقبال طلبات', 'خدمة العملاء'],
    tone: 'friendly',
    welcomeMessage: 'يا هلا والله! حيّاك الله في 360services. آمرني، تبي تستفسر عن باقات النظافة، أو حجز موعد، أو تطلب من منتجاتنا؟ أنا بالخدمة!',
    humanHandoffCondition: 'عند طلب حالة طارئة، أو شكوى، أو الاستفسار عن مشاريع كبرى',
    faqs: [
      { question: 'ما هي أوقات العمل لديكم؟', answer: 'نعمل من السبت إلى الخميس من الساعة 9:00 صباحاً وحتى 10:00 مساءً.' },
      { question: 'هل الدفع متاح عند الاستلام؟', answer: 'نعم، نوفر الدفع عند تقديم الخدمة، أو الدفع الإلكتروني المباشر عبر مدى وأبل باي.' },
      { question: 'هل تتوفر باقات اشتراك شهرية؟', answer: 'بالتأكيد! نوفر خصومات 20% للاشتراكات الشهرية في تنظيف المنازل وغسيل السيارات.' },
    ],
  },
  catalogItems: INITIAL_CATALOG_ITEMS,
  channels: [
    {
      type: 'whatsapp_meta',
      title: 'WhatsApp Business API',
      status: 'disconnected',
      details: 'ربط رسمي موثق عبر Meta Cloud API لبرنامج موفري الخدمات (Tech Provider)',
    },
    {
      type: 'whatsapp_qr',
      title: 'WhatsApp QR Code Connect',
      status: 'disconnected',
      details: 'ربط سريع عبر مسح الكود من تطبيق واتساب على هاتفك مباشرة',
    },
    {
      type: 'messenger',
      title: 'Facebook Messenger',
      status: 'disconnected',
      details: 'ربط رسائل صفحة الفيسبوك الخاصة بنشاطك',
    },
    {
      type: 'instagram',
      title: 'Instagram Direct',
      status: 'disconnected',
      details: 'ردود تلقائية ذكية على الرسائل المباشرة في إنستغرام',
    },
  ],
  metaConfig: DEFAULT_META_CONFIG,
  orders: [
    {
      id: 'ord_9182',
      orderNumber: '#CC-9182',
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
      bookingDate: '2026-10-04',
      bookingTime: '16:00',
      address: 'الرياض - حي النرجس',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'ord_9183',
      orderNumber: '#CC-9183',
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
      address: 'جدة - حي الروضة',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ],
  cart: [],
  chatMessages: [
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: 'يا هلا والله! حيّاك الله في 360services 🌿\nآمرني وش في خاطرك اليوم؟ تبي تحجز خدمة تنظيف للمنزل، أو تطلب من العطور الفاخرة؟ أنا هنا بالخدمة!',
      timestamp: '10:00 ص',
      suggestedQuickReplies: ['أبي أحجز خدمة تنظيف', 'وش العروض والخدمات المتوفرة؟', 'أبي عطر رجالي فخم'],
    },
  ],
  isHumanTakeover: false,
  qrSession: {
    code: 'https://chatandcart.com/pair/session_71928_sa_whatsapp_token',
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
    // update initial chat greeting if dialect changes
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

  const updateChannelStatus = (type: ChannelConnection['type'], status: ChannelConnection['status'], phone?: string) => {
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

  const startQrSession = () => {
    memoryState.qrSession = {
      code: `https://chatandcart.com/pair/qr_${Date.now()}_auth_token`,
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

  const simulateMetaEmbeddedConnect = (phone = '+966 50 000 8899', waba = 'WABA_8291029381') => {
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

  const createOrder = (customerName: string, customerPhone: string, address?: string) => {
    if (memoryState.cart.length === 0) return null;
    const isBooking = memoryState.cart.some((c) => c.item.type === 'service');
    const total = memoryState.cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

    const newOrder: OrderBooking = {
      id: `ord_${Date.now()}`,
      orderNumber: `#CC-${Math.floor(1000 + Math.random() * 9000)}`,
      type: isBooking ? 'booking' : 'order',
      customerName: customerName || 'عميل واتساب',
      customerPhone: customerPhone || '+966 50 000 0000',
      items: [...memoryState.cart],
      total,
      currency: memoryState.merchant.currency,
      status: 'confirmed',
      paymentStatus: 'paid',
      address: address || 'الرياض - تسليم مباشر',
      createdAt: new Date().toISOString(),
    };

    memoryState.orders.unshift(newOrder);
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
    repoUrl = 'https://github.com/shaiban-test/Chatapp.git'
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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NatureOfBusiness = 'products' | 'services' | 'both';

export type PricingType = 'fixed' | 'starts_from' | 'on_demand';

export type ServicePlace = 'branch' | 'customer_location' | 'online';

export type DialectCode =
  | 'sa' // السعودية 🇸🇦
  | 'ae' // الإمارات 🇦🇪
  | 'kw' // الكويت 🇰🇼
  | 'qa' // قطر 🇶🇦
  | 'jo' // الأردن 🇯🇴
  | 'ps' // فلسطين 🇵🇸
  | 'lb' // لبنان 🇱🇧
  | 'sy' // سوريا 🇸🇾
  | 'eg' // مصر 🇪🇬
  | 'ma' // المغرب 🇲🇦
  | 'msa' // الفصحى 🇸🇦
  | 'en'; // الإنجليزي 🇺🇸

export interface DialectInfo {
  code: DialectCode;
  country: string;
  flag: string;
  label: string;
  sampleGreeting: string;
}

export interface SubscriptionPlan {
  id: 'trial' | 'starter' | 'pro' | 'enterprise';
  name: string;
  nameAr: string;
  priceMonthly: number;
  currency: string;
  descriptionAr: string;
  badge?: string;
  features: string[];
  maxConversations: number;
  maxProducts: number;
  allowMetaEmbeddedSignup: boolean;
  allowQrCode: boolean;
  allowCustomDialects: boolean;
  humanTakeover: boolean;
}

export interface MerchantProfile {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  country: string;
  currency: string;
  timezone: string;
  natureOfBusiness: NatureOfBusiness;
  selectedCategories: string[];
  currentPlanId: 'trial' | 'starter' | 'pro' | 'enterprise';
  createdAt: string;
}

export interface AIEmployeeConfig {
  id: string;
  merchantId: string;
  name: string;
  avatar: string;
  primaryLanguage: 'ar' | 'en';
  dialect: DialectCode;
  businessDescription: string;
  goals: string[]; // ['الرد على الأسئلة', 'بيع منتجات', 'استقبال طلبات', 'حجز مواعيد', 'جمع عملاء محتملين', 'خدمة العملاء', 'التحويل للموظف']
  tone: 'friendly' | 'professional' | 'sales_driven';
  welcomeMessage: string;
  humanHandoffCondition: string;
  faqs: { question: string; answer: string }[];
}

export interface CatalogItem {
  id: string;
  merchantId: string;
  name: string;
  type: 'product' | 'service';
  pricingType: PricingType;
  price: number;
  currency: string;
  deliveryPlace?: ServicePlace;
  requiresBooking?: boolean;
  coverageAreas?: string;
  workingHours?: string;
  description: string;
  executionDeadline?: string;
  cancellationPolicy?: string;
  humanHandoffRule?: string;
  requiredCustomerFields?: string[];
  image?: string;
  inStock: boolean;
}

export type ChannelType = 'whatsapp_meta' | 'whatsapp_qr' | 'messenger' | 'instagram';

export interface ChannelConnection {
  type: ChannelType;
  title: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  phoneNumber?: string;
  wabaId?: string;
  businessName?: string;
  connectedAt?: string;
  qrCodeData?: string;
  details?: string;
}

export interface MetaTechProviderConfig {
  appId: string;
  appSecret: string;
  embeddedSignupConfigId: string;
  systemUserToken: string;
  webhookCallbackUrl: string;
  webhookVerifyToken: string;
  isVerifiedTechProvider: boolean;
  businessManagerId: string;
  partnerName: string;
  status: 'connected' | 'pending_verification' | 'needs_setup';
}

export interface CartItem {
  item: CatalogItem;
  quantity: number;
  selectedTimeSlot?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  cards?: {
    type: 'product' | 'service' | 'cart_summary' | 'booking_confirm' | 'payment_link';
    data: any;
  }[];
  suggestedQuickReplies?: string[];
}

export interface OrderBooking {
  id: string;
  orderNumber: string;
  type: 'order' | 'booking';
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  currency: string;
  status: 'new' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'cod';
  bookingDate?: string;
  bookingTime?: string;
  address?: string;
  createdAt: string;
}

export type AppView =
  | 'landing'
  | 'onboarding'
  | 'merchant_dashboard'
  | 'super_admin'
  | 'storefront_chat'
  | 'plans';

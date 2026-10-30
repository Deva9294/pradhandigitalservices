import axios from "axios";
import { API_URL } from "@/lib/utils";

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("pds-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      const path = window.location.pathname;
      if (path.startsWith("/dashboard") || path.startsWith("/admin") || path.startsWith("/agent")) {
        localStorage.removeItem("pds-token");
        localStorage.removeItem("pds-user");
        window.dispatchEvent(new Event("pds:unauthorized"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authApi = {
  sendOtp: (phone: string) => api.post("/auth/send-otp", { phone }),
  verifyOtp: (phone: string, otp: string, name?: string) =>
    api.post("/auth/verify-otp", { phone, otp, name }),
  getProfile: () => api.get("/auth/me"),
};

export const paymentApi = {
  createOrder: (amount: number, purpose: string, metadata?: Record<string, string>) =>
    api.post("/payments/create-order", { amount, purpose, metadata }),
  verifyPayment: (data: Record<string, string>) => api.post("/payments/verify", data),
};

export const formsApi = {
  getAll: () => api.get("/forms"),
  purchase: (formId: string) => api.post(`/forms/${formId}/purchase`),
  getDownloadLink: (purchaseId: string) => api.get(`/forms/download/${purchaseId}`),
  getHistory: () => api.get("/forms/history"),
};

export const walletApi = {
  getBalance: () => api.get("/wallet/balance"),
  addMoney: (amount: number) => api.post("/wallet/add", { amount }),
  getTransactions: () => api.get("/wallet/transactions"),
};

export const vacancyApi = {
  getAll: (params?: Record<string, string | number | boolean>) => api.get("/vacancies", { params }),
  getById: (id: string) => api.get(`/vacancies/${id}`),
  getBySlug: (slug: string) => api.get(`/vacancies/${slug}`),
  getSummaryCounts: () => api.get("/vacancies/summary/counts"),
  applyAssistance: (vacancyId: string, payload: Record<string, any>) =>
    api.post(`/vacancies/${vacancyId}/apply-assistance`, payload),
  manualSync: () => api.post("/vacancies/sync/manual"),
  sync: () => api.get("/vacancies/sync"),
};

export const adminApi = {
  getDashboard: () => api.get("/admin/dashboard"),
  getUsers: () => api.get("/admin/users"),
  getOrders: () => api.get("/admin/orders"),
  getPayments: () => api.get("/admin/payments"),
};

export const contactApi = {
  submit: (payload: {
    name: string;
    email: string;
    phone: string;
    subject?: string;
    message: string;
    source?: string;
  }) => api.post("/contact", payload),
};

export const rechargeApi = {
  mobile: (payload: { phoneNumber: string; provider: string; amount: number; plan?: string }) =>
    api.post("/recharge/mobile", payload),
  dth: (payload: { customerId: string; provider: string; amount: number }) =>
    api.post("/recharge/dth", payload),
  bill: (payload: { service: string; accountNumber: string; amount: number; billerId?: string }) =>
    api.post("/recharge/bill", payload),
  plans: (provider: string) =>
    api.get("/recharge/plans", { params: { provider } }),
};

export const applicationApi = {
  mine: () => api.get("/applications/my"),
  workQueue: () => api.get("/applications/work-queue"),
  updateStatus: (id: string, status: string, remarks?: string) =>
    api.patch(`/applications/${id}/status`, { status, remarks }),
  track: (applicationId: string, phone: string) =>
    api.get(`/applications/track/${encodeURIComponent(applicationId)}`, { params: { phone } }),
};

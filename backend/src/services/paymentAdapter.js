import crypto from 'crypto';
import Razorpay from 'razorpay';
import { AppError } from '../utils/AppError.js';

class PaymentAdapter {
  constructor(gateway) {
    this.gateway = gateway;
  }

  async createOrder(orderData) {
    throw new Error('createOrder must be implemented');
  }

  async verifyPayment(paymentData) {
    throw new Error('verifyPayment must be implemented');
  }

  async processRefund(paymentId, refundAmount, reason) {
    throw new Error('processRefund must be implemented');
  }

  async getOrderStatus(orderId) {
    throw new Error('getOrderStatus must be implemented');
  }
}

class RazorpayAdapter extends PaymentAdapter {
  constructor() {
    super('razorpay');
    this.isConfigured = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
    if (this.isConfigured) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
    } else {
      console.warn('[PDS Razorpay] Credentials are missing. Razorpay checkout is disabled until keys are configured.');
    }
  }

  async createOrder(orderData) {
    try {
      if (this.isConfigured && this.razorpay) {
        const options = {
          amount: Math.round(orderData.amount * 100), // Razorpay expects amount in paise
          currency: orderData.currency || 'INR',
          receipt: orderData.receipt,
          notes: orderData.notes || {}
        };

        const order = await this.razorpay.orders.create(options);
        return {
          success: true,
          orderId: order.id,
          amount: order.amount / 100,
          currency: order.currency
        };
      }

      throw new AppError('Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the backend environment.', 503);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Razorpay order creation error:', error);
      throw new AppError('Failed to create payment order', 500);
    }
  }

  async verifyPayment(paymentData) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

      if (!this.isConfigured || !this.razorpay) {
        throw new AppError('Razorpay is not configured.', 503);
      }

      const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = shasum.digest('hex');

      const expected = Buffer.from(digest, 'hex');
      const received = /^[a-f0-9]{64}$/i.test(razorpay_signature || '') ? Buffer.from(razorpay_signature, 'hex') : Buffer.alloc(0);
      if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
        throw new AppError('Invalid payment signature', 400);
      }

      // Verify with Razorpay API
      const payment = await this.razorpay.payments.fetch(razorpay_payment_id);
      
      return {
        success: payment.status === 'captured',
        paymentId: payment.id,
        orderId: payment.order_id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        method: payment.method
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Razorpay verification error:', error);
      throw new AppError('Payment verification failed', 400);
    }
  }

  async processRefund(paymentId, refundAmount, reason) {
    try {
      if (!this.isConfigured || !this.razorpay) {
        throw new AppError('Razorpay is not configured. No refund was attempted.', 503);
      }
      if (!paymentId || !Number.isFinite(Number(refundAmount)) || Number(refundAmount) <= 0) {
        throw new AppError('A valid Razorpay payment reference and refund amount are required.', 400);
      }
      const refund = await this.razorpay.payments.refund(paymentId, {
        amount: Math.round(refundAmount * 100),
        notes: { reason: String(reason || '').slice(0, 500) }
      });

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      };
    } catch (error) {
      console.error('Razorpay refund error:', error);
      throw new AppError('Refund failed', 500);
    }
  }

  async getOrderStatus(orderId) {
    try {
      const order = await this.razorpay.orders.fetch(orderId);
      return {
        success: true,
        status: order.status,
        amount: order.amount / 100,
        attempts: order.attempts
      };
    } catch (error) {
      console.error('Razorpay order status error:', error);
      throw new AppError('Failed to fetch order status', 500);
    }
  }
}

class BBPSAdapter extends PaymentAdapter {
  constructor() {
    super('bbps');
  }

  async createOrder() {
    throw new AppError('BBPS provider integration is not configured. No bill payment order was created.', 503);
  }

  async verifyPayment() {
    throw new AppError('BBPS provider integration is not configured. No bill payment can be verified.', 503);
  }

  async processRefund() {
    throw new AppError('BBPS provider integration is not configured. No bill refund was attempted.', 503);
  }

  async getOrderStatus() {
    throw new AppError('BBPS provider integration is not configured. Bill status is unavailable.', 503);
  }
}

class ManualPaymentAdapter extends PaymentAdapter {
  constructor() {
    super('manual');
  }

  async createOrder() {
    throw new AppError('Manual UPI payments must use the verified UPI QR flow. No gateway order was created.', 503);
  }

  async verifyPayment() {
    throw new AppError('Manual UPI payments can only be completed after an administrator verifies actual bank credit.', 503);
  }

  async processRefund() {
    throw new AppError('Manual UPI refunds must be completed through the bank and reconciled manually. No automatic refund was attempted.', 503);
  }

  async getOrderStatus(orderId) {
    return {
      success: true,
      status: 'pending',
      amount: 0
    };
  }
}

// Payment Adapter Factory
class PaymentAdapterFactory {
  static getAdapter(gateway) {
    switch (gateway) {
      case 'razorpay':
        return new RazorpayAdapter();
      case 'bbps':
        return new BBPSAdapter();
      case 'manual':
        return new ManualPaymentAdapter();
      default:
        throw new AppError(`Unsupported payment gateway: ${gateway}`, 400);
    }
  }
}

export default PaymentAdapterFactory;
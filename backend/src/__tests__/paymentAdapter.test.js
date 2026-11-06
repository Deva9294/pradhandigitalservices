import test from 'node:test';
import assert from 'node:assert/strict';
import PaymentAdapterFactory from '../services/paymentAdapter.js';

test('BBPS adapter fails closed instead of returning mock success', async () => {
  const adapter = PaymentAdapterFactory.getAdapter('bbps');
  await assert.rejects(() => adapter.createOrder({ amount: 100 }), /BBPS provider integration is not configured/);
  await assert.rejects(() => adapter.verifyPayment({ transactionId: 'fake' }), /BBPS provider integration is not configured/);
  await assert.rejects(() => adapter.processRefund('fake', 100), /BBPS provider integration is not configured/);
});

test('manual UPI adapter cannot create or verify gateway orders', async () => {
  const adapter = PaymentAdapterFactory.getAdapter('manual');
  await assert.rejects(() => adapter.createOrder({ amount: 100 }), /verified UPI QR flow/);
  await assert.rejects(() => adapter.verifyPayment({ paymentId: 'fake' }), /actual bank credit/);
  await assert.rejects(() => adapter.processRefund('fake', 100), /refunded through the bank/);
});

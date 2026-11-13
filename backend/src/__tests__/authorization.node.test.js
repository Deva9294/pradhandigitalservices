import test from 'node:test';
import assert from 'node:assert/strict';
import { authorize } from '../middleware/auth.js';

function runAuthorization(role) {
  const req = role ? { user: { role } } : { user: null };
  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
  let nextCalled = false;
  authorize('admin', 'superadmin')(req, res, () => { nextCalled = true; });
  return { res, nextCalled };
}

test('admin and superadmin can access privileged routes', () => {
  for (const role of ['admin', 'superadmin']) {
    const result = runAuthorization(role);
    assert.equal(result.nextCalled, true, role);
    assert.equal(result.res.statusCode, 200, role);
  }
});

test('customer, agent, staff and anonymous users are denied privileged routes', () => {
  for (const role of ['customer', 'agent', 'staff', null]) {
    const result = runAuthorization(role);
    assert.equal(result.nextCalled, false, String(role));
    assert.equal(result.res.statusCode, 403, String(role));
    assert.equal(result.res.body?.success, false, String(role));
  }
});

import { assertTrackingPhone } from '../controllers/applicationController.js';

test('public application tracking requires the registered mobile number', () => {
  assert.equal(assertTrackingPhone('9876543210', '9876543210'), true);
  assert.equal(assertTrackingPhone('+91 98765 43210', '9876543210'), true);
  assert.throws(() => assertTrackingPhone('', '9876543210'), (error) => error.statusCode === 400);
  assert.throws(() => assertTrackingPhone('12345', '9876543210'), (error) => error.statusCode === 400);
  assert.throws(() => assertTrackingPhone('9876543211', '9876543210'), (error) => error.statusCode === 403);
  assert.throws(() => assertTrackingPhone('9876543210', ''), (error) => error.statusCode === 403);
});

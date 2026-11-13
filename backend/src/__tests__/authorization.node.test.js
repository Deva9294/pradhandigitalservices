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

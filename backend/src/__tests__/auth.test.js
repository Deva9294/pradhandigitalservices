import test from 'node:test';
import assert from 'node:assert/strict';
import { authorize } from '../middleware/auth.js';
import { preventNoSQLInjection } from '../middleware/security.js';

function responseRecorder() {
  return {
    statusCode: 200,
    payload: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; }
  };
}

test('authorize permits an allowed administrator role', () => {
  const req = { user: { role: 'admin' } };
  const res = responseRecorder();
  let called = false;
  authorize('admin', 'superadmin')(req, res, () => { called = true; });
  assert.equal(called, true);
  assert.equal(res.statusCode, 200);
});

test('authorize rejects customers from administrator routes', () => {
  const req = { user: { role: 'customer' } };
  const res = responseRecorder();
  let called = false;
  authorize('admin', 'superadmin')(req, res, () => { called = true; });
  assert.equal(called, false);
  assert.equal(res.statusCode, 403);
  assert.equal(res.payload.success, false);
});

test('NoSQL guard accepts ordinary nested customer data', () => {
  const req = { body: { applicant: { name: 'Ravi', address: 'Rehti' } }, query: {}, params: {} };
  const res = responseRecorder();
  let called = false;
  preventNoSQLInjection(req, res, () => { called = true; });
  assert.equal(called, true);
});

test('NoSQL guard rejects Mongo operator keys in nested input', () => {
  const req = { body: { filter: { '$gt': '' } }, query: {}, params: {} };
  const res = responseRecorder();
  let called = false;
  preventNoSQLInjection(req, res, () => { called = true; });
  assert.equal(called, false);
  assert.equal(res.statusCode, 400);
});

test('NoSQL guard rejects dotted keys in query parameters', () => {
  const req = { body: {}, query: { 'profile.role': 'admin' }, params: {} };
  const res = responseRecorder();
  let called = false;
  preventNoSQLInjection(req, res, () => { called = true; });
  assert.equal(called, false);
  assert.equal(res.statusCode, 400);
});

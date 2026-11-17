import test from 'node:test';
import assert from 'node:assert/strict';
import { preventNoSQLInjection } from '../middleware/security.js';

function inspectRequest(body = {}, query = {}, params = {}) {
  const req = { body, query, params };
  const res = {
    statusCode: 200,
    payload: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; }
  };
  let nextCalled = false;
  preventNoSQLInjection(req, res, () => { nextCalled = true; });
  return { res, nextCalled };
}

test('rejects nested MongoDB operator keys in parsed request bodies', () => {
  const result = inspectRequest({ profile: { '$where': 'return true' } });
  assert.equal(result.res.statusCode, 400);
  assert.equal(result.nextCalled, false);
});

test('rejects dotted keys and prototype-pollution keys', () => {
  assert.equal(inspectRequest({ 'profile.role': 'admin' }).res.statusCode, 400);
  assert.equal(inspectRequest(JSON.parse('{"__proto__":{"polluted":true}}')).res.statusCode, 400);
  assert.equal(inspectRequest({ constructor: { prototype: { polluted: true } } }).res.statusCode, 400);
});

test('allows ordinary nested application data', () => {
  const result = inspectRequest({ name: 'Citizen', address: { city: 'Rehti' } });
  assert.equal(result.res.statusCode, 200);
  assert.equal(result.nextCalled, true);
});

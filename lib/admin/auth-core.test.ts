import { describe, it, expect, afterEach } from 'vitest';
import { authToken, credentialsValid, cookieValid } from './auth-core';

const ORIGINAL_USER = process.env.EFESOP_ADMIN_USER;
const ORIGINAL_PASS = process.env.EFESOP_ADMIN_PASSWORD;

afterEach(() => {
  if (ORIGINAL_USER === undefined) delete process.env.EFESOP_ADMIN_USER;
  else process.env.EFESOP_ADMIN_USER = ORIGINAL_USER;
  if (ORIGINAL_PASS === undefined) delete process.env.EFESOP_ADMIN_PASSWORD;
  else process.env.EFESOP_ADMIN_PASSWORD = ORIGINAL_PASS;
});

describe('credentialsValid', () => {
  it('rejects an empty password', () => {
    process.env.EFESOP_ADMIN_USER = 'george';
    process.env.EFESOP_ADMIN_PASSWORD = 'correct-horse';
    expect(credentialsValid('george', '')).toBe(false);
  });

  it('rejects a wrong password', () => {
    process.env.EFESOP_ADMIN_USER = 'george';
    process.env.EFESOP_ADMIN_PASSWORD = 'correct-horse';
    expect(credentialsValid('george', 'battery-staple')).toBe(false);
  });

  it('rejects a wrong username', () => {
    process.env.EFESOP_ADMIN_USER = 'george';
    process.env.EFESOP_ADMIN_PASSWORD = 'correct-horse';
    expect(credentialsValid('mallory', 'correct-horse')).toBe(false);
  });

  it('accepts the correct username + password', () => {
    process.env.EFESOP_ADMIN_USER = 'george';
    process.env.EFESOP_ADMIN_PASSWORD = 'correct-horse';
    expect(credentialsValid('george', 'correct-horse')).toBe(true);
  });

  it('defaults the username to "george" when EFESOP_ADMIN_USER is unset', () => {
    delete process.env.EFESOP_ADMIN_USER;
    process.env.EFESOP_ADMIN_PASSWORD = 'correct-horse';
    expect(credentialsValid('george', 'correct-horse')).toBe(true);
  });
});

describe('authToken', () => {
  it('is stable for the same credentials', () => {
    process.env.EFESOP_ADMIN_USER = 'george';
    process.env.EFESOP_ADMIN_PASSWORD = 'correct-horse';
    expect(authToken()).toBe(authToken());
  });

  it('changes when the password changes', () => {
    process.env.EFESOP_ADMIN_USER = 'george';
    process.env.EFESOP_ADMIN_PASSWORD = 'correct-horse';
    const a = authToken();
    process.env.EFESOP_ADMIN_PASSWORD = 'battery-staple';
    expect(authToken()).not.toBe(a);
  });

  it('changes when the username changes', () => {
    process.env.EFESOP_ADMIN_USER = 'george';
    process.env.EFESOP_ADMIN_PASSWORD = 'correct-horse';
    const a = authToken();
    process.env.EFESOP_ADMIN_USER = 'mallory';
    expect(authToken()).not.toBe(a);
  });
});

describe('cookieValid', () => {
  it('accepts the current authToken', () => {
    process.env.EFESOP_ADMIN_USER = 'george';
    process.env.EFESOP_ADMIN_PASSWORD = 'correct-horse';
    expect(cookieValid(authToken())).toBe(true);
  });

  it('rejects undefined', () => {
    process.env.EFESOP_ADMIN_USER = 'george';
    process.env.EFESOP_ADMIN_PASSWORD = 'correct-horse';
    expect(cookieValid(undefined)).toBe(false);
  });

  it('rejects garbage', () => {
    process.env.EFESOP_ADMIN_USER = 'george';
    process.env.EFESOP_ADMIN_PASSWORD = 'correct-horse';
    expect(cookieValid('garbage')).toBe(false);
  });
});

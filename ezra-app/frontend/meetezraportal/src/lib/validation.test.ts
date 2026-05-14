import { describe, it, expect } from 'vitest';
import { isValidEmail } from './validation';

describe('isValidEmail', () => {
  // Valid emails
  it('accepts a standard email address', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('accepts email with subdomain', () => {
    expect(isValidEmail('user@mail.example.com')).toBe(true);
  });

  it('accepts email with dots in local part', () => {
    expect(isValidEmail('first.last@example.com')).toBe(true);
  });

  it('accepts email with plus in local part', () => {
    expect(isValidEmail('user+tag@example.com')).toBe(true);
  });

  it('accepts email with hyphens in domain', () => {
    expect(isValidEmail('user@my-domain.com')).toBe(true);
  });

  it('trims whitespace before validating', () => {
    expect(isValidEmail('  user@example.com  ')).toBe(true);
  });

  // Invalid emails
  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('rejects whitespace-only string', () => {
    expect(isValidEmail('   ')).toBe(false);
  });

  it('rejects string without @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  it('rejects string with multiple @ signs', () => {
    expect(isValidEmail('user@@example.com')).toBe(false);
  });

  it('rejects email without domain dot', () => {
    expect(isValidEmail('user@example')).toBe(false);
  });

  it('rejects email with empty local part', () => {
    expect(isValidEmail('@example.com')).toBe(false);
  });

  it('rejects email with empty domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('rejects email with space in local part', () => {
    expect(isValidEmail('us er@example.com')).toBe(false);
  });

  it('rejects email with space in domain', () => {
    expect(isValidEmail('user@exam ple.com')).toBe(false);
  });

  it('rejects email with trailing dot in domain', () => {
    expect(isValidEmail('user@example.')).toBe(false);
  });

  // Consistency with backend regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  it('matches backend validation for valid emails', () => {
    const backendRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const testEmails = [
      'test@example.com',
      'a@b.c',
      'user+tag@sub.domain.com',
      'name@company.co.uk',
    ];
    for (const email of testEmails) {
      expect(isValidEmail(email)).toBe(backendRegex.test(email));
    }
  });

  it('matches backend validation for invalid emails', () => {
    const backendRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const testEmails = [
      '',
      'noatsign',
      '@nodomain.com',
      'user@',
      'user@nodot',
      'user@@double.com',
    ];
    for (const email of testEmails) {
      expect(isValidEmail(email.trim())).toBe(backendRegex.test(email.trim()));
    }
  });
});

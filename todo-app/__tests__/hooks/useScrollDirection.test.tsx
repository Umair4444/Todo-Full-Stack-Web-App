// Test for useScrollDirection hook
import { renderHook, act } from '@testing-library/react';
import { useScrollDirection } from '@/hooks/useScrollDirection';

// Mock window and document objects
Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
});

Object.defineProperty(document, 'documentElement', {
  writable: true,
  value: { scrollTop: 0 },
});

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  value: jest.fn(),
});

describe('useScrollDirection', () => {
  beforeEach(() => {
    window.scrollY = 0;
    (document.documentElement as any).scrollTop = 0;
  });

  test('returns initial scroll direction as up', () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current).toBe('up');
  });

  // Note: Testing scroll direction changes would require more complex mocking
  // of the scroll event and requestAnimationFrame
});
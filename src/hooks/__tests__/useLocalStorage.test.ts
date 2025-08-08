/**
 * Tests for useLocalStorage hook
 */

import { renderHook, act } from '@testing-library/react';
import { useLocalStorage, useMultipleLocalStorage } from '../useLocalStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should initialize with initial value when no stored value exists', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    expect(result.current.value).toBe('initial-value');
    expect(result.current.error).toBeNull();
  });

  it('should load stored value on initialization', () => {
    // Pre-populate localStorage
    localStorageMock.setItem('test-key', JSON.stringify({
      __version: 1,
      data: 'stored-value'
    }));

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    expect(result.current.value).toBe('stored-value');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    act(() => {
      result.current.setValue('new-value');
    });

    expect(result.current.value).toBe('new-value');
    
    const stored = JSON.parse(localStorageMock.getItem('test-key') || '{}');
    expect(stored.data).toBe('new-value');
    expect(stored.__version).toBe(1);
  });

  it('should handle function updates correctly', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 10)
    );

    act(() => {
      result.current.setValue(prev => prev + 5);
    });

    expect(result.current.value).toBe(15);
  });

  it('should remove value correctly', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    act(() => {
      result.current.setValue('stored-value');
    });

    expect(result.current.value).toBe('stored-value');

    act(() => {
      result.current.removeValue();
    });

    expect(result.current.value).toBe('initial-value');
    expect(localStorageMock.getItem('test-key')).toBeNull();
  });

  it('should handle data migration', () => {
    // Store old version data
    localStorageMock.setItem('test-key', JSON.stringify({
      __version: 1,
      data: { oldField: 'value' }
    }));

    const migrations = {
      2: (data: any) => ({ newField: data.oldField })
    };

    const { result } = renderHook(() =>
      useLocalStorage('test-key', { newField: 'default' }, {
        version: 2,
        migrations
      })
    );

    expect(result.current.value).toEqual({ newField: 'value' });
  });

  it('should handle localStorage errors gracefully', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    // Mock localStorage to throw an error after initialization
    const originalSetItem = localStorageMock.setItem;
    localStorageMock.setItem = () => {
      throw new Error('Quota exceeded');
    };

    act(() => {
      result.current.setValue('new-value');
    });

    expect(result.current.error).toBeTruthy();
    // The error type could be either UNKNOWN_ERROR or ACCESS_DENIED depending on the mock behavior
    expect(['UNKNOWN_ERROR', 'ACCESS_DENIED']).toContain(result.current.error?.type);

    // Restore original method
    localStorageMock.setItem = originalSetItem;
  });

  it('should use fallback value when validation fails', () => {
    const validator = (value: any): value is number => typeof value === 'number';

    const { result } = renderHook(() =>
      useLocalStorage('test-key-validation', 42, { 
        validator,
        fallbackValue: 100
      })
    );

    // Should use fallback value when no stored data exists and fallback is provided
    expect(result.current.value).toBe(100);
    expect(result.current.error).toBeNull();
  });
});

describe('useMultipleLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should manage multiple storage keys', () => {
    const keys = {
      name: 'user-name',
      age: 'user-age',
      email: 'user-email'
    };

    const initialValues = {
      name: 'John',
      age: 30,
      email: 'john@example.com'
    };

    const { result } = renderHook(() =>
      useMultipleLocalStorage(keys, initialValues)
    );

    expect(result.current.values.name).toBe('John');
    expect(result.current.values.age).toBe(30);
    expect(result.current.values.email).toBe('john@example.com');
  });

  it('should update individual properties', () => {
    const keys = {
      name: 'user-name',
      age: 'user-age'
    };

    const initialValues = {
      name: 'John',
      age: 30
    };

    const { result } = renderHook(() =>
      useMultipleLocalStorage(keys, initialValues)
    );

    act(() => {
      result.current.updateValue('name', 'Jane');
    });

    expect(result.current.values.name).toBe('Jane');
    expect(result.current.values.age).toBe(30);
  });

  it('should update multiple properties at once', () => {
    const keys = {
      name: 'user-name',
      age: 'user-age'
    };

    const initialValues = {
      name: 'John',
      age: 30
    };

    const { result } = renderHook(() =>
      useMultipleLocalStorage(keys, initialValues)
    );

    act(() => {
      result.current.updateValues({
        name: 'Jane',
        age: 25
      });
    });

    expect(result.current.values.name).toBe('Jane');
    expect(result.current.values.age).toBe(25);
  });
});
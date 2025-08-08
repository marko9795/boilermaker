/**
 * Custom hook for localStorage operations with error handling and type safety
 * Supports data migration for backward compatibility
 */

import { useState, useCallback, useEffect, useRef } from 'react';

// Storage error types
export type StorageError = 
  | 'QUOTA_EXCEEDED'
  | 'PARSE_ERROR'
  | 'MIGRATION_ERROR'
  | 'ACCESS_DENIED'
  | 'UNKNOWN_ERROR';

// Storage operation result
export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: {
    type: StorageError;
    message: string;
    originalError?: Error;
  };
}

// Data migration function type
export type MigrationFunction<T> = (data: any, version: number) => T;

// Storage options
export interface UseLocalStorageOptions<T> {
  // Serialization options
  serializer?: {
    serialize: (value: T) => string;
    deserialize: (value: string) => T;
  };
  
  // Migration options
  version?: number;
  migrations?: Record<number, MigrationFunction<T>>;
  
  // Error handling options
  throwOnError?: boolean;
  fallbackValue?: T;
  
  // Performance options
  syncAcrossWindows?: boolean;
  debounceMs?: number;
  
  // Validation options
  validator?: (value: any) => value is T;
}

// Default serializer using JSON
const defaultSerializer = {
  serialize: JSON.stringify,
  deserialize: JSON.parse
};

/**
 * Custom hook for type-safe localStorage operations
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 * @param options - Hook configuration options
 * @returns Storage state and operations
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
) => {
  const {
    serializer = defaultSerializer,
    version = 1,
    migrations = {},
    throwOnError = false,
    fallbackValue,
    syncAcrossWindows = true,
    debounceMs = 0,
    validator
  } = options;

  // Internal state
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [error, setError] = useState<StorageResult<T>['error'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs for debouncing and cleanup
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const isInitializedRef = useRef(false);

  /**
   * Create storage error object
   */
  const createError = (
    type: StorageError,
    message: string,
    originalError?: Error
  ): StorageResult<T>['error'] => ({
    type,
    message,
    originalError
  });

  /**
   * Check if localStorage is available
   */
  const isStorageAvailable = useCallback((): boolean => {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }, []);

  /**
   * Apply data migrations
   */
  const applyMigrations = useCallback((data: any, currentVersion: number): T => {
    let migratedData = data;
    
    // Apply migrations in sequence from current version to target version
    for (let v = currentVersion + 1; v <= version; v++) {
      if (migrations[v]) {
        try {
          migratedData = migrations[v](migratedData, v - 1);
        } catch (error) {
          throw new Error(`Migration to version ${v} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }
    
    return migratedData;
  }, [version, migrations]);

  /**
   * Read value from localStorage with error handling and migration
   */
  const readValue = useCallback((): StorageResult<T> => {
    if (!isStorageAvailable()) {
      return {
        success: false,
        error: createError('ACCESS_DENIED', 'localStorage is not available')
      };
    }

    try {
      const item = localStorage.getItem(key);
      
      if (item === null) {
        return {
          success: true,
          data: fallbackValue ?? initialValue
        };
      }

      const parsed = serializer.deserialize(item);
      
      // Handle versioned data
      let data: T;
      let dataVersion = 1;
      
      if (parsed && typeof parsed === 'object' && '__version' in parsed) {
        dataVersion = parsed.__version;
        data = parsed.data;
      } else {
        data = parsed;
      }

      // Apply migrations if needed
      if (dataVersion < version) {
        try {
          data = applyMigrations(data, dataVersion);
        } catch (error) {
          return {
            success: false,
            error: createError(
              'MIGRATION_ERROR',
              `Failed to migrate data from version ${dataVersion} to ${version}`,
              error instanceof Error ? error : undefined
            )
          };
        }
      }

      // Validate data if validator provided
      if (validator && !validator(data)) {
        return {
          success: false,
          error: createError('PARSE_ERROR', 'Data validation failed')
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: createError(
          'PARSE_ERROR',
          'Failed to parse stored data',
          error instanceof Error ? error : undefined
        )
      };
    }
  }, [key, initialValue, fallbackValue, serializer, version, applyMigrations, validator, isStorageAvailable]);

  /**
   * Write value to localStorage with error handling
   */
  const writeValue = useCallback((value: T): StorageResult<T> => {
    if (!isStorageAvailable()) {
      return {
        success: false,
        error: createError('ACCESS_DENIED', 'localStorage is not available')
      };
    }

    try {
      // Wrap data with version information
      const versionedData = {
        __version: version,
        data: value
      };

      const serialized = serializer.serialize(versionedData as any);
      localStorage.setItem(key, serialized);
      
      return {
        success: true,
        data: value
      };
    } catch (error) {
      const errorType: StorageError = 
        error instanceof Error && error.name === 'QuotaExceededError'
          ? 'QUOTA_EXCEEDED'
          : 'UNKNOWN_ERROR';
      
      return {
        success: false,
        error: createError(
          errorType,
          'Failed to save data to localStorage',
          error instanceof Error ? error : undefined
        )
      };
    }
  }, [key, version, serializer, isStorageAvailable]);

  /**
   * Initialize storage value
   */
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    const result = readValue();
    
    if (result.success && result.data !== undefined) {
      setStoredValue(result.data);
      setError(null);
    } else if (result.error) {
      setError(result.error);
      
      if (throwOnError) {
        throw new Error(`localStorage read error: ${result.error.message}`);
      }
      
      // Use fallback value on error
      if (fallbackValue !== undefined) {
        setStoredValue(fallbackValue);
      }
    }
    
    setIsLoading(false);
    isInitializedRef.current = true;
  }, [readValue, throwOnError, fallbackValue]);

  /**
   * Set value with debouncing and error handling
   */
  const setValue = useCallback((value: T | ((prevValue: T) => T)) => {
    const newValue = value instanceof Function ? value(storedValue) : value;
    
    // Update state immediately for responsive UI
    setStoredValue(newValue);
    setError(null);
    
    // Debounce localStorage writes
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    const writeToStorage = () => {
      const result = writeValue(newValue);
      
      if (!result.success && result.error) {
        setError(result.error);
        
        if (throwOnError) {
          throw new Error(`localStorage write error: ${result.error.message}`);
        }
      }
    };
    
    if (debounceMs > 0) {
      debounceTimeoutRef.current = setTimeout(writeToStorage, debounceMs);
    } else {
      writeToStorage();
    }
  }, [storedValue, writeValue, debounceMs, throwOnError]);

  /**
   * Remove value from localStorage
   */
  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
      setError(null);
    } catch (error) {
      const storageError = createError(
        'UNKNOWN_ERROR',
        'Failed to remove item from localStorage',
        error instanceof Error ? error : undefined
      );
      
      setError(storageError);
      
      if (throwOnError) {
        throw new Error(`localStorage remove error: ${storageError.message}`);
      }
    }
  }, [key, initialValue, throwOnError]);

  /**
   * Clear all errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Force refresh from localStorage
   */
  const refresh = useCallback(() => {
    const result = readValue();
    
    if (result.success && result.data !== undefined) {
      setStoredValue(result.data);
      setError(null);
    } else if (result.error) {
      setError(result.error);
    }
  }, [readValue]);

  /**
   * Listen for storage changes across windows/tabs
   */
  useEffect(() => {
    if (!syncAcrossWindows) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsed = serializer.deserialize(e.newValue);
          const data = parsed && typeof parsed === 'object' && '__version' in parsed
            ? parsed.data
            : parsed;
          
          if (!validator || validator(data)) {
            setStoredValue(data);
            setError(null);
          }
        } catch (error) {
          setError(createError(
            'PARSE_ERROR',
            'Failed to sync storage change',
            error instanceof Error ? error : undefined
          ));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, serializer, validator, syncAcrossWindows]);

  /**
   * Cleanup debounce timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    value: storedValue,
    error,
    isLoading,
    
    // Operations
    setValue,
    removeValue,
    refresh,
    clearError,
    
    // Utilities
    isAvailable: isStorageAvailable()
  };
};

/**
 * Hook for managing multiple localStorage keys as a single object
 * @param keys - Object mapping property names to storage keys
 * @param initialValues - Initial values for each property
 * @param options - Shared options for all storage operations
 * @returns Object with all storage values and operations
 */
export const useMultipleLocalStorage = <T extends Record<string, any>>(
  keys: Record<keyof T, string>,
  initialValues: T,
  options: UseLocalStorageOptions<any> = {}
) => {
  const storageHooks = Object.entries(keys).reduce((acc, [prop, key]) => {
    acc[prop as keyof T] = useLocalStorage(
      key as string,
      initialValues[prop as keyof T],
      options
    );
    return acc;
  }, {} as Record<keyof T, ReturnType<typeof useLocalStorage>>);

  // Combine all values into a single object
  const values = Object.entries(storageHooks).reduce((acc, [prop, hook]) => {
    acc[prop as keyof T] = hook.value;
    return acc;
  }, {} as T);

  // Combine all errors
  const errors = Object.entries(storageHooks)
    .filter(([, hook]) => hook.error)
    .map(([prop, hook]) => ({ property: prop, error: hook.error! }));

  // Check if any are loading
  const isLoading = Object.values(storageHooks).some(hook => hook.isLoading);

  // Update function that updates a specific property
  const updateValue = useCallback(<K extends keyof T>(
    property: K,
    value: T[K] | ((prevValue: T[K]) => T[K])
  ) => {
    storageHooks[property].setValue(value);
  }, [storageHooks]);

  // Update multiple properties at once
  const updateValues = useCallback((updates: Partial<T>) => {
    Object.entries(updates).forEach(([prop, value]) => {
      if (storageHooks[prop as keyof T]) {
        storageHooks[prop as keyof T].setValue(value);
      }
    });
  }, [storageHooks]);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    Object.values(storageHooks).forEach(hook => hook.clearError());
  }, [storageHooks]);

  // Refresh all values
  const refreshAll = useCallback(() => {
    Object.values(storageHooks).forEach(hook => hook.refresh());
  }, [storageHooks]);

  return {
    values,
    errors,
    isLoading,
    updateValue,
    updateValues,
    clearAllErrors,
    refreshAll,
    hooks: storageHooks
  };
};

/**
 * Hook for localStorage with automatic JSON schema validation
 * @param key - Storage key
 * @param initialValue - Initial value
 * @param schema - JSON schema for validation
 * @param options - Additional options
 * @returns Storage state with schema validation
 */
export const useValidatedLocalStorage = <T>(
  key: string,
  initialValue: T,
  schema: any, // JSON Schema object
  options: Omit<UseLocalStorageOptions<T>, 'validator'> = {}
) => {
  // Simple schema validator (in a real app, you'd use a library like Ajv)
  const validator = useCallback((value: any): value is T => {
    // Basic type checking based on schema
    if (schema.type === 'object' && typeof value !== 'object') return false;
    if (schema.type === 'array' && !Array.isArray(value)) return false;
    if (schema.type === 'string' && typeof value !== 'string') return false;
    if (schema.type === 'number' && typeof value !== 'number') return false;
    if (schema.type === 'boolean' && typeof value !== 'boolean') return false;
    
    // Additional validation could be added here
    return true;
  }, [schema]);

  return useLocalStorage(key, initialValue, {
    ...options,
    validator
  });
};
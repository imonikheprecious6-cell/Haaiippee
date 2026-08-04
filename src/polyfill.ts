// Polyfill for sandboxed environments where window.fetch has only a getter.
// Prevents "Uncaught TypeError: Cannot set property fetch of #<Window> which has only a getter"
if (typeof window !== 'undefined') {
  try {
    const origFetch = window.fetch;
    let currentFetch = origFetch ? function(this: any, ...args: any[]) {
      return origFetch.apply(window, args as [RequestInfo | URL, RequestInit?]);
    } : undefined;

    const descriptor: PropertyDescriptor = {
      get() {
        return currentFetch;
      },
      set(val: any) {
        currentFetch = val;
      },
      configurable: true,
      enumerable: true
    };

    try {
      Object.defineProperty(window, 'fetch', descriptor);
    } catch (e) {
      // Ignore if already defined or restricted
    }

    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, 'fetch', descriptor);
      } catch (e) {
        // Ignore
      }
    }
  } catch (err) {
    console.warn('Polyfill for window.fetch failed:', err);
  }
}

export {};

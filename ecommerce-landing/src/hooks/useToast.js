import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg, type = 'default') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);
  return { toast, show };
}

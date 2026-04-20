import { useState, useCallback } from 'react';
import { cart as cartApi } from '../api.js';

export function useCart() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setCartData(await cartApi.get()); } catch { setCartData(null); } finally { setLoading(false); }
  }, []);

  const add = useCallback(async (productId, quantity) => {
    const data = await cartApi.add(productId, quantity); setCartData(data); return data;
  }, []);

  const updateItem = useCallback(async (itemId, quantity) => {
    const data = await cartApi.updateItem(itemId, quantity); setCartData(data);
  }, []);

  const removeItem = useCallback(async (itemId) => {
    await cartApi.removeItem(itemId); await load();
  }, [load]);

  return {
    cartData, loading,
    itemCount: cartData?.items?.reduce((a, i) => a + i.quantity, 0) || 0,
    load, add, updateItem, removeItem,
    clear: () => setCartData(null),
  };
}

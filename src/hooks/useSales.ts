import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export interface Sale {
  id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  sale_date: string;
  marketplace: string;
  created_at: string;
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchSales();
  }, []);

  async function fetchSales() {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          products (
            sku,
            name
          )
        `)
        .order('sale_date', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (err) {
      setError(err as Error);
      toast.error('Failed to fetch sales');
    } finally {
      setLoading(false);
    }
  }

  async function addSale(sale: Omit<Sale, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert([sale])
        .select()
        .single();

      if (error) throw error;
      setSales(prev => [data, ...prev]);
      toast.success('Sale recorded successfully');
      return data;
    } catch (err) {
      toast.error('Failed to record sale');
      throw err;
    }
  }

  return {
    sales,
    loading,
    error,
    addSale,
    refreshSales: fetchSales
  };
}
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export interface ActivityLog {
  id: string;
  type: string;
  description: string;
  created_at: string;
  metadata: Record<string, any>;
}

export function useActivityLog() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      setError(err as Error);
      toast.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  }

  async function logActivity(activity: Omit<ActivityLog, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .insert([activity])
        .select()
        .single();

      if (error) throw error;
      setActivities(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Failed to log activity:', err);
      throw err;
    }
  }

  return {
    activities,
    loading,
    error,
    logActivity,
    refreshActivities: fetchActivities
  };
}
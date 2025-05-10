export interface SKU {
  id: string;
  sku: string;
  msku: string;
  marketplace: string;
  lastUpdated: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
  type: string;
}

export interface ImportConfig {
  encoding: string;
  delimiter: string;
  hasHeaderRow: boolean;
  trimWhitespace: boolean;
  skipEmptyRows: boolean;
  validateSku: boolean;
  autoMatchSku: boolean;
}

export interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: 'blue' | 'emerald' | 'amber' | 'red';
}

export interface DataPoint {
  label: string;
  value: number;
}

export interface ActivityItem {
  id: number;
  type: 'order' | 'shipping' | 'alert' | 'return' | 'invoice';
  description: string;
  time: string;
}

export interface QueryHistoryItem {
  id: number;
  name: string;
  query: string;
  date: string;
}

export interface DatabaseTable {
  name: string;
  columns: { name: string; type: string }[];
}

export interface QueryResult {
  success: boolean;
  message?: string;
  data?: any[];
  error?: Error;
  columns?: string[];
  totalRows?: number;
}
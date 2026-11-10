export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<{ success: boolean; meta: any }>;
  all<T = unknown>(): Promise<{ results?: T[]; success: boolean; meta: any }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<any[]>;
  exec(query: string): Promise<any>;
}

export interface Fetcher {
  fetch(request: Request | string, init?: RequestInit): Promise<Response>;
}

export interface Env {
  DB: D1Database;
  ASSETS?: Fetcher;
}

export interface Product {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  price: number;
  discounted_price: number;
  cover_image: string;
  category: string;
  badge?: string;
  rating?: number;
  is_featured?: number;
  created_at?: string;
}

export interface Course {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  price: number;
  discounted_price: number;
  cover_image: string;
  duration?: string;
  is_enrolling?: number;
  created_at?: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  icon?: string;
  summary?: string;
  description?: string;
  category?: string;
  tags?: string;
  live_url?: string;
  github_url?: string;
  is_featured?: number;
  created_at?: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  read_time: string;
  publish_date: string;
  created_at?: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  subject?: string;
  package?: string;
  message: string;
  status: string;
  created_at: string;
}

export interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  payment_method: string;
  sender_number?: string;
  transaction_id?: string;
  items_json: string;
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  created_at: string;
}

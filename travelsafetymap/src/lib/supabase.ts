import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Veritabanı tipleri
export interface Country {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  risk_score: number;
  last_updated: string;
  created_at: string;
}

export interface City {
  id: string;
  name: string;
  country_id: string;
  latitude: number;
  longitude: number;
  risk_score: number;
  last_updated: string;
  created_at: string;
}

export interface SecurityIncident {
  id: string;
  location_id: string;
  location_type: 'country' | 'city';
  incident_type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  reported_at: string;
  created_at: string;
}

export interface NaturalDisaster {
  id: string;
  location_id: string;
  location_type: 'country' | 'city';
  disaster_type: string;
  description: string;
  magnitude?: number;
  source: string;
  reported_at: string;
  created_at: string;
}

export interface WeatherWarning {
  id: string;
  location_id: string;
  location_type: 'country' | 'city';
  warning_type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  valid_until: string;
  created_at: string;
}

export interface NewsItem {
  id: string;
  location_id: string;
  location_type: 'country' | 'city';
  title: string;
  content: string;
  url: string;
  source: string;
  sentiment_score: number; // -1 ile 1 arası
  published_at: string;
  created_at: string;
}

export interface AIRiskPrediction {
  id: string;
  location_id: string;
  location_type: 'country' | 'city';
  predicted_risk_score: number;
  confidence: number;
  factors: string[];
  predicted_for_date: string;
  created_at: string;
}

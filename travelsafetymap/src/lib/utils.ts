import { clsx, type ClassValue } from 'clsx';

// CSS sınıflarını birleştirme
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Risk seviyesi rengi alma
export function getRiskColor(score: number) {
  if (score <= 20) return 'text-green-600 bg-green-100';
  if (score <= 40) return 'text-green-500 bg-green-50';
  if (score <= 60) return 'text-yellow-600 bg-yellow-100';
  if (score <= 80) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
}

// Risk seviyesi metni alma
export function getRiskLevel(score: number) {
  if (score <= 20) return 'Düşük';
  if (score <= 40) return 'Orta-Düşük';
  if (score <= 60) return 'Orta';
  if (score <= 80) return 'Yüksek';
  return 'Çok Yüksek';
}

// Tarih formatlama
export function formatDate(date: string | Date, format: 'short' | 'long' = 'short') {
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  return d.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Zaman önce hesaplama
export function timeAgo(date: string | Date) {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Az önce';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} gün önce`;
  
  return formatDate(date, 'short');
}

// Metin kısaltma
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Sayı formatlama
export function formatNumber(num: number) {
  return new Intl.NumberFormat('tr-TR').format(num);
}

// Koordinat doğrulama
export function isValidCoordinate(lat: number, lng: number) {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// Mesafe hesaplama (Haversine formülü)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Dünya'nın yarıçapı (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// UUID oluşturma
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Local storage yardımcıları
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Hata durumunda sessizce geç
    }
  },
  
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Hata durumunda sessizce geç
    }
  }
};

// Debounce fonksiyonu
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle fonksiyonu
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// API hata mesajı formatlama
export function formatApiError(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'Bilinmeyen bir hata oluştu';
}

// URL parametrelerini parse etme
export function parseUrlParams(url: string): Record<string, string> {
  const params = new URLSearchParams(url.split('?')[1] || '');
  const result: Record<string, string> = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
}

// Telefon numarası formatlama
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
}

// Email doğrulama
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Şifre gücü kontrolü
export function getPasswordStrength(password: string): {
  score: number;
  level: 'weak' | 'medium' | 'strong';
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) score += 1;
  else feedback.push('En az 8 karakter olmalı');
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('En az bir küçük harf içermeli');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('En az bir büyük harf içermeli');
  
  if (/\d/.test(password)) score += 1;
  else feedback.push('En az bir rakam içermeli');
  
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push('En az bir özel karakter içermeli');
  
  let level: 'weak' | 'medium' | 'strong';
  if (score <= 2) level = 'weak';
  else if (score <= 4) level = 'medium';
  else level = 'strong';
  
  return { score, level, feedback };
}

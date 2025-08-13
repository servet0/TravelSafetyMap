import React from 'react';
import { clsx } from 'clsx';

interface RiskIndicatorProps {
  score: number; // 0-100 arası
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  score,
  size = 'md',
  showLabel = true,
  className
}) => {
  const getRiskLevel = (score: number) => {
    if (score <= 20) return { level: 'Düşük', color: 'bg-green-500', textColor: 'text-green-700' };
    if (score <= 40) return { level: 'Orta-Düşük', color: 'bg-green-400', textColor: 'text-green-600' };
    if (score <= 60) return { level: 'Orta', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    if (score <= 80) return { level: 'Yüksek', color: 'bg-orange-500', textColor: 'text-orange-700' };
    return { level: 'Çok Yüksek', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  const { level, color, textColor } = getRiskLevel(score);

  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className={clsx('rounded-full', color, sizes[size])} />
      {showLabel && (
        <span className={clsx('text-sm font-medium', textColor)}>
          {level} ({score}/100)
        </span>
      )}
    </div>
  );
};

// Risk skoru hesaplama fonksiyonu
export const calculateRiskScore = (
  securityIncidents: number,
  naturalDisasters: number,
  weatherWarnings: number,
  newsSentiment: number // -1 ile 1 arası
): number => {
  // Ağırlıklı hesaplama
  const securityWeight = 0.4;
  const disasterWeight = 0.3;
  const weatherWeight = 0.2;
  const sentimentWeight = 0.1;

  // Normalize edilmiş değerler
  const normalizedSecurity = Math.min(securityIncidents * 10, 100);
  const normalizedDisasters = Math.min(naturalDisasters * 20, 100);
  const normalizedWeather = Math.min(weatherWarnings * 15, 100);
  const normalizedSentiment = ((1 - newsSentiment) / 2) * 100; // Negatif sentiment = yüksek risk

  const totalScore = 
    normalizedSecurity * securityWeight +
    normalizedDisasters * disasterWeight +
    normalizedWeather * weatherWeight +
    normalizedSentiment * sentimentWeight;

  return Math.round(Math.min(Math.max(totalScore, 0), 100));
};

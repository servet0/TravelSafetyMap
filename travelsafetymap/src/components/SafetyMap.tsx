'use client';

import React, { useState } from 'react';
import { RiskIndicator } from './RiskIndicator';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { MapPin, AlertTriangle, Info } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  risk_score: number;
  type: 'country' | 'city';
}

interface SafetyMapProps {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
  className?: string;
}

export const SafetyMap: React.FC<SafetyMapProps> = ({
  locations,
  onLocationClick,
  className
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);

  // Risk skoruna göre renk belirleme
  const getRiskColor = (score: number) => {
    if (score <= 30) return '#10B981'; // Yeşil - Düşük risk
    if (score <= 60) return '#F59E0B'; // Sarı - Orta risk
    return '#EF4444'; // Kırmızı - Yüksek risk
  };

  // Koordinatları SVG koordinatlarına dönüştür
  const latLngToSvg = (lat: number, lng: number) => {
    // Basit dönüşüm - gerçek uygulamada daha gelişmiş projeksiyon kullanılabilir
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  // Risk skoruna göre boyut belirleme
  const getRiskSize = (score: number, type: 'country' | 'city') => {
    const baseSize = type === 'country' ? 8 : 6;
    return baseSize + (score / 15);
  };

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  const handleMarkerHover = (location: Location | null) => {
    setHoveredLocation(location);
  };

  return (
    <div className={`w-full h-[600px] rounded-lg overflow-hidden bg-white border ${className}`}>
      {/* SVG Harita */}
      <div className="relative w-full h-full">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 400"
          className="w-full h-full"
        >
          {/* Basit dünya haritası çizimi */}
          <rect width="800" height="400" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          
          {/* Kıtalar (basit dikdörtgenler) */}
          <rect x="100" y="150" width="200" height="100" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1" rx="5" />
          <rect x="350" y="120" width="150" height="80" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1" rx="5" />
          <rect x="550" y="180" width="120" height="60" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1" rx="5" />
          <rect x="50" y="280" width="300" height="80" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1" rx="5" />
          
          {/* Lokasyon noktaları */}
          {locations.map((location) => {
            const { x, y } = latLngToSvg(location.latitude, location.longitude);
            const size = getRiskSize(location.risk_score, location.type);
            const color = getRiskColor(location.risk_score);
            const isHovered = hoveredLocation?.id === location.id;
            
            return (
              <g key={location.id}>
                {/* Hover efekti */}
                {isHovered && (
                  <circle
                    cx={x}
                    cy={y}
                    r={size + 4}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                )}
                
                {/* Ana nokta */}
                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  opacity="0.8"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleMarkerClick(location)}
                  onMouseEnter={() => handleMarkerHover(location)}
                  onMouseLeave={() => handleMarkerHover(null)}
                />
                
                {/* Nokta içi işaret */}
                <circle
                  cx={x}
                  cy={y}
                  r={size * 0.3}
                  fill="#ffffff"
                  opacity="0.9"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredLocation && (
          <div 
            className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 pointer-events-none"
            style={{
              left: `${latLngToSvg(hoveredLocation.latitude, hoveredLocation.longitude).x}px`,
              top: `${latLngToSvg(hoveredLocation.latitude, hoveredLocation.longitude).y - 60}px`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="text-sm font-medium">{hoveredLocation.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <RiskIndicator score={hoveredLocation.risk_score} />
              <span className="text-xs text-gray-600">
                {hoveredLocation.type === 'country' ? 'Ülke' : 'Şehir'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Seçili lokasyon bilgisi */}
      {selectedLocation && (
        <div className="absolute top-4 right-4 z-10 max-w-sm">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {selectedLocation.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <RiskIndicator score={selectedLocation.risk_score} />
                    <span className="text-sm text-gray-600">
                      {selectedLocation.type === 'country' ? 'Ülke' : 'Şehir'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Risk Skoru: {selectedLocation.risk_score}/100
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLocation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Harita açıklaması */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Düşük (0-30)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Orta (31-60)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Yüksek (61-100)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Harita bilgisi */}
      <div className="absolute top-4 left-4 z-10">
        <Card>
          <CardContent className="p-2">
            <div className="text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Info className="w-3 h-3" />
                <span>Basit Harita Görünümü</span>
              </div>
              <div className="mt-1">
                <span>Noktalara tıklayarak detayları görüntüleyin</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

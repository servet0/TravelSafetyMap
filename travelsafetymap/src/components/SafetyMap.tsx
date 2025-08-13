'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

  // Risk skoruna göre renk belirleme
  const getRiskColor = (score: number) => {
    if (score <= 30) return '#10B981'; // Yeşil - Düşük risk
    if (score <= 60) return '#F59E0B'; // Sarı - Orta risk
    return '#EF4444'; // Kırmızı - Yüksek risk
  };

  // Risk skoruna göre boyut belirleme
  const getRiskSize = (score: number, type: 'country' | 'city') => {
    const baseSize = type === 'country' ? 12 : 8;
    return baseSize + (score / 10);
  };

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  return (
    <div className={`w-full h-[600px] rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={[39.9334, 32.8597]} // Türkiye merkezi
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {locations.map((location) => (
          <CircleMarker
            key={location.id}
            center={[location.latitude, location.longitude]}
            radius={getRiskSize(location.risk_score, location.type)}
            fillColor={getRiskColor(location.risk_score)}
            color={getRiskColor(location.risk_score)}
            weight={2}
            opacity={0.8}
            fillOpacity={0.6}
            eventHandlers={{
              click: () => handleMarkerClick(location),
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 0.8,
                  weight: 3
                });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 0.6,
                  weight: 2
                });
              }
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{location.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <RiskIndicator score={location.risk_score} />
                  <span className="text-xs text-gray-600">
                    {location.type === 'country' ? 'Ülke' : 'Şehir'}
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => handleMarkerClick(location)}
                >
                  Detayları Gör
                </Button>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

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
    </div>
  );
};

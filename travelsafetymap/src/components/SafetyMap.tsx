'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RiskIndicator } from './RiskIndicator';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { MapPin, AlertTriangle, Info } from 'lucide-react';

// Mapbox token'ı environment'dan al
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Harita başlat
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [32.8597, 39.9334], // Türkiye merkezi
      zoom: 4,
      attributionControl: false
    });

    // Harita yüklendiğinde
    map.current.on('load', () => {
      setIsLoading(false);
      
      // Lokasyonları haritaya ekle
      addLocationsToMap();
    });

    // Temizlik
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Lokasyonları haritaya ekle
  const addLocationsToMap = () => {
    if (!map.current) return;

    // GeoJSON formatında veri hazırla
    const geojson = {
      type: 'FeatureCollection',
      features: locations.map(location => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        },
        properties: {
          id: location.id,
          name: location.name,
          risk_score: location.risk_score,
          type: location.type
        }
      }))
    };

    // Kaynak ekle
    map.current.addSource('locations', {
      type: 'geojson',
      data: geojson as any
    });

    // Lokasyon işaretleri ekle
    map.current.addLayer({
      id: 'location-points',
      type: 'circle',
      source: 'locations',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'risk_score'],
          0, 8,
          100, 20
        ],
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'risk_score'],
          0, '#10b981', // Yeşil
          25, '#84cc16', // Lime
          50, '#f59e0b', // Amber
          75, '#f97316', // Orange
          100, '#ef4444' // Kırmızı
        ],
        'circle-opacity': 0.8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Hover efekti
    map.current.on('mouseenter', 'location-points', () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = 'pointer';
      }
    });

    map.current.on('mouseleave', 'location-points', () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = '';
      }
    });

    // Tıklama olayı
    map.current.on('click', 'location-points', (e) => {
      if (e.features && e.features[0]) {
        const feature = e.features[0];
        const location: Location = {
          id: feature.properties?.id,
          name: feature.properties?.name,
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
          risk_score: feature.properties?.risk_score,
          type: feature.properties?.type
        };
        
        setSelectedLocation(location);
        onLocationClick?.(location);
      }
    });
  };

  // Lokasyonlar değiştiğinde haritayı güncelle
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      addLocationsToMap();
    }
  }, [locations]);

  const getRiskColor = (score: number) => {
    if (score <= 20) return 'text-green-600';
    if (score <= 40) return 'text-green-500';
    if (score <= 60) return 'text-yellow-600';
    if (score <= 80) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Harita container */}
      <div 
        ref={mapContainer} 
        className="w-full h-[600px] rounded-lg shadow-lg"
      />
      
      {/* Yükleme göstergesi */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Harita yükleniyor...</p>
          </div>
        </div>
      )}
      
      {/* Seçili lokasyon detayı */}
      {selectedLocation && (
        <div className="absolute top-4 right-4 w-80">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold text-lg">{selectedLocation.name}</h3>
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
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Risk Seviyesi:</span>
                  <RiskIndicator 
                    score={selectedLocation.risk_score} 
                    size="sm"
                  />
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Info className="w-4 h-4" />
                  <span>{selectedLocation.type === 'country' ? 'Ülke' : 'Şehir'}</span>
                </div>
                
                <Button
                  onClick={() => onLocationClick?.(selectedLocation)}
                  className="w-full"
                >
                  Detayları Görüntüle
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Risk seviyesi açıklaması */}
      <div className="absolute bottom-4 left-4">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Risk Seviyeleri</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Düşük (0-20)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Orta (21-60)</span>
              </div>
              <div className="flex items-center gap-2">
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

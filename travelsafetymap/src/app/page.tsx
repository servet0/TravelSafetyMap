'use client';

import React, { useState, useEffect } from 'react';
import { SafetyMap } from '../components/SafetyMap';
import { LocationDetail } from '../components/LocationDetail';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RefreshCw, Info, Globe, Shield, TrendingUp } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  risk_score: number;
  type: 'country' | 'city';
}

export default function HomePage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Mock veri - gerçek uygulamada DataService'den gelecek
  const mockLocations: Location[] = [
    {
      id: '1',
      name: 'Türkiye',
      latitude: 39.9334,
      longitude: 32.8597,
      risk_score: 45,
      type: 'country'
    },
    {
      id: '2',
      name: 'İstanbul',
      latitude: 41.0082,
      longitude: 28.9784,
      risk_score: 35,
      type: 'city'
    },
    {
      id: '3',
      name: 'Ankara',
      latitude: 39.9334,
      longitude: 32.8597,
      risk_score: 25,
      type: 'city'
    },
    {
      id: '4',
      name: 'İzmir',
      latitude: 38.4192,
      longitude: 27.1287,
      risk_score: 30,
      type: 'city'
    },
    {
      id: '5',
      name: 'Amerika Birleşik Devletleri',
      latitude: 37.0902,
      longitude: -95.7129,
      risk_score: 55,
      type: 'country'
    },
    {
      id: '6',
      name: 'New York',
      latitude: 40.7128,
      longitude: -74.0060,
      risk_score: 65,
      type: 'city'
    },
    {
      id: '7',
      name: 'İngiltere',
      latitude: 55.3781,
      longitude: -3.4360,
      risk_score: 40,
      type: 'country'
    },
    {
      id: '8',
      name: 'London',
      latitude: 51.5074,
      longitude: -0.1278,
      risk_score: 50,
      type: 'city'
    }
  ];

  useEffect(() => {
    setIsClient(true);
    setLastUpdated(new Date());
    
    // Mock veri yükleme simülasyonu
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      setLocations(mockLocations);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleBackToMap = () => {
    setSelectedLocation(null);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setLastUpdated(new Date());
    await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
    setIsLoading(false);
  };

  if (selectedLocation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <LocationDetail
            location={selectedLocation}
            onBack={handleBackToMap}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Travel Safety Map</h1>
              <p className="text-gray-600 mt-2">
                Dünya genelindeki güvenlik durumu, doğal afet uyarıları ve risk analizi
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Yenile
            </Button>
          </div>

          {/* İstatistik kartları */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Lokasyon</p>
                    <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
                  </div>
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ülkeler</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {locations.filter(l => l.type === 'country').length}
                    </p>
                  </div>
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Şehirler</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {locations.filter(l => l.type === 'city').length}
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ortalama Risk</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {locations.length > 0 
                        ? Math.round(locations.reduce((sum, l) => sum + l.risk_score, 0) / locations.length)
                        : 0
                      }
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Son güncelleme bilgisi */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Son güncelleme:</span>
              <span className="font-medium">
                {isClient && lastUpdated ? lastUpdated.toLocaleString('tr-TR') : 'Yükleniyor...'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Info className="w-4 h-4" />
              <span>Veriler her 15 dakikada bir güncellenir</span>
            </div>
          </div>
        </div>

        {/* Harita */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Güvenlik Haritası</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Harita üzerindeki noktalara tıklayarak detayları görüntüleyin</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-[600px] bg-white rounded-lg shadow-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Harita yükleniyor...</p>
              </div>
            </div>
          ) : (
            <SafetyMap
              locations={locations}
              onLocationClick={handleLocationClick}
              className="shadow-lg"
            />
          )}
        </div>

        {/* Bilgi kartı */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Düşük Risk</h3>
                <p className="text-sm text-gray-600">0-30 arası risk skoru</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Orta Risk</h3>
                <p className="text-sm text-gray-600">31-60 arası risk skoru</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Yüksek Risk</h3>
                <p className="text-sm text-gray-600">61-100 arası risk skoru</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

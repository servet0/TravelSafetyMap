'use client';

import React, { useState, useEffect } from 'react';
import { SafetyMap } from '../components/SafetyMap';
import { LocationDetail } from '../components/LocationDetail';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RiskIndicator } from '../components/RiskIndicator';
import { 
  Globe, 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCw,
  Settings,
  Info
} from 'lucide-react';

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
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

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

  const handleRefreshData = async () => {
    setIsLoading(true);
    // Gerçek uygulamada DataService.updateAllData() çağrılacak
    await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay
    
    // Mock veri güncelleme
    const updatedLocations = mockLocations.map(location => ({
      ...location,
      risk_score: Math.floor(Math.random() * 80) + 10 // 10-90 arası rastgele
    }));
    
    setLocations(updatedLocations);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const getGlobalRiskLevel = () => {
    if (locations.length === 0) return 0;
    const averageRisk = locations.reduce((sum, loc) => sum + loc.risk_score, 0) / locations.length;
    return Math.round(averageRisk);
  };

  const getHighRiskLocations = () => {
    return locations.filter(loc => loc.risk_score > 60).length;
  };

  if (selectedLocation) {
    return (
      <LocationDetail
        locationId={selectedLocation.id}
        locationType={selectedLocation.type}
        locationName={selectedLocation.name}
        riskScore={selectedLocation.risk_score}
        onBack={handleBackToMap}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Travel Safety Map</h1>
                <p className="text-sm text-gray-600">Dünya geneli güvenlik durumu</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RefreshCw className="w-4 h-4" />
                <span>Son güncelleme: {lastUpdated.toLocaleTimeString('tr-TR')}</span>
              </div>
              
              <Button onClick={handleRefreshData} disabled={isLoading} size="sm">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Yenile
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Ana içerik */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Lokasyon</p>
                  <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Genel Risk Seviyesi</p>
                  <div className="flex items-center gap-2 mt-1">
                    <RiskIndicator score={getGlobalRiskLevel()} size="sm" />
                  </div>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Yüksek Riskli</p>
                  <p className="text-2xl font-bold text-red-600">{getHighRiskLocations()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Veri Kaynağı</p>
                  <p className="text-sm text-gray-900">Gerçek Zamanlı</p>
                </div>
                <Info className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
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
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Travel Safety Map Hakkında
                </h3>
                <p className="text-gray-600 mb-4">
                  Bu uygulama, dünya genelindeki ülkeler ve şehirler için anlık güvenlik durumu, 
                  doğal afet uyarıları ve güncel haberleri gösterir. Risk skorları, çeşitli veri 
                  kaynaklarından toplanan bilgiler kullanılarak hesaplanır.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Veri Kaynakları:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Güvenlik raporları ve uyarıları</li>
                      <li>• Doğal afet verileri (USGS)</li>
                      <li>• Hava durumu uyarıları</li>
                      <li>• Haber sentiment analizi</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Özellikler:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Gerçek zamanlı risk skorları</li>
                      <li>• AI destekli 7 günlük tahmin</li>
                      <li>• Detaylı lokasyon analizi</li>
                      <li>• Mobil uyumlu tasarım</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

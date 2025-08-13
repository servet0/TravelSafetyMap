'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { RiskIndicator } from './RiskIndicator';
import { 
  MapPin, 
  AlertTriangle, 
  Cloud, 
  Globe, 
  Calendar,
  TrendingUp,
  Info,
  ArrowLeft
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  risk_score: number;
  type: 'country' | 'city';
}

interface LocationDetailProps {
  location: Location;
  onBack: () => void;
}

interface SecurityIncident {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  occurredAt: string;
}

interface NaturalDisaster {
  id: string;
  type: string;
  description: string;
  magnitude?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  occurredAt: string;
}

interface WeatherWarning {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  validUntil: string;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  url?: string;
  source: string;
  sentimentScore: number;
  publishedAt: string;
}

interface AIRiskPrediction {
  predictedScore: number;
  confidence: number;
  factors: string[];
  predictedForDate: string;
  reasoning: string;
}

export const LocationDetail: React.FC<LocationDetailProps> = ({
  location,
  onBack
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [securityIncidents, setSecurityIncidents] = useState<SecurityIncident[]>([]);
  const [naturalDisasters, setNaturalDisasters] = useState<NaturalDisaster[]>([]);
  const [weatherWarnings, setWeatherWarnings] = useState<WeatherWarning[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [aiPrediction, setAiPrediction] = useState<AIRiskPrediction | null>(null);
  const [isGeneratingPrediction, setIsGeneratingPrediction] = useState(false);

  useEffect(() => {
    loadLocationDetails();
  }, [location]);

  const loadLocationDetails = async () => {
    setIsLoading(true);
    
    try {
      // Mock veri yükleme simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock güvenlik olayları
      setSecurityIncidents([
        {
          id: '1',
          type: 'Protest',
          description: 'Merkezi bölgede barışçıl protesto gösterisi',
          severity: 'medium',
          source: 'Yerel Güvenlik',
          occurredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ]);

      // Mock doğal afetler
      setNaturalDisasters([
        {
          id: '1',
          type: 'Deprem',
          description: 'Hafif şiddetli deprem meydana geldi',
          magnitude: 4.2,
          severity: 'low',
          source: 'USGS',
          occurredAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ]);

      // Mock hava durumu uyarıları
      setWeatherWarnings([
        {
          id: '1',
          type: 'Fırtına',
          description: 'Güçlü rüzgar ve yağış bekleniyor',
          severity: 'medium',
          source: 'OpenWeatherMap',
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
      ]);

      // Mock haberler
      setNews([
        {
          id: '1',
          title: 'Ekonomik iyileşme sinyalleri',
          content: 'Bölgede ekonomik aktivitelerde artış gözlemleniyor...',
          url: 'https://example.com/news1',
          source: 'Yerel Haber',
          sentimentScore: 0.7,
          publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          title: 'Altyapı çalışmaları devam ediyor',
          content: 'Şehir merkezinde altyapı iyileştirme çalışmaları...',
          url: 'https://example.com/news2',
          source: 'Resmi Kaynak',
          sentimentScore: 0.5,
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        }
      ]);

    } catch (error) {
      console.error('Lokasyon detayları yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIPrediction = async () => {
    setIsGeneratingPrediction(true);
    
    try {
      // Mock AI tahmin simülasyonu
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockPrediction: AIRiskPrediction = {
        predictedScore: Math.min(100, location.risk_score + Math.floor(Math.random() * 20) - 10),
        confidence: 0.7 + Math.random() * 0.2,
        factors: ['Güvenlik olayları', 'Hava durumu uyarıları'],
        predictedForDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reasoning: `${location.name} için 7 günlük risk tahmini: Mevcut durumda orta seviye risk devam edecek. Hava durumu ve güvenlik faktörleri dikkatle takip edilmeli.`
      };
      
      setAiPrediction(mockPrediction);
    } catch (error) {
      console.error('AI tahmin oluşturulurken hata:', error);
    } finally {
      setIsGeneratingPrediction(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return 'Düşük';
      case 'medium': return 'Orta';
      case 'high': return 'Yüksek';
      case 'critical': return 'Kritik';
      default: return 'Bilinmiyor';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Detaylar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{location.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{location.type === 'country' ? 'Ülke' : 'Şehir'}</span>
              <span>•</span>
              <span>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
            </div>
          </div>
        </div>
        <RiskIndicator score={location.risk_score} />
      </div>

      {/* Risk Tahmini */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">7 Günlük Risk Tahmini</h2>
            </div>
            {!aiPrediction && (
              <Button
                variant="primary"
                size="sm"
                onClick={generateAIPrediction}
                disabled={isGeneratingPrediction}
              >
                {isGeneratingPrediction ? 'Tahmin Oluşturuluyor...' : 'AI Tahmin Oluştur'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {aiPrediction ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RiskIndicator score={aiPrediction.predictedScore} />
                  <div>
                    <p className="text-sm text-gray-600">Tahmin Edilen Risk</p>
                    <p className="font-semibold">{aiPrediction.predictedScore}/100</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Güven Oranı</p>
                  <p className="font-semibold">{(aiPrediction.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Tahmin Tarihi</p>
                <p className="text-sm text-gray-600">{aiPrediction.predictedForDate}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Ana Faktörler</p>
                <div className="flex flex-wrap gap-2">
                  {aiPrediction.factors.map((factor, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Analiz</p>
                <p className="text-sm text-gray-600">{aiPrediction.reasoning}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                AI destekli 7 günlük risk tahmini oluşturmak için butona tıklayın.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Güvenlik Olayları */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold">Güvenlik Olayları</h2>
            <span className="text-sm text-gray-500">({securityIncidents.length})</span>
          </div>
        </CardHeader>
        <CardContent>
          {securityIncidents.length > 0 ? (
            <div className="space-y-3">
              {securityIncidents.map((incident) => (
                <div key={incident.id} className="border-l-4 border-red-500 pl-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{incident.type}</h3>
                      <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Kaynak: {incident.source}</span>
                        <span>{formatDistanceToNow(new Date(incident.occurredAt), { addSuffix: true, locale: tr })}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(incident.severity)}`}>
                      {getSeverityText(incident.severity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">Güvenlik olayı bulunmuyor.</p>
          )}
        </CardContent>
      </Card>

      {/* Doğal Afetler */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold">Doğal Afetler</h2>
            <span className="text-sm text-gray-500">({naturalDisasters.length})</span>
          </div>
        </CardHeader>
        <CardContent>
          {naturalDisasters.length > 0 ? (
            <div className="space-y-3">
              {naturalDisasters.map((disaster) => (
                <div key={disaster.id} className="border-l-4 border-orange-500 pl-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{disaster.type}</h3>
                      <p className="text-sm text-gray-600 mt-1">{disaster.description}</p>
                      {disaster.magnitude && (
                        <p className="text-sm text-gray-500 mt-1">Büyüklük: {disaster.magnitude}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Kaynak: {disaster.source}</span>
                        <span>{formatDistanceToNow(new Date(disaster.occurredAt), { addSuffix: true, locale: tr })}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(disaster.severity)}`}>
                      {getSeverityText(disaster.severity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">Doğal afet bulunmuyor.</p>
          )}
        </CardContent>
      </Card>

      {/* Hava Durumu Uyarıları */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Hava Durumu Uyarıları</h2>
            <span className="text-sm text-gray-500">({weatherWarnings.length})</span>
          </div>
        </CardHeader>
        <CardContent>
          {weatherWarnings.length > 0 ? (
            <div className="space-y-3">
              {weatherWarnings.map((warning) => (
                <div key={warning.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{warning.type}</h3>
                      <p className="text-sm text-gray-600 mt-1">{warning.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Kaynak: {warning.source}</span>
                        <span>Geçerli: {formatDistanceToNow(new Date(warning.validUntil), { addSuffix: true, locale: tr })}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(warning.severity)}`}>
                      {getSeverityText(warning.severity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">Hava durumu uyarısı bulunmuyor.</p>
          )}
        </CardContent>
      </Card>

      {/* Haberler */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Son Haberler</h2>
            <span className="text-sm text-gray-500">({news.length})</span>
          </div>
        </CardHeader>
        <CardContent>
          {news.length > 0 ? (
            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{item.source}</span>
                        <span>{formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true, locale: tr })}</span>
                        <span className={`px-2 py-1 rounded-full ${
                          item.sentimentScore > 0.5 ? 'bg-green-100 text-green-800' : 
                          item.sentimentScore < 0.5 ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.sentimentScore > 0.5 ? 'Pozitif' : 
                           item.sentimentScore < 0.5 ? 'Negatif' : 'Nötr'}
                        </span>
                      </div>
                    </div>
                    {item.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(item.url, '_blank')}
                        className="ml-4"
                      >
                        Oku
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">Haber bulunmuyor.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


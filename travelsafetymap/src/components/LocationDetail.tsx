'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { RiskIndicator } from './RiskIndicator';
import { 
  MapPin, 
  AlertTriangle, 
  Newspaper, 
  Cloud, 
  Activity,
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface LocationDetailProps {
  locationId: string;
  locationType: 'country' | 'city';
  locationName: string;
  riskScore: number;
  onBack: () => void;
}

interface DetailData {
  incidents: any[];
  disasters: any[];
  weatherWarnings: any[];
  news: any[];
  aiPrediction?: any;
}

export const LocationDetail: React.FC<LocationDetailProps> = ({
  locationId,
  locationType,
  locationName,
  riskScore,
  onBack
}) => {
  const [data, setData] = useState<DetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    loadLocationDetails();
  }, [locationId, locationType]);

  const loadLocationDetails = async () => {
    setIsLoading(true);
    try {
      // Gerçek uygulamada DataService.getLocationDetails kullanılacak
      // Şimdilik mock veri kullanıyoruz
      const mockData: DetailData = {
        incidents: [
          {
            id: '1',
            incident_type: 'Güvenlik Uyarısı',
            description: 'Bölgede güvenlik olayları bildirildi',
            severity: 'medium',
            reported_at: new Date().toISOString(),
            source: 'Yerel Güvenlik'
          }
        ],
        disasters: [
          {
            id: '1',
            disaster_type: 'Deprem',
            description: '4.2 büyüklüğünde deprem kaydedildi',
            magnitude: 4.2,
            reported_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            source: 'USGS'
          }
        ],
        weatherWarnings: [
          {
            id: '1',
            warning_type: 'Fırtına Uyarısı',
            description: 'Güçlü rüzgar ve yağış bekleniyor',
            severity: 'high',
            valid_until: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            source: 'Meteoroloji'
          }
        ],
        news: [
          {
            id: '1',
            title: 'Bölgede güvenlik durumu',
            content: 'Yerel yetkililer güvenlik önlemlerini artırdı',
            url: '#',
            source: 'Yerel Haber',
            sentiment_score: -0.3,
            published_at: new Date().toISOString()
          }
        ],
        aiPrediction: {
          predicted_risk_score: 65,
          confidence: 0.78,
          factors: ['Güvenlik olayları', 'Hava durumu uyarıları'],
          recommendations: ['Dikkatli olun', 'Resmi kaynakları takip edin']
        }
      };
      
      setData(mockData);
    } catch (error) {
      console.error('Lokasyon detayları yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIPrediction = async () => {
    setIsGeneratingAI(true);
    try {
      // Gerçek uygulamada DataService.generateAIRiskPrediction kullanılacak
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay
      
      // Mock AI tahmini
      const mockPrediction = {
        predicted_risk_score: Math.floor(Math.random() * 40) + 30,
        confidence: 0.7 + Math.random() * 0.2,
        factors: ['Güncel güvenlik durumu', 'Hava koşulları'],
        recommendations: ['Dikkatli olun', 'Acil durum planınızı gözden geçirin']
      };
      
      setData(prev => prev ? {
        ...prev,
        aiPrediction: mockPrediction
      } : null);
    } catch (error) {
      console.error('AI tahmini oluşturulurken hata:', error);
    } finally {
      setIsGeneratingAI(false);
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

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-green-600';
    if (score < -0.3) return 'text-red-600';
    return 'text-yellow-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Detaylar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{locationName}</h1>
            <p className="text-gray-600 capitalize">{locationType}</p>
          </div>
        </div>
        <Button onClick={loadLocationDetails} variant="secondary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Yenile
        </Button>
      </div>

      {/* Risk Özeti */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Risk Durumu</h2>
            <RiskIndicator score={riskScore} size="lg" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Güvenlik Olayları</p>
              <p className="text-xl font-bold">{data?.incidents.length || 0}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Cloud className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Hava Uyarıları</p>
              <p className="text-xl font-bold">{data?.weatherWarnings.length || 0}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Activity className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Doğal Afetler</p>
              <p className="text-xl font-bold">{data?.disasters.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Risk Tahmini */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">AI Risk Tahmini (7 Gün)</h2>
            </div>
            <Button 
              onClick={generateAIPrediction} 
              disabled={isGeneratingAI}
              size="sm"
            >
              {isGeneratingAI ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Hesaplanıyor...
                </>
              ) : (
                'Yeni Tahmin'
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data?.aiPrediction ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tahmini Risk Skoru:</span>
                <RiskIndicator score={data.aiPrediction.predicted_risk_score} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Güven Oranı:</span>
                <span className="text-sm font-medium">
                  %{Math.round(data.aiPrediction.confidence * 100)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Risk Faktörleri:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {data.aiPrediction.factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Öneriler:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {data.aiPrediction.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              AI risk tahmini henüz oluşturulmadı.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Güvenlik Olayları */}
      {data?.incidents.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold">Son Güvenlik Olayları</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.incidents.map((incident) => (
                <div key={incident.id} className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{incident.incident_type}</h3>
                      <p className="text-sm text-gray-600">{incident.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(incident.reported_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hava Durumu Uyarıları */}
      {data?.weatherWarnings.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Hava Durumu Uyarıları</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.weatherWarnings.map((warning) => (
                <div key={warning.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{warning.warning_type}</h3>
                      <p className="text-sm text-gray-600">{warning.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Geçerli: {format(new Date(warning.valid_until), 'dd MMM yyyy HH:mm', { locale: tr })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(warning.severity)}`}>
                      {warning.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Haberler */}
      {data?.news.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold">Son Haberler</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.news.map((item) => (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{item.source}</span>
                        <span>{format(new Date(item.published_at), 'dd MMM yyyy', { locale: tr })}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(item.sentiment_score)}`}>
                      {item.sentiment_score > 0.3 ? 'Pozitif' : item.sentiment_score < -0.3 ? 'Negatif' : 'Nötr'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

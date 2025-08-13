import { supabase, Country, City, SecurityIncident, NaturalDisaster, WeatherWarning, NewsItem, AIRiskPrediction } from './supabase';
import { getWeatherWarnings, getEarthquakes, getNewsSentiment, getCountryCoordinates, getCityCoordinates } from './api';
import { calculateRiskScore } from '../components/RiskIndicator';
import { predictRiskWithAI, RiskFactors } from './ai';

// Mock veri - gerçek uygulamada API'lerden gelecek
const mockCountries: Partial<Country>[] = [
  { name: 'Türkiye', code: 'TR', latitude: 39.9334, longitude: 32.8597 },
  { name: 'Amerika Birleşik Devletleri', code: 'US', latitude: 37.0902, longitude: -95.7129 },
  { name: 'İngiltere', code: 'GB', latitude: 55.3781, longitude: -3.4360 },
  { name: 'Almanya', code: 'DE', latitude: 51.1657, longitude: 10.4515 },
  { name: 'Fransa', code: 'FR', latitude: 46.2276, longitude: 2.2137 },
];

const mockCities: Partial<City>[] = [
  { name: 'İstanbul', country_id: 'TR', latitude: 41.0082, longitude: 28.9784 },
  { name: 'Ankara', country_id: 'TR', latitude: 39.9334, longitude: 32.8597 },
  { name: 'İzmir', country_id: 'TR', latitude: 38.4192, longitude: 27.1287 },
  { name: 'New York', country_id: 'US', latitude: 40.7128, longitude: -74.0060 },
  { name: 'London', country_id: 'GB', latitude: 51.5074, longitude: -0.1278 },
];

// Veri toplama ve işleme
export class DataService {
  // Ülke verilerini güncelle
  static async updateCountryData() {
    try {
      for (const country of mockCountries) {
        const [lat, lon] = getCountryCoordinates(country.code!);
        
        // API'lerden veri çek
        const weatherWarnings = await getWeatherWarnings(lat, lon);
        const earthquakes = await getEarthquakes(lat, lon);
        const newsData = await getNewsSentiment(country.name!);
        
        // Risk skoru hesapla
        const riskScore = calculateRiskScore(
          Math.floor(Math.random() * 5), // Mock güvenlik olayları
          earthquakes.length,
          weatherWarnings.length,
          newsData.sentiment
        );
        
        // Veritabanına kaydet/güncelle
        const { error } = await supabase
          .from('countries')
          .upsert({
            name: country.name,
            code: country.code,
            latitude: lat,
            longitude: lon,
            risk_score: riskScore,
            last_updated: new Date().toISOString()
          });
        
        if (error) {
          console.error(`${country.name} güncellenirken hata:`, error);
        }
      }
    } catch (error) {
      console.error('Ülke verileri güncellenirken hata:', error);
    }
  }
  
  // Şehir verilerini güncelle
  static async updateCityData() {
    try {
      for (const city of mockCities) {
        const [lat, lon] = getCityCoordinates(city.name!);
        
        // API'lerden veri çek
        const weatherWarnings = await getWeatherWarnings(lat, lon);
        const earthquakes = await getEarthquakes(lat, lon);
        const newsData = await getNewsSentiment(city.name!);
        
        // Risk skoru hesapla
        const riskScore = calculateRiskScore(
          Math.floor(Math.random() * 3), // Mock güvenlik olayları
          earthquakes.length,
          weatherWarnings.length,
          newsData.sentiment
        );
        
        // Veritabanına kaydet/güncelle
        const { error } = await supabase
          .from('cities')
          .upsert({
            name: city.name,
            country_id: city.country_id,
            latitude: lat,
            longitude: lon,
            risk_score: riskScore,
            last_updated: new Date().toISOString()
          });
        
        if (error) {
          console.error(`${city.name} güncellenirken hata:`, error);
        }
      }
    } catch (error) {
      console.error('Şehir verileri güncellenirken hata:', error);
    }
  }
  
  // Tüm ülkeleri getir
  static async getCountries(): Promise<Country[]> {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Ülkeler getirilirken hata:', error);
      return [];
    }
  }
  
  // Tüm şehirleri getir
  static async getCities(): Promise<City[]> {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Şehirler getirilirken hata:', error);
      return [];
    }
  }
  
  // Belirli bir lokasyonun detaylarını getir
  static async getLocationDetails(locationId: string, locationType: 'country' | 'city') {
    try {
      const table = locationType === 'country' ? 'countries' : 'cities';
      
      // Lokasyon bilgisi
      const { data: location, error: locationError } = await supabase
        .from(table)
        .select('*')
        .eq('id', locationId)
        .single();
      
      if (locationError) throw locationError;
      
      // Son güvenlik olayları
      const { data: incidents } = await supabase
        .from('security_incidents')
        .select('*')
        .eq('location_id', locationId)
        .eq('location_type', locationType)
        .gte('reported_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('reported_at', { ascending: false });
      
      // Son doğal afetler
      const { data: disasters } = await supabase
        .from('natural_disasters')
        .select('*')
        .eq('location_id', locationId)
        .eq('location_type', locationType)
        .gte('reported_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('reported_at', { ascending: false });
      
      // Hava durumu uyarıları
      const { data: weatherWarnings } = await supabase
        .from('weather_warnings')
        .select('*')
        .eq('location_id', locationId)
        .eq('location_type', locationType)
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false });
      
      // Son haberler
      const { data: news } = await supabase
        .from('news')
        .select('*')
        .eq('location_id', locationId)
        .eq('location_type', locationType)
        .gte('published_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('published_at', { ascending: false });
      
      // AI risk tahmini
      const { data: aiPrediction } = await supabase
        .from('ai_risk_predictions')
        .select('*')
        .eq('location_id', locationId)
        .eq('location_type', locationType)
        .gte('predicted_for_date', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      return {
        location,
        incidents: incidents || [],
        disasters: disasters || [],
        weatherWarnings: weatherWarnings || [],
        news: news || [],
        aiPrediction
      };
    } catch (error) {
      console.error('Lokasyon detayları getirilirken hata:', error);
      return null;
    }
  }
  
  // AI risk tahmini oluştur ve kaydet
  static async generateAIRiskPrediction(locationId: string, locationType: 'country' | 'city', locationName: string) {
    try {
      // Son verileri topla
      const details = await this.getLocationDetails(locationId, locationType);
      if (!details) return null;
      
      const factors: RiskFactors = {
        securityIncidents: details.incidents.length,
        naturalDisasters: details.disasters.length,
        weatherWarnings: details.weatherWarnings.length,
        newsSentiment: details.news.reduce((acc, item) => acc + item.sentiment_score, 0) / Math.max(details.news.length, 1),
        recentEvents: [
          ...details.incidents.map(i => i.description),
          ...details.disasters.map(d => d.description),
          ...details.weatherWarnings.map(w => w.description)
        ]
      };
      
      // AI tahmini yap
      const prediction = await predictRiskWithAI(locationName, factors);
      
      // Veritabanına kaydet
      const { error } = await supabase
        .from('ai_risk_predictions')
        .insert({
          location_id: locationId,
          location_type: locationType,
          predicted_risk_score: prediction.predictedScore,
          confidence: prediction.confidence,
          factors: prediction.factors,
          predicted_for_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      
      if (error) {
        console.error('AI tahmini kaydedilirken hata:', error);
      }
      
      return prediction;
    } catch (error) {
      console.error('AI risk tahmini oluşturulurken hata:', error);
      return null;
    }
  }
  
  // Tüm verileri güncelle (cron job için)
  static async updateAllData() {
    console.log('Veri güncelleme başladı:', new Date().toISOString());
    
    await this.updateCountryData();
    await this.updateCityData();
    
    console.log('Veri güncelleme tamamlandı:', new Date().toISOString());
  }
}

import axios from 'axios';

// OpenWeatherMap API
export const getWeatherWarnings = async (lat: number, lon: number) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    
    const warnings = [];
    const weather = response.data;
    
    // Fırtına uyarısı
    if (weather.wind?.speed > 10) {
      warnings.push({
        type: 'storm',
        description: `Güçlü rüzgar: ${weather.wind.speed} m/s`,
        severity: weather.wind.speed > 15 ? 'high' : 'medium'
      });
    }
    
    // Yağış uyarısı
    if (weather.rain || weather.snow) {
      warnings.push({
        type: 'precipitation',
        description: 'Yoğun yağış bekleniyor',
        severity: 'medium'
      });
    }
    
    return warnings;
  } catch (error) {
    console.error('Hava durumu verisi alınamadı:', error);
    return [];
  }
};

// USGS Earthquake API
export const getEarthquakes = async (lat: number, lon: number, radius: number = 100) => {
  try {
    const response = await axios.get(
      `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`
    );
    
    const earthquakes = response.data.features.filter((quake: any) => {
      const quakeLat = quake.geometry.coordinates[1];
      const quakeLon = quake.geometry.coordinates[0];
      const distance = getDistance(lat, lon, quakeLat, quakeLon);
      return distance <= radius && quake.properties.mag >= 4.0;
    });
    
    return earthquakes.map((quake: any) => ({
      type: 'earthquake',
      description: `${quake.properties.mag} büyüklüğünde deprem`,
      magnitude: quake.properties.mag,
      severity: quake.properties.mag >= 6.0 ? 'critical' : quake.properties.mag >= 5.0 ? 'high' : 'medium'
    }));
  } catch (error) {
    console.error('Deprem verisi alınamadı:', error);
    return [];
  }
};

// GDELT API - Basit haber analizi
export const getNewsSentiment = async (location: string) => {
  try {
    // GDELT API yerine basit bir mock veri döndürüyoruz
    // Gerçek uygulamada GDELT API kullanılacak
    const mockSentiment = Math.random() * 2 - 1; // -1 ile 1 arası
    return {
      sentiment: mockSentiment,
      newsCount: Math.floor(Math.random() * 10) + 1
    };
  } catch (error) {
    console.error('Haber sentiment verisi alınamadı:', error);
    return { sentiment: 0, newsCount: 0 };
  }
};

// Coğrafi mesafe hesaplama (Haversine formülü)
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Dünya'nın yarıçapı (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Ülke kodundan koordinat alma (basit mock veri)
export const getCountryCoordinates = (countryCode: string) => {
  const coordinates: { [key: string]: [number, number] } = {
    'TR': [39.9334, 32.8597], // Türkiye
    'US': [37.0902, -95.7129], // ABD
    'GB': [55.3781, -3.4360], // İngiltere
    'DE': [51.1657, 10.4515], // Almanya
    'FR': [46.2276, 2.2137], // Fransa
    'IT': [41.8719, 12.5674], // İtalya
    'ES': [40.4637, -3.7492], // İspanya
    'RU': [61.5240, 105.3188], // Rusya
    'CN': [35.8617, 104.1954], // Çin
    'JP': [36.2048, 138.2529], // Japonya
  };
  
  return coordinates[countryCode] || [0, 0];
};

// Şehir koordinatları (basit mock veri)
export const getCityCoordinates = (cityName: string) => {
  const cities: { [key: string]: [number, number] } = {
    'Istanbul': [41.0082, 28.9784],
    'Ankara': [39.9334, 32.8597],
    'Izmir': [38.4192, 27.1287],
    'New York': [40.7128, -74.0060],
    'London': [51.5074, -0.1278],
    'Paris': [48.8566, 2.3522],
    'Berlin': [52.5200, 13.4050],
    'Rome': [41.9028, 12.4964],
    'Madrid': [40.4168, -3.7038],
    'Moscow': [55.7558, 37.6176],
  };
  
  return cities[cityName] || [0, 0];
};

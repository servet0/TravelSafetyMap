# Travel Safety Map 🌍

Dünya genelindeki ülkeler ve şehirler için anlık güvenlik durumu, doğal afet uyarıları ve güncel haberleri gösteren, sürekli güncellenen harita tabanlı web uygulaması.

## 🚀 Özellikler

- **Gerçek Zamanlı Harita**: Mapbox GL JS ile interaktif dünya haritası
- **Risk Skorları**: 0-100 arası risk seviyesi göstergesi
- **AI Risk Tahmini**: OpenAI GPT-4o-mini ile 7 günlük risk tahmini
- **Çoklu Veri Kaynağı**: Güvenlik, hava durumu, doğal afet ve haber verileri
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Dark/Light Theme**: Kullanıcı dostu arayüz
- **Detaylı Analiz**: Lokasyon bazlı detaylı güvenlik raporları

## 🛠️ Teknolojiler

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Harita**: Mapbox GL JS
- **Veritabanı**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini
- **API'ler**: OpenWeatherMap, USGS, GDELT
- **Deployment**: Vercel

## 📦 Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Supabase hesabı
- Mapbox hesabı
- OpenAI API anahtarı

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd TravelSafetyMap
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment değişkenlerini ayarlayın**
`.env.local` dosyası oluşturun:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# API Keys
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here
NEXT_PUBLIC_GDELT_API_KEY=your_gdelt_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Supabase veritabanını kurun**
```sql
-- Ülkeler tablosu
CREATE TABLE countries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR(3) NOT NULL UNIQUE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  risk_score INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Şehirler tablosu
CREATE TABLE cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  country_id VARCHAR(3) REFERENCES countries(code),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  risk_score INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Güvenlik olayları tablosu
CREATE TABLE security_incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL,
  location_type VARCHAR(10) NOT NULL CHECK (location_type IN ('country', 'city')),
  incident_type VARCHAR NOT NULL,
  description TEXT,
  severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source VARCHAR NOT NULL,
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doğal afetler tablosu
CREATE TABLE natural_disasters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL,
  location_type VARCHAR(10) NOT NULL CHECK (location_type IN ('country', 'city')),
  disaster_type VARCHAR NOT NULL,
  description TEXT,
  magnitude DECIMAL(3,1),
  source VARCHAR NOT NULL,
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hava durumu uyarıları tablosu
CREATE TABLE weather_warnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL,
  location_type VARCHAR(10) NOT NULL CHECK (location_type IN ('country', 'city')),
  warning_type VARCHAR NOT NULL,
  description TEXT,
  severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source VARCHAR NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Haberler tablosu
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL,
  location_type VARCHAR(10) NOT NULL CHECK (location_type IN ('country', 'city')),
  title VARCHAR NOT NULL,
  content TEXT,
  url VARCHAR,
  source VARCHAR NOT NULL,
  sentiment_score DECIMAL(3,2) DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI risk tahminleri tablosu
CREATE TABLE ai_risk_predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL,
  location_type VARCHAR(10) NOT NULL CHECK (location_type IN ('country', 'city')),
  predicted_risk_score INTEGER NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  factors TEXT[],
  predicted_for_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

5. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

6. **Tarayıcıda açın**
```
http://localhost:3000
```

## 🔧 API Kullanımı

### Lokasyonları Getir
```bash
GET /api/locations?type=country
GET /api/locations?type=city
GET /api/locations
```

### Lokasyon Detayları
```bash
GET /api/locations/{id}?type=country
GET /api/locations/{id}?type=city
```

### AI Risk Tahmini
```bash
POST /api/locations/{id}?type=country
{
  "action": "generate-ai-prediction",
  "locationName": "Türkiye"
}
```

## 📊 Veri Kaynakları

- **Güvenlik**: US State Department, EU Security Alerts
- **Doğal Afetler**: USGS Earthquake API
- **Hava Durumu**: OpenWeatherMap API
- **Haberler**: GDELT API
- **AI Tahmin**: OpenAI GPT-4o-mini

## 🎨 UI Bileşenleri

- `SafetyMap`: Ana harita bileşeni
- `LocationDetail`: Lokasyon detay sayfası
- `RiskIndicator`: Risk seviyesi göstergesi
- `Button`, `Card`: UI bileşenleri

## 🔄 Veri Güncelleme

Veriler her 10-15 dakikada bir otomatik olarak güncellenir. Manuel güncelleme için:

```bash
POST /api/locations
{
  "action": "update"
}
```

## 🚀 Deployment

### Vercel'e Deploy

1. Vercel hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. Environment değişkenlerini ayarlayın
4. Deploy edin

### Environment Değişkenleri (Vercel)

Vercel dashboard'da aşağıdaki environment değişkenlerini ayarlayın:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_OPENWEATHER_API_KEY`
- `NEXT_PUBLIC_GDELT_API_KEY`

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- Proje Linki: [https://github.com/username/travel-safety-map](https://github.com/username/travel-safety-map)
- Sorular için: [issues](https://github.com/username/travel-safety-map/issues)

## 🙏 Teşekkürler

- [Mapbox](https://www.mapbox.com/) - Harita servisleri
- [Supabase](https://supabase.com/) - Veritabanı
- [OpenAI](https://openai.com/) - AI servisleri
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

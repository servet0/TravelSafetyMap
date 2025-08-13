import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface RiskFactors {
  securityIncidents: number;
  naturalDisasters: number;
  weatherWarnings: number;
  newsSentiment: number;
  recentEvents: string[];
}

export interface AIRiskPrediction {
  predictedScore: number;
  confidence: number;
  factors: string[];
  recommendations: string[];
}

export const predictRiskWithAI = async (
  location: string,
  factors: RiskFactors
): Promise<AIRiskPrediction> => {
  try {
    const prompt = `
Aşağıdaki verileri analiz ederek ${location} için 7 günlük güvenlik risk tahmini yap:

Güvenlik Olayları: ${factors.securityIncidents} adet
Doğal Afetler: ${factors.naturalDisasters} adet  
Hava Durumu Uyarıları: ${factors.weatherWarnings} adet
Haber Sentiment Skoru: ${factors.newsSentiment} (-1 ile 1 arası)
Son Olaylar: ${factors.recentEvents.join(', ')}

Lütfen şu formatta yanıt ver:
{
  "predictedScore": 0-100 arası risk skoru,
  "confidence": 0-1 arası güven oranı,
  "factors": ["risk faktörü 1", "risk faktörü 2"],
  "recommendations": ["öneri 1", "öneri 2"]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Sen bir güvenlik analisti olarak çalışıyorsun. Verilen verileri analiz ederek risk tahmini yapıyorsun."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('AI yanıtı alınamadı');
    }

    // JSON parse etmeye çalış
    try {
      const parsed = JSON.parse(response);
      return {
        predictedScore: Math.min(Math.max(parsed.predictedScore, 0), 100),
        confidence: Math.min(Math.max(parsed.confidence, 0), 1),
        factors: parsed.factors || [],
        recommendations: parsed.recommendations || []
      };
    } catch (parseError) {
      // JSON parse edilemezse basit bir tahmin yap
      console.warn('AI yanıtı JSON olarak parse edilemedi, basit tahmin kullanılıyor');
      return generateSimplePrediction(factors);
    }

  } catch (error) {
    console.error('AI risk tahmini hatası:', error);
    // Hata durumunda basit tahmin döndür
    return generateSimplePrediction(factors);
  }
};

// Basit risk tahmini (AI çalışmadığında)
const generateSimplePrediction = (factors: RiskFactors): AIRiskPrediction => {
  const baseScore = 
    factors.securityIncidents * 15 +
    factors.naturalDisasters * 20 +
    factors.weatherWarnings * 10 +
    ((1 - factors.newsSentiment) / 2) * 25;

  const predictedScore = Math.min(Math.max(baseScore, 0), 100);
  
  return {
    predictedScore: Math.round(predictedScore),
    confidence: 0.6,
    factors: [
      factors.securityIncidents > 0 ? 'Güvenlik olayları mevcut' : '',
      factors.naturalDisasters > 0 ? 'Doğal afet riski var' : '',
      factors.weatherWarnings > 0 ? 'Hava durumu uyarıları aktif' : '',
      factors.newsSentiment < 0 ? 'Negatif haber sentimenti' : ''
    ].filter(Boolean),
    recommendations: [
      'Yerel güvenlik durumunu takip edin',
      'Acil durum planınızı gözden geçirin',
      'Resmi kaynaklardan bilgi alın'
    ]
  };
};

// Batch tahmin işlemi (birden fazla lokasyon için)
export const predictMultipleLocations = async (
  locations: Array<{ name: string; factors: RiskFactors }>
): Promise<Array<{ location: string; prediction: AIRiskPrediction }>> => {
  const predictions = [];
  
  for (const location of locations) {
    try {
      const prediction = await predictRiskWithAI(location.name, location.factors);
      predictions.push({
        location: location.name,
        prediction
      });
    } catch (error) {
      console.error(`${location.name} için tahmin hatası:`, error);
      // Hata durumunda basit tahmin ekle
      predictions.push({
        location: location.name,
        prediction: generateSimplePrediction(location.factors)
      });
    }
  }
  
  return predictions;
};

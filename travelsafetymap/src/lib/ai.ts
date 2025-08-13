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
  predictedForDate: string;
  reasoning: string;
}

// Basit risk tahmin algoritması (OpenAI yerine)
export const predictRiskWithAI = async (
  location: string, 
  factors: RiskFactors
): Promise<AIRiskPrediction> => {
  try {
    // Risk faktörlerini ağırlıklı olarak hesapla
    const baseScore = factors.securityIncidents * 0.4 + 
                     factors.naturalDisasters * 0.3 + 
                     factors.weatherWarnings * 0.2 + 
                     (1 - factors.newsSentiment) * 0.1;
    
    // Son olayları analiz et
    const eventImpact = factors.recentEvents.length * 5;
    
    // Toplam skor hesapla (0-100 arası)
    const predictedScore = Math.min(100, Math.max(0, baseScore + eventImpact));
    
    // Güven skoru hesapla
    const confidence = Math.max(0.3, Math.min(0.9, 
      0.5 + (factors.recentEvents.length * 0.1) + (factors.securityIncidents * 0.05)
    ));
    
    // Faktörleri belirle
    const factorList = [];
    if (factors.securityIncidents > 0) factorList.push('Güvenlik olayları');
    if (factors.naturalDisasters > 0) factorList.push('Doğal afetler');
    if (factors.weatherWarnings > 0) factorList.push('Hava durumu uyarıları');
    if (factors.newsSentiment < 0.5) factorList.push('Negatif haber tonu');
    
    // Akıl yürütme metni oluştur
    let reasoning = `${location} için risk tahmini: `;
    if (predictedScore <= 30) {
      reasoning += 'Genel olarak güvenli durum. ';
    } else if (predictedScore <= 60) {
      reasoning += 'Orta seviye risk mevcut. ';
    } else {
      reasoning += 'Yüksek risk seviyesi tespit edildi. ';
    }
    
    if (factorList.length > 0) {
      reasoning += `Ana faktörler: ${factorList.join(', ')}.`;
    }
    
    return {
      predictedScore: Math.round(predictedScore),
      confidence: Math.round(confidence * 100) / 100,
      factors: factorList,
      predictedForDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reasoning
    };
    
  } catch (error) {
    console.error('Risk tahmini yapılırken hata:', error);
    
    // Hata durumunda basit tahmin
    return generateSimplePrediction(location, factors);
  }
};

// Basit tahmin (fallback)
const generateSimplePrediction = (
  location: string, 
  factors: RiskFactors
): AIRiskPrediction => {
  const baseScore = 30 + (factors.securityIncidents * 10) + (factors.naturalDisasters * 8);
  const predictedScore = Math.min(100, Math.max(0, baseScore));
  
  return {
    predictedScore: Math.round(predictedScore),
    confidence: 0.5,
    factors: ['Temel risk analizi'],
    predictedForDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reasoning: `${location} için temel risk değerlendirmesi yapıldı.`
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
        prediction: generateSimplePrediction(location.name, location.factors)
      });
    }
  }
  
  return predictions;
};

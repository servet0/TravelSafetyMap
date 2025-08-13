import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '../../../../lib/dataService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'country' | 'city';
    
    if (!type || !['country', 'city'].includes(type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geçersiz lokasyon tipi' 
        },
        { status: 400 }
      );
    }
    
    const details = await DataService.getLocationDetails(params.id, type);
    
    if (!details) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Lokasyon bulunamadı' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: details
    });
    
  } catch (error) {
    console.error('Lokasyon detayları getirilirken hata:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Lokasyon detayları alınamadı' 
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'country' | 'city';
    const body = await request.json();
    const { action, locationName } = body;
    
    if (action === 'generate-ai-prediction') {
      if (!locationName) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Lokasyon adı gerekli' 
          },
          { status: 400 }
        );
      }
      
      const prediction = await DataService.generateAIRiskPrediction(
        params.id, 
        type, 
        locationName
      );
      
      if (!prediction) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'AI tahmini oluşturulamadı' 
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: prediction
      });
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Geçersiz işlem' 
      },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('AI tahmini oluşturulurken hata:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'İşlem başarısız' 
      },
      { status: 500 }
    );
  }
}

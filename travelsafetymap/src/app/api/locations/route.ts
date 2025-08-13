import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '../../../lib/dataService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'country' veya 'city'
    
    let locations = [];
    
    if (type === 'country') {
      locations = await DataService.getCountries();
    } else if (type === 'city') {
      locations = await DataService.getCities();
    } else {
      // Tüm lokasyonları getir
      const countries = await DataService.getCountries();
      const cities = await DataService.getCities();
      locations = [...countries, ...cities];
    }
    
    return NextResponse.json({
      success: true,
      data: locations,
      count: locations.length
    });
    
  } catch (error) {
    console.error('Lokasyon verileri getirilirken hata:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Lokasyon verileri alınamadı' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'update') {
      // Veri güncelleme işlemi
      await DataService.updateAllData();
      
      return NextResponse.json({
        success: true,
        message: 'Veriler başarıyla güncellendi'
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
    console.error('Veri güncelleme hatası:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Veri güncellenemedi' 
      },
      { status: 500 }
    );
  }
}

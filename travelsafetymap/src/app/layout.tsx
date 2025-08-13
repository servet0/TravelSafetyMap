import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel Safety Map - Dünya Geneli Güvenlik Durumu",
  description: "Dünya genelindeki ülkeler ve şehirler için anlık güvenlik durumu, doğal afet uyarıları ve güncel haberleri gösteren harita tabanlı uygulama.",
  keywords: "güvenlik, seyahat, harita, risk analizi, doğal afet, haber",
  authors: [{ name: "Travel Safety Map Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

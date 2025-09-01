export interface CarouselItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
}

export const carouselItems: CarouselItem[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop&crop=center',
    title: 'Promo Spesial Mobile Legends',
    subtitle: 'Dapatkan bonus diamond hingga 20% untuk semua pembelian!'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop&crop=center',
    title: 'Event Free Fire Terbaru',
    subtitle: 'Top up sekarang dan menangkan skin eksklusif gratis!'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=1200&h=600&fit=crop&crop=center',
    title: 'PUBG Mobile Season Baru',
    subtitle: 'Siap-siap untuk battle royale dengan fitur terbaru!'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop&crop=center',
    title: 'Genshin Impact Update',
    subtitle: 'Jelajahi dunia baru dengan karakter dan quest terbaru!'
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&h=600&fit=crop&crop=center',
    title: 'Cashback 15% Semua Game',
    subtitle: 'Berlaku untuk semua transaksi di atas Rp 50.000!'
  }
];
export type Category = 'buket' | 'saksi' | 'ozel-gun' | 'kuru-cicek';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  images: string[];
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'pastel-ruyasi-buket',
    name: 'Pastel Rüyası',
    category: 'buket',
    price: 850,
    description: 'Pastel tonlarda elde hazırlanmış, zarif ve romantik bir el yapımı buket. Solmadan uzun süre ilk günkü görünümünü korur.',
    images: ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop'],
    inStock: true,
  },
  {
    id: '2',
    slug: 'gullu-kutu-ozel',
    name: 'Sonsuz Aşk Kutusu',
    category: 'ozel-gun',
    price: 1200,
    description: 'Özel kadife kutusunda, el işçiligiyle tek tek şekillendirilmiş güller. Yıldönümü ve sevgililer günü için kalıcı bir hatıra.',
    images: ['https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=800&auto=format&fit=crop'],
    inStock: true,
  },
  {
    id: '3',
    slug: 'papatya-nese',
    name: 'Neşe Kaynağı Papatyalar',
    category: 'buket',
    price: 450,
    description: 'Gününüzü aydınlatacak, özenle kesilip boyanmış papatyalar. Doğal dokularla tamamlanan sımsıcak bir el yapımı aranjman.',
    images: ['https://images.unsplash.com/photo-1533615104646-c22822aef0fb?q=80&w=800&auto=format&fit=crop'],
    inStock: true,
  },
  {
    id: '4',
    slug: 'dekoratif-kuru-cicekler',
    name: 'Bohem Kuru Çiçek Aranjmanı',
    category: 'kuru-cicek',
    price: 650,
    description: 'Pampas ve botanik dokulardan ilham alan, bohem çizgide tasarlanmış el yapımı aranjman. Dekoratif ve uzun ömürlü hediye seçeneği.',
    images: ['https://images.unsplash.com/photo-1537204561081-30006323cace?q=80&w=800&auto=format&fit=crop'],
    inStock: true,
  },
  {
    id: '5',
    slug: 'mini-succulent-bahcesi',
    name: 'Sukkulent ve Kaktüs Bahçesi',
    category: 'saksi',
    price: 550,
    description: 'Özel tasarım saksı içinde hazırlanmış mini sukkulent ve kaktüs kompozisyonu. Bakım istemeyen sevimli masa arkadaşı.',
    images: ['https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop'],
    inStock: true,
  },
  {
    id: '6',
    slug: 'beyaz-orkide',
    name: 'Zarif Çift Dallı Orkide',
    category: 'saksi',
    price: 950,
    description: 'Seramik saksıda, el boyaması detaylarla hazırlanmış çift dallı orkide tasarımı. Zarafetin kalıcı ve modern yorumu.',
    images: ['https://images.unsplash.com/photo-1582236166164-1da2cefc56a9?q=80&w=800&auto=format&fit=crop'],
    inStock: true,
  }
];

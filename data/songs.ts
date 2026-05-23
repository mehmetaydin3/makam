export type Song = {
  title: string;
  artist: string;
  makamId: string;
  genre: 'classical' | 'folk' | 'arabesk' | 'rock' | 'pop' | 'sufi';
};

export const SONGS: Song[] = [
  // Classical
  { title: 'Gamzedeyim Deva Bulmam', artist: 'Tatyos Efendi', makamId: 'ussak', genre: 'classical' },
  { title: 'Yine Bir Gulnihal', artist: 'Dede Efendi', makamId: 'rast', genre: 'classical' },
  { title: 'Senede Bir Gun', artist: 'Zeki Muren', makamId: 'hicaz', genre: 'classical' },
  { title: 'Aksam Oldu Huzunlendim', artist: 'Muzeyyen Senar', makamId: 'huseyni', genre: 'classical' },
  { title: 'Ben Seni Unutmak Icin Sevmedim', artist: 'Nesrin Sipahi', makamId: 'saba', genre: 'classical' },
  { title: 'Donulmez Aksamın Ufkundayiz', artist: 'Bulent Ersoy', makamId: 'segah', genre: 'classical' },
  { title: 'Bulbulum Altin Kafeste', artist: 'Melihat Gulses', makamId: 'kurd', genre: 'classical' },
  { title: 'Nereden Sevdim O Zalim Kadini', artist: 'Zeki Muren', makamId: 'neva', genre: 'classical' },
  { title: 'Kalamis', artist: 'Mustafa Sagyasar', makamId: 'nihavend', genre: 'classical' },
  { title: 'Bana Bir Ask Masalindan Sarkilar Soyle', artist: 'Zeki Muren', makamId: 'buselik', genre: 'classical' },

  // Folk / Türkü
  { title: 'Uzun Ince Bir Yoldayim', artist: 'Asik Veysel', makamId: 'ussak', genre: 'folk' },
  { title: 'Sari Gelin', artist: 'Traditional', makamId: 'segah', genre: 'folk' },
  { title: 'Kara Toprak', artist: 'Asik Veysel', makamId: 'ussak', genre: 'folk' },
  { title: 'Katibim', artist: 'Traditional', makamId: 'ussak', genre: 'folk' },
  { title: 'Hicaz Turku', artist: 'Traditional', makamId: 'hicaz', genre: 'folk' },
  { title: 'Seyreyle Dunyayi', artist: 'Asik Mahzuni', makamId: 'kurd', genre: 'folk' },
  { title: 'Oy Benim Sarı Yıldızım', artist: 'Traditional', makamId: 'rast', genre: 'folk' },
  { title: 'Misket', artist: 'Traditional', makamId: 'nihavend', genre: 'folk' },
  { title: 'Zeybek', artist: 'Traditional', makamId: 'huseyni', genre: 'folk' },
  { title: 'Ela Gozlum', artist: 'Traditional', makamId: 'ussak', genre: 'folk' },

  // Arabesk
  { title: 'Bana Kendini Anlat', artist: 'Ibrahim Tatlises', makamId: 'hicaz', genre: 'arabesk' },
  { title: 'Sarki Soylemek Lazim', artist: 'Orhan Gencebay', makamId: 'ussak', genre: 'arabesk' },
  { title: 'Bir Teselli Ver', artist: 'Orhan Gencebay', makamId: 'nihavend', genre: 'arabesk' },
  { title: 'Yalnizlar Rihtimi', artist: 'Ferdi Tayfur', makamId: 'hicaz', genre: 'arabesk' },
  { title: 'Mutluluk', artist: 'Bulent Ersoy', makamId: 'segah', genre: 'arabesk' },
  { title: 'Ne Olacak Halimiz', artist: 'Ibrahim Tatlises', makamId: 'kurdilihicazkar', genre: 'arabesk' },
  { title: 'Gozlerim Yasli', artist: 'Muazzez Abaci', makamId: 'ussak', genre: 'arabesk' },

  // Psychedelic Turkish Rock
  { title: 'Resimdeki Gozyaslari', artist: 'Cem Karaca', makamId: 'huseyni', genre: 'rock' },
  { title: 'Nem Kaldi', artist: 'Cem Karaca', makamId: 'ussak', genre: 'rock' },
  { title: 'Tamirci Cusku', artist: 'Mogollar', makamId: 'hicaz', genre: 'rock' },
  { title: 'Bir Bahar Aksami', artist: 'Erkin Koray', makamId: 'nihavend', genre: 'rock' },
  { title: 'Ela Ela', artist: 'Erkin Koray', makamId: 'ussak', genre: 'rock' },
  { title: 'Cemalim', artist: 'Cem Karaca & Mogollar', makamId: 'kurd', genre: 'rock' },
  { title: 'Aglasam mi Gulesem mi', artist: 'Cem Karaca', makamId: 'hicaz', genre: 'rock' },
  { title: 'Peri Bacalari', artist: 'Mogollar', makamId: 'rast', genre: 'rock' },
  { title: 'Sevince', artist: 'Erkin Koray', makamId: 'hicaz', genre: 'rock' },
  { title: 'Sucu Yok', artist: 'Cem Karaca', makamId: 'saba', genre: 'rock' },

  // Sufi
  { title: 'Mevlana Sema', artist: 'Traditional', makamId: 'segah', genre: 'sufi' },
  { title: 'Hicaz Ilahi', artist: 'Traditional', makamId: 'hicaz', genre: 'sufi' },
  { title: 'Ussak Ilahi', artist: 'Traditional', makamId: 'ussak', genre: 'sufi' },
  { title: 'Rast Naat', artist: 'Traditional', makamId: 'rast', genre: 'sufi' },
];

export function getSongsByMakam(makamId: string): Song[] {
  return SONGS.filter(s => s.makamId === makamId);
}

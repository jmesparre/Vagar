export type Property = {
  id: string;
  title: string;
  category: string;
  images: string[];
  guests: number;
  bedrooms: number;
  beds: number;
  rating: number;
  price: {
    high: number;
    mid: number;
    low: number;
  };
  featured: boolean;
  amenities: string[];
};

export type Experience = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  images: string[];
  category: 'Zona deportiva y social' | 'Turismo' | 'Zona de naturaleza';
  whatYouShouldKnow: string[];
};

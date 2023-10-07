export interface Page {
  title: string;
  templateId: string;
}

export interface Card {
  id: string;
  title: string;
  sizes: string[];
  basePrice: number;
  pages: Page[];
}

export interface ResultCard {
  title: string;
  imageUrl: string;
  url: string;
}

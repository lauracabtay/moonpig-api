export interface Template {
  id: string;
  width: number;
  height: number;
  imageUrl: string;
}

export interface Size {
  id: string;
  title: string;
  priceMultiplier: number;
}

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

export interface CardPage {
  title: string;
  width: number;
  height: number;
  imageUrl: string;
}

export interface AllCards {
  title: string;
  imageUrl: string;
  url: string;
}

export interface AvailableSizes {
  id: string;
  title: string;
}

export interface SingleCard {
  title: string;
  size: string | undefined;
  availableSizes: AvailableSizes[];
  imageUrl: string;
  price: string | undefined;
  pages: CardPage[];
}
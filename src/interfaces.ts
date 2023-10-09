export type Template = {
  id: string;
  width: number;
  height: number;
  imageUrl: string;
}

export type Size = {
  id: string;
  title: string;
  priceMultiplier: number;
}

export type Page = {
  title: string;
  templateId: string;
}

export type Card = {
  id: string;
  title: string;
  sizes: string[];
  basePrice: number;
  pages: Page[];
}

export type CardPage = {
  title: string;
  width: number;
  height: number;
  imageUrl: string;
}

export type AllCards = {
  title: string;
  imageUrl: string;
  url: string;
}

export type AvailableSizes = {
  id: string;
  title: string;
}

export type SingleCard = {
  title: string;
  size: string | undefined;
  availableSizes: AvailableSizes[];
  imageUrl: string;
  price: string | undefined;
  pages: CardPage[];
}

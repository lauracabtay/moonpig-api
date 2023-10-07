import { Request, Response } from "express";
import axios from 'axios';
import { 
  AvailableSizes,
  Card,
  CardPage,
  Page,
  SingleCard,
  Size,
  Template
} from "../interfaces";

export const CARDS_URL = 'https://moonpig.github.io/tech-test-node-backend/cards.json';
export const TEMPLATES_URL = 'https://moonpig.github.io/tech-test-node-backend/templates.json';
export const SIZES_URL = 'https://moonpig.github.io/tech-test-node-backend/sizes.json';

export const getCardByIdHandler = async (req: Request, res: Response) => {
  try {
    const { cardId, sizeId } = req.params;

    // Requests are made in parallel
    const [cardsResponse, sizesResponse, templatesResponse] = await Promise.all([
      axios.get<Card[]>(CARDS_URL),
      axios.get<Size[]>(SIZES_URL),
      axios.get<Template[]>(TEMPLATES_URL)
    ]);

    // TO DO: Handle optional size param
    const card = cardsResponse.data.find(c => c.id === cardId);
    const allSizes = sizesResponse.data;
    const templates = templatesResponse.data;

    if (!card) {
      // If card does not exist, send a 404 response
      res.status(404).json({ error: `${cardId} not found` });
      return;
    }

    const availableSizes: AvailableSizes[] = card.sizes.map((size: string) => {
      const sizeId = allSizes.find((s) => s.id === size).id;
      const sizeTitle = allSizes.find((s) => s.id === size).title;

      return {
        id: sizeId,
        title: sizeTitle
      }
    });

    const frontCover = card.pages.find((page: Page) => page.title === 'Front Cover');
    const imageUrl = templates.find((template: Template) => template.id === frontCover.templateId).imageUrl;
    
    const sizePrice = allSizes.find((size: Size) => size.id === sizeId).priceMultiplier;

    const pages: CardPage[] = card.pages.map((page: Page) => {
      const templateId = templates.find((t) => t.id === page.templateId).id;
      const pageTitle = card.pages.find((page: Page) => page.templateId === templateId).title;
      const pageWidth = templates.find((t) => t.id === page.templateId).width;
      const pageHeight = templates.find((t) => t.id === page.templateId).height;
      const pageImageUrl = templates.find((t) => t.id === page.templateId).imageUrl;

      return {
        title: pageTitle,
        width: pageWidth,
        height: pageHeight,
        imageUrl: pageImageUrl
      }
    });

    const result: SingleCard = {
      title: card.title,
      size: sizeId,
      availableSizes: availableSizes,
      imageUrl: imageUrl,
      price: `£${(card.basePrice / 100 * sizePrice).toFixed(2)}`,
      pages: pages,
    }

    res.json(result);
  }
  catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

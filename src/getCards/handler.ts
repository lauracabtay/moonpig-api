import { Request, Response } from "express";
import { AllCards, Card, Page, Template } from "../interfaces";
import { CARDS_URL, TEMPLATES_URL, fetchData } from "../dataSources";

export const getCardsHandler = async (req: Request, res: Response) => {
  try {
    const [cards, templates] = await fetchData([CARDS_URL, TEMPLATES_URL])

    if (cards.length === 0) {
      return res.status(404).json({ error: 'No cards found' });
    }

    const result: AllCards[] = cards.map((card: Card) => {
      const frontCover = card.pages.find((page: Page) => page.title === 'Front Cover');
      const imageUrl = templates.find((template: Template) => template.id === frontCover.templateId).imageUrl;
      
      return {
        title: card.title,
        imageUrl,
        url: `/cards/${card.id}`
      };
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

import { Request, Response } from "express";
import axios from 'axios';
import { AllCards, Card, Page } from "../interfaces";
import { Template } from "../interfaces";

export const CARDS_URL = 'https://moonpig.github.io/tech-test-node-backend/cards.json';
export const TEMPLATES_URL = 'https://moonpig.github.io/tech-test-node-backend/templates.json';

export const getCardsHandler = async (req: Request, res: Response) => {
  try {
    // Requests are made in parallel
    const [cardsResponse, templatesResponse] = await Promise.all([
      axios.get<Card[]>(CARDS_URL),
      axios.get<Template[]>(TEMPLATES_URL)
    ]);

    const cards = cardsResponse.data;
    const templates = templatesResponse.data;

    if (cards.length === 0) {
      // If no card exists, send a 404 response
      res.status(404).json({ error: 'No cards found' });
      return;
    }

    const result: AllCards[] = cards.map((card: Card) => {
      // For each card returned, look for the page that has a title of 'front cover'.
      const frontCover = card.pages.find((page: Page) => page.title === 'Front Cover');
      /* 
      For each template, look for the template that has the same id as the
      frontCover template id, and fetch the imageUrl associated with this 
      template id.
      */
      const imageUrl = templates.find((template: Template) => template.id === frontCover.templateId).imageUrl;
      
      return {
        title: card.title,
        imageUrl,
        url: `/cards/${card.id}`
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

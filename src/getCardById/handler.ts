import { Request, Response } from "express";
import { CARDS_URL, SIZES_URL, TEMPLATES_URL, fetchData } from "../dataSources";
import {
  AvailableSizes,
  CardPage,
  Page,
  SingleCard,
  Size,
  Template,
} from "../interfaces";

export const getCardByIdHandler = async (req: Request, res: Response) => {
  try {
    const { cardId, sizeId } = req.params;

    const [cards, allSizes, templates] = await fetchData([
      CARDS_URL,
      SIZES_URL,
      TEMPLATES_URL,
    ]);

    const card = cards.find((c: { id: string }) => c.id === cardId);

    if (!card) {
      return res.status(404).json({ error: `${cardId} not found` });
    }

    const hasValidSizeId = sizeId && card.sizes.includes(sizeId);

    // Retrieve card available sizes
    const availableSizes: AvailableSizes[] = card.sizes.map((size: string) => {
      const availableSize = allSizes.find((s: { id: string }) => s.id === size);

      return {
        id: availableSize.id,
        title: availableSize.title,
      };
    });

    // Retrieve card imageUrl
    const frontCover = card.pages.find(
      (page: Page) => page.title === "Front Cover",
    );
    const imageUrl = templates.find(
      (template: Template) => template.id === frontCover.templateId,
    ).imageUrl;

    // Calculate card
    const sizeDetail =
      allSizes.find((size: Size) => size.id === sizeId) || undefined;
    const sizePrice = hasValidSizeId
      ? `£${((card.basePrice / 100) * sizeDetail.priceMultiplier).toFixed(2)}`
      : undefined;

    // Retrieve card pages details
    const pages: CardPage[] = card.pages.map((page: Page) => {
      const template = templates.find(
        (t: { id: string }) => t.id === page.templateId,
      );
      const pageTitle = card.pages.find(
        (page: Page) => page.templateId === template.id,
      ).title;

      return {
        title: pageTitle,
        width: template.width,
        height: template.height,
        imageUrl: template.imageUrl,
      };
    });

    const result: SingleCard = {
      title: card.title,
      size: hasValidSizeId ? sizeId : undefined,
      availableSizes,
      imageUrl,
      price: sizePrice,
      pages,
    };

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

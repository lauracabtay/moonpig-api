import * as express from "express";
import { getCardsHandler } from "./getCards/handler";

export const app = express()

app.set('json spaces', 2);

// GET /cards
app.get('/cards', getCardsHandler);

app.get('/cards/:cardId/:sizeId?', () => {
  // respond with card by id
});

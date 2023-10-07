import * as express from "express";
import { getCardsHandler } from "./getCards/handler";
import { getCardByIdHandler } from "./getCardById/handler";

export const app = express()

app.set('json spaces', 2);

// GET /cards
app.get('/cards', getCardsHandler);

// GET /cards/:cardId/:sizeId?
app.get('/cards/:cardId/:sizeId?', getCardByIdHandler);

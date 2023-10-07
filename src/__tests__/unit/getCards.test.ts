import { Request, Response } from 'express';
import { getCardsHandler } from '../../getCards/handler';
import { CARDS_URL, TEMPLATES_URL } from "../../dataSources";
import axios from 'axios';

jest.mock('axios');

let req: Request;
let res: Response;

beforeEach(() => {
  req = {} as Request;
  res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
  } as unknown as Response;
})

describe('getCardsHandler', () => {
  it('should return formatted card data', async () => {
    const mockResponses = {
      [CARDS_URL]: {
        data: [
          { id: 1, title: 'Card 1', pages: [{ title: 'Front Cover', templateId: 1 }] },
          { id: 2, title: 'Card 2', pages: [{ title: 'Front Cover', templateId: 2 }] }
        ]
      },
      [TEMPLATES_URL]: {
        data: [
          { id: 1, imageUrl: 'image1.jpg' },
          { id: 2, imageUrl: 'image2.jpg' }
        ]
      }
    };

    // Mock the axios.get function to return the mock response data based on the URL
    (axios.get as jest.Mock).mockImplementation((url: string) => {
      return Promise.resolve(mockResponses[url]);
    });

    await getCardsHandler(req, res);

    expect(res.json).toHaveBeenCalledWith([
      { title: 'Card 1', imageUrl: 'image1.jpg', url: '/cards/1' },
      { title: 'Card 2', imageUrl: 'image2.jpg', url: '/cards/2' }
    ]);
  });

  it('should handle a 500 Internal Server Error', async () => {
    // Mock the axios.get function to return a 500 Internal Server Error response
    (axios.get as jest.Mock).mockRejectedValue({ response: { status: 500 } });

    await getCardsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  it('should handle a 404 Not Found when no cards are returned', async () => {
    // Mock the axios.get function to return an empty array as the response data
    (axios.get as jest.Mock).mockResolvedValue({ data: [] });

    await getCardsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'No cards found' });
  });
});

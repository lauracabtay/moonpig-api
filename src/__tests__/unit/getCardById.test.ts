import { Request, Response } from 'express';
import { getCardByIdHandler } from '../../getCardById/handler';
import { CARDS_URL, SIZES_URL, TEMPLATES_URL } from "../../dataSources";
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
  req.params = {
    cardId: 'card001',
    sizeId: 'sm'
  };
})

describe('getCardByIdHandler', () => {
  it('should return formatted card data | with valid params', async () => {
    const mockResponses = {
      [CARDS_URL]: {
        data: [
          { id: 'card001', title: 'Card 1', sizes: ["sm", "md"], basePrice: 200, pages: [{ title: 'Front Cover', templateId: 'template001' }] },
        ]
      },
      [SIZES_URL]: {
        data: [
          { id: 'sm', title: 'small', priceMultiplier: 0.8 },
          { id: 'md', title: 'medium', priceMultiplier: 1 }
        ]
      },
      [TEMPLATES_URL]: {
        data: [
          { id: 'template001', width: 300, height: 600, imageUrl: 'image1.jpg' },
        ]
      }
    };

    // Mock the axios.get function to return the mock response data based on the URL
    (axios.get as jest.Mock).mockImplementation((url: string) => {
      return Promise.resolve(mockResponses[url]);
    });

    await getCardByIdHandler(req, res);

    expect(res.json).toHaveBeenCalledWith({
      title: 'Card 1',
      size: 'sm',
      availableSizes: [
        { id: 'sm', title: 'small' },
        { id: 'md', title: 'medium' },
      ],
      imageUrl: 'image1.jpg',
      price: '£1.60',
      pages: [
        {
          "title": "Front Cover",
          "width": 300,
          "height": 600,
          "imageUrl": "image1.jpg"
        },
      ]
    });
  });

  it('should return formatted card data | without size param', async () => {
    req.params = {
      cardId: 'card001',
    };

    const mockResponses = {
      [CARDS_URL]: {
        data: [
          { id: 'card001', title: 'Card 1', sizes: ["sm", "md"], basePrice: 200, pages: [{ title: 'Front Cover', templateId: 'template001' }] },
        ]
      },
      [SIZES_URL]: {
        data: [
          { id: 'sm', title: 'small', priceMultiplier: 0.8 },
          { id: 'md', title: 'medium', priceMultiplier: 1 }
        ]
      },
      [TEMPLATES_URL]: {
        data: [
          { id: 'template001', width: 300, height: 600, imageUrl: 'image1.jpg' },
        ]
      }
    };

    // Mock the axios.get function to return the mock response data based on the URL
    (axios.get as jest.Mock).mockImplementation((url: string) => {
      return Promise.resolve(mockResponses[url]);
    });

    await getCardByIdHandler(req, res);

    expect(res.json).toHaveBeenCalledWith({
      title: 'Card 1',
      availableSizes: [
        { id: 'sm', title: 'small' },
        { id: 'md', title: 'medium' },
      ],
      imageUrl: 'image1.jpg',
      pages: [
        {
          "title": "Front Cover",
          "width": 300,
          "height": 600,
          "imageUrl": "image1.jpg"
        },
      ]
    });
  });

  it('should return formatted card data | without non existent size param', async () => {
    req.params = {
      cardId: 'card001',
      sizeId: 'lg'
    };

    const mockResponses = {
      [CARDS_URL]: {
        data: [
          { id: 'card001', title: 'Card 1', sizes: ["sm", "md"], basePrice: 200, pages: [{ title: 'Front Cover', templateId: 'template001' }] },
        ]
      },
      [SIZES_URL]: {
        data: [
          { id: 'sm', title: 'small', priceMultiplier: 0.8 },
          { id: 'md', title: 'medium', priceMultiplier: 1 }
        ]
      },
      [TEMPLATES_URL]: {
        data: [
          { id: 'template001', width: 300, height: 600, imageUrl: 'image1.jpg' },
        ]
      }
    };

    // Mock the axios.get function to return the mock response data based on the URL
    (axios.get as jest.Mock).mockImplementation((url: string) => {
      return Promise.resolve(mockResponses[url]);
    });

    await getCardByIdHandler(req, res);

    expect(res.json).toHaveBeenCalledWith({
      title: 'Card 1',
      availableSizes: [
        { id: 'sm', title: 'small' },
        { id: 'md', title: 'medium' },
      ],
      imageUrl: 'image1.jpg',
      pages: [
        {
          "title": "Front Cover",
          "width": 300,
          "height": 600,
          "imageUrl": "image1.jpg"
        },
      ]
    });
  });

  it('should handle a 404 Not Found when no cards are returned', async () => {
    // Mock the axios.get function to return an empty array as the response data
    (axios.get as jest.Mock).mockResolvedValue({ data: [] });

    await getCardByIdHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'card001 not found' });
  });

  it('should handle a 500 Internal Server Error', async () => {
    // Mock the axios.get function to return a 500 Internal Server Error response
    (axios.get as jest.Mock).mockRejectedValue({ response: { status: 500 } });

    await getCardByIdHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

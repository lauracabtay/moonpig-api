![alt text](img/moonpig-logo.png 'Moonpig')

# Description

I decided to take on [Moonpig Node Backend Technical Challenge](https://github.com/Moonpig/tech-test-node-backend) for fun and to improve my skills in building REST APIs.

The task at hand is to build a new "cards" service for the front-end of the Moonpig website. It requires building a simple REST-like API with two endpoints - one for returning a list of cards and another that returns a single instance of a card.

1. `/cards` - Returns a list of cards.
2. `/cards/{cardId}` - Returns a single instance of a card.

The data for this challenge is provided as JSON files from the following URLs.
These files should be treated as a remote data source.

- [Cards JSON](https://moonpig.github.io/tech-test-node-backend/cards.json)
- [Sizes JSON](https://moonpig.github.io/tech-test-node-backend/sizes.json)
- [Templates JSON](https://moonpig.github.io/tech-test-node-backend/templates.json)

## Endpoints

### `/cards`

This endpoint returns a list of cards.

- `imageUrl` should be the image found on the template that corresponds to the first page for the card.
- `url` should have the format `/cards/[id]`

Expected JSON response from `GET /cards`:

```json
[
  {
    "title": "card 1 title",
    "imageUrl": "/front-cover-portrait-1.jpg",
    "url": "/cards/card001"
  },
  {
    "title": "card 2 title",
    "imageUrl": "/front-cover-portrait-2.jpg",
    "url": "/cards/card002"
  },
  {
    "title": "card 3 title",
    "imageUrl": "/front-cover-landscape.jpg",
    "url": "/cards/card003"
  }
]
```

### `/cards/[cardId]/[sizeId]`

This endpoint returns a single card identified by its `id`. It takes an optional route parameter `sizeId` - the sizing of a card affects its price.

- `price` is calculated by the multiplying the `basePrice` of the card by the `priceMultiplier` from the selected size. If no size is provided it should default to the `basePrice`. The `basePrice` is the amount in pence and the result should be formatted as
  a string e.g. `"£2.00"`.

**Note: if no size param is passed, or if card is not available in specified size, the response will purposefully exclude the `size` and `price` keys**

Expected JSON response from `GET /cards/card001/gt`:

```json
{
  "title": "card 1 title",
  "size": "gt",
  "availableSizes": [
    {
      "id": "sm",
      "title": "Small"
    },
    {
      "id": "md",
      "title": "Medium"
    },
    {
      "id": "gt",
      "title": "Giant"
    }
  ],
  "imageUrl": "/front-cover-portrait-1.jpg",
  "price": "£4.00",
  "pages": [
    {
      "title": "Front Cover",
      "width": 300,
      "height": 600,
      "imageUrl": "/front-cover-portrait-1.jpg"
    },
    {
      "title": "Inside Left",
      "width": 300,
      "height": 600,
      "imageUrl": ""
    },
    {
      "title": "Inside Right",
      "width": 300,
      "height": 600,
      "imageUrl": ""
    },
    {
      "title": "Back Cover",
      "width": 300,
      "height": 600,
      "imageUrl": "/back-cover-portrait.jpg"
    }
  ]
}
```

## Technologies Used

- TypeScript
- Node.js
- Express
- Axios for HTTP requests
- Jest for unit/integration testing

## Running the application

| Command         | Description                                             |
| --------------- | ------------------------------------------------------- |
| `yarn dev`      | run the server in development (watch) mode on port 3000 |
| `yarn test`     | run unit tests using Jest                               |
| `yarn test:e2e` | run integration tests using Jest                        |

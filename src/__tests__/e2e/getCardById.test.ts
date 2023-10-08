import * as request from "supertest";
import { app } from "../../server";

describe("GET /cards/:cardId/:sizeId?)", () => {
  it("returns a 200 status code will all data | with valid params", async () => {
    const response = await request(app).get("/cards/card001/sm");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      title: "card 1 title",
      size: "sm",
      availableSizes: [
        {
          id: "sm",
          title: "Small",
        },
        {
          id: "md",
          title: "Medium",
        },
        {
          id: "gt",
          title: "Giant",
        },
      ],
      imageUrl: "/front-cover-portrait-1.jpg",
      price: "£1.60",
      pages: [
        {
          title: "Front Cover",
          width: 300,
          height: 600,
          imageUrl: "/front-cover-portrait-1.jpg",
        },
        {
          title: "Inside Left",
          width: 300,
          height: 600,
          imageUrl: "",
        },
        {
          title: "Inside Right",
          width: 300,
          height: 600,
          imageUrl: "",
        },
        {
          title: "Back Cover",
          width: 300,
          height: 600,
          imageUrl: "/back-cover-portrait.jpg",
        },
      ],
    });
  });

  it("returns a 200 status code will all data | with no sizeId params", async () => {
    const response = await request(app).get("/cards/card001");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      title: "card 1 title",
      availableSizes: [
        {
          id: "sm",
          title: "Small",
        },
        {
          id: "md",
          title: "Medium",
        },
        {
          id: "gt",
          title: "Giant",
        },
      ],
      imageUrl: "/front-cover-portrait-1.jpg",
      pages: [
        {
          title: "Front Cover",
          width: 300,
          height: 600,
          imageUrl: "/front-cover-portrait-1.jpg",
        },
        {
          title: "Inside Left",
          width: 300,
          height: 600,
          imageUrl: "",
        },
        {
          title: "Inside Right",
          width: 300,
          height: 600,
          imageUrl: "",
        },
        {
          title: "Back Cover",
          width: 300,
          height: 600,
          imageUrl: "/back-cover-portrait.jpg",
        },
      ],
    });
  });

  it("returns a 200 status code will all data | with inexistent size param", async () => {
    const response = await request(app).get("/cards/card001/lg");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      title: "card 1 title",
      availableSizes: [
        {
          id: "sm",
          title: "Small",
        },
        {
          id: "md",
          title: "Medium",
        },
        {
          id: "gt",
          title: "Giant",
        },
      ],
      imageUrl: "/front-cover-portrait-1.jpg",
      pages: [
        {
          title: "Front Cover",
          width: 300,
          height: 600,
          imageUrl: "/front-cover-portrait-1.jpg",
        },
        {
          title: "Inside Left",
          width: 300,
          height: 600,
          imageUrl: "",
        },
        {
          title: "Inside Right",
          width: 300,
          height: 600,
          imageUrl: "",
        },
        {
          title: "Back Cover",
          width: 300,
          height: 600,
          imageUrl: "/back-cover-portrait.jpg",
        },
      ],
    });
  });

  it("returns a 404 status code and an error message when no cards are found", async () => {
    jest.spyOn(require("axios"), "get").mockResolvedValue({ data: [] });
    const response = await request(app).get("/cards");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "No cards found" });
  });
  it("returns a 500 status code and an error message when there is a server error", async () => {
    // Mock the Axios response to simulate a server error
    jest
      .spyOn(require("axios"), "get")
      .mockRejectedValue(new Error("Internal Server Error"));

    const response = await request(app).get("/cards");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });
  });
});

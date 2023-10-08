import * as request from "supertest";
import { app } from "../../server";

describe("GET /cards)", () => {
  it("returns a 200 status code will all data", async () => {
    const response = await request(app).get("/cards");

    expect(response.status).toBe(200);
    expect(response.body[0]).toEqual({
      title: "card 1 title",
      imageUrl: "/front-cover-portrait-1.jpg",
      url: "/cards/card001",
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

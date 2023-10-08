import axios from "axios";

export const CARDS_URL =
  "https://moonpig.github.io/tech-test-node-backend/cards.json";
export const TEMPLATES_URL =
  "https://moonpig.github.io/tech-test-node-backend/templates.json";
export const SIZES_URL =
  "https://moonpig.github.io/tech-test-node-backend/sizes.json";

export const fetchData = async (urls: string[]) => {
  // Requests are made in parallel
  const responses = await Promise.all(urls.map((url) => axios.get(url)));
  return responses.map((response) => response.data);
};

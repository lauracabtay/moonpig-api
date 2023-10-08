import { app } from "./server";

const PORT = 3000;

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}…`);
});

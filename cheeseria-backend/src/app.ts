import express from "express";
import "dotenv/config";
import { cheeseRouter } from "./routes/cheeseRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = 3001;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/cheeses", cheeseRouter);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

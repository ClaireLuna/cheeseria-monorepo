import { Router } from "express";
import { cheeseController } from "../controllers/cheeseController.js";

export const cheeseRouter = Router();

cheeseRouter.get("/", cheeseController.getAllCheeses);
cheeseRouter.get("/:id", cheeseController.getCheeseById);
cheeseRouter.post("/", cheeseController.createCheese);
cheeseRouter.put("/:id", cheeseController.updateCheese);
cheeseRouter.delete("/:id", cheeseController.deleteCheese);
cheeseRouter.post("/init", cheeseController.initializeDatabase);

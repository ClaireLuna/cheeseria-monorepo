import { Request, Response } from "express";
import { cheeseService } from "../services/cheeseService.js";

export const cheeseController = {
  async getAllCheeses(req: Request, res: Response) {
    try {
      const cheeses = await cheeseService.getAllCheeses();
      res.status(200).json(cheeses);
    } catch (error) {
      res.status(500).json({ error: "Error fetching cheeses" });
    }
  },

  async getCheeseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cheese = await cheeseService.getCheeseById(id);

      if (!cheese) {
        return res.status(404).json({ error: "Cheese not found" });
      }

      res.status(200).json(cheese);
    } catch (error) {
      res.status(500).json({ error: "Error fetching cheese" });
    }
  },

  async createCheese(req: Request, res: Response) {
    try {
      const { name, description, price } = req.body;

      if (!name || !description || price === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newCheese = await cheeseService.createCheese(name, description, price);
      res.status(201).json(newCheese);
    } catch (error) {
      res.status(500).json({ error: "Error creating cheese" });
    }
  },

  async updateCheese(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, price } = req.body;

      const updatedCheese = await cheeseService.updateCheese(id, name, description, price);
      res.status(200).json(updatedCheese);
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Cheese not found" });
      }
      res.status(500).json({ error: "Error updating cheese" });
    }
  },

  async deleteCheese(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await cheeseService.deleteCheese(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Cheese not found" });
      }
      res.status(500).json({ error: "Error deleting cheese" });
    }
  },

  async initializeDatabase(req: Request, res: Response) {
    try {
      const count = await cheeseService.initializeDatabase();
      const cheeses = await cheeseService.getAllCheeses();
      res.status(200).json({
        message: `Initialized database with ${count} cheese entries.`,
        cheeses,
      });
    } catch (error) {
      res.status(500).json({ error: "Error initializing database" });
    }
  },
};

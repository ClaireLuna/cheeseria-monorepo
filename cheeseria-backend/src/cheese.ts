import "dotenv/config";
import { cheeseService } from "./services/cheeseService.js";

// This file is kept for backwards compatibility
// Use cheeseService from services/cheeseService.ts for new code

export async function init() {
  return await cheeseService.initializeDatabase();
}

export async function getAllCheeses() {
  return await cheeseService.getAllCheeses();
}

export async function getCheeseById(id: string) {
  return await cheeseService.getCheeseById(id);
}

export async function createCheese(name: string, description: string, price: number) {
  return await cheeseService.createCheese(name, description, price);
}

export async function updateCheese(id: string, name?: string, description?: string, price?: number) {
  return await cheeseService.updateCheese(id, name, description, price);
}

export async function deleteCheese(id: string) {
  return await cheeseService.deleteCheese(id);
}

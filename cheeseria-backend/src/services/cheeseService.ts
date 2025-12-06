import { prisma } from "../db/prisma.js";

export const cheeseService = {
  async getAllCheeses() {
    return await prisma.cheese.findMany();
  },

  async getCheeseById(id: string) {
    return await prisma.cheese.findUnique({
      where: { id },
    });
  },

  async createCheese(name: string, description: string, price: number) {
    return await prisma.cheese.create({
      data: {
        name,
        description,
        price,
      },
    });
  },

  async updateCheese(id: string, name?: string, description?: string, price?: number) {
    return await prisma.cheese.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price }),
      },
    });
  },

  async deleteCheese(id: string) {
    return await prisma.cheese.delete({
      where: { id },
    });
  },

  async initializeDatabase() {
    await prisma.cheese.deleteMany({}); // Clear existing entries for a fresh start

    const cheeses = await prisma.cheese.createMany({
      data: [
        {
          name: "Gouda",
          description: "A mild-flavored cheese from the Netherlands.",
          price: 12.99,
        },
        {
          name: "Cheddar",
          description: "A popular cheese with a sharp taste.",
          price: 10.49,
        },
        {
          name: "Brie",
          description: "A soft cheese with a creamy texture.",
          price: 14.99,
        },
        {
          name: "Blue Cheese",
          description: "A cheese with blue veins and a strong flavor.",
          price: 15.99,
        },
        {
          name: "Parmesan",
          description: "A hard, granular cheese often used for grating.",
          price: 13.49,
        },
      ],
    });

    return cheeses.count;
  },
};

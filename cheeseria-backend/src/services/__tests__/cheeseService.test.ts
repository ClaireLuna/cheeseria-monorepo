import { cheeseService } from "../cheeseService";
import { prisma } from "../../db/prisma";

// Mock the prisma client
jest.mock("../../db/prisma", () => ({
  prisma: {
    cheese: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
  },
}));

describe("CheeseService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllCheeses", () => {
    it("should return all cheeses", async () => {
      const mockCheeses = [
        {
          id: "1",
          name: "Gouda",
          description: "A mild-flavored cheese from the Netherlands.",
          price: 12.99,
        },
        {
          id: "2",
          name: "Cheddar",
          description: "A popular cheese with a sharp taste.",
          price: 10.49,
        },
      ];

      (prisma.cheese.findMany as jest.Mock).mockResolvedValue(mockCheeses);

      const result = await cheeseService.getAllCheeses();

      expect(result).toEqual(mockCheeses);
      expect(prisma.cheese.findMany).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array if no cheeses exist", async () => {
      (prisma.cheese.findMany as jest.Mock).mockResolvedValue([]);

      const result = await cheeseService.getAllCheeses();

      expect(result).toEqual([]);
    });
  });

  describe("getCheeseById", () => {
    it("should return a cheese by id", async () => {
      const mockCheese = {
        id: "1",
        name: "Gouda",
        description: "A mild-flavored cheese from the Netherlands.",
        price: 12.99,
      };

      (prisma.cheese.findUnique as jest.Mock).mockResolvedValue(mockCheese);

      const result = await cheeseService.getCheeseById("1");

      expect(result).toEqual(mockCheese);
      expect(prisma.cheese.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should return null if cheese is not found", async () => {
      (prisma.cheese.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await cheeseService.getCheeseById("999");

      expect(result).toBeNull();
    });
  });

  describe("createCheese", () => {
    it("should create a new cheese", async () => {
      const mockNewCheese = {
        id: "3",
        name: "Brie",
        description: "A soft cheese with a creamy texture.",
        price: 14.99,
      };

      (prisma.cheese.create as jest.Mock).mockResolvedValue(mockNewCheese);

      const result = await cheeseService.createCheese(
        "Brie",
        "A soft cheese with a creamy texture.",
        14.99
      );

      expect(result).toEqual(mockNewCheese);
      expect(prisma.cheese.create).toHaveBeenCalledWith({
        data: {
          name: "Brie",
          description: "A soft cheese with a creamy texture.",
          price: 14.99,
        },
      });
    });
  });

  describe("updateCheese", () => {
    it("should update a cheese with all fields", async () => {
      const mockUpdatedCheese = {
        id: "1",
        name: "Updated Gouda",
        description: "Updated description",
        price: 15.99,
      };

      (prisma.cheese.update as jest.Mock).mockResolvedValue(mockUpdatedCheese);

      const result = await cheeseService.updateCheese(
        "1",
        "Updated Gouda",
        "Updated description",
        15.99
      );

      expect(result).toEqual(mockUpdatedCheese);
      expect(prisma.cheese.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          name: "Updated Gouda",
          description: "Updated description",
          price: 15.99,
        },
      });
    });

    it("should update a cheese with partial fields", async () => {
      const mockUpdatedCheese = {
        id: "1",
        name: "Updated Gouda",
        description: "A mild-flavored cheese from the Netherlands.",
        price: 12.99,
      };

      (prisma.cheese.update as jest.Mock).mockResolvedValue(mockUpdatedCheese);

      const result = await cheeseService.updateCheese("1", "Updated Gouda");

      expect(result).toEqual(mockUpdatedCheese);
      expect(prisma.cheese.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          name: "Updated Gouda",
        },
      });
    });
  });

  describe("deleteCheese", () => {
    it("should delete a cheese by id", async () => {
      const mockDeletedCheese = {
        id: "1",
        name: "Gouda",
        description: "A mild-flavored cheese from the Netherlands.",
        price: 12.99,
      };

      (prisma.cheese.delete as jest.Mock).mockResolvedValue(mockDeletedCheese);

      const result = await cheeseService.deleteCheese("1");

      expect(result).toEqual(mockDeletedCheese);
      expect(prisma.cheese.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });
  });

  describe("initializeDatabase", () => {
    it("should clear existing cheeses and create new ones", async () => {
      (prisma.cheese.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });
      (prisma.cheese.createMany as jest.Mock).mockResolvedValue({ count: 5 });

      const result = await cheeseService.initializeDatabase();

      expect(result).toBe(5);
      expect(prisma.cheese.deleteMany).toHaveBeenCalledWith({});
      expect(prisma.cheese.createMany).toHaveBeenCalled();
    });
  });
});

import { cheeseController } from "../cheeseController";
import { cheeseService } from "../../services/cheeseService";
import { Request, Response } from "express";

// Mock the cheese service
jest.mock("../../services/cheeseService", () => ({
  cheeseService: {
    getAllCheeses: jest.fn(),
    getCheeseById: jest.fn(),
    createCheese: jest.fn(),
    updateCheese: jest.fn(),
    deleteCheese: jest.fn(),
    initializeDatabase: jest.fn(),
  },
}));

describe("CheeseController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("getAllCheeses", () => {
    it("should return all cheeses with 200 status", async () => {
      const mockCheeses = [
        {
          id: "1",
          name: "Gouda",
          description: "A mild-flavored cheese from the Netherlands.",
          price: 12.99,
        },
      ];

      (cheeseService.getAllCheeses as jest.Mock).mockResolvedValue(mockCheeses);

      await cheeseController.getAllCheeses(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCheeses);
    });

    it("should return 500 status on error", async () => {
      (cheeseService.getAllCheeses as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await cheeseController.getAllCheeses(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error fetching cheeses",
      });
    });
  });

  describe("getCheeseById", () => {
    it("should return a cheese by id with 200 status", async () => {
      const mockCheese = {
        id: "1",
        name: "Gouda",
        description: "A mild-flavored cheese from the Netherlands.",
        price: 12.99,
      };

      mockRequest.params = { id: "1" };
      (cheeseService.getCheeseById as jest.Mock).mockResolvedValue(mockCheese);

      await cheeseController.getCheeseById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCheese);
    });

    it("should return 404 status if cheese not found", async () => {
      mockRequest.params = { id: "999" };
      (cheeseService.getCheeseById as jest.Mock).mockResolvedValue(null);

      await cheeseController.getCheeseById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Cheese not found",
      });
    });

    it("should return 500 status on error", async () => {
      mockRequest.params = { id: "1" };
      (cheeseService.getCheeseById as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await cheeseController.getCheeseById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error fetching cheese",
      });
    });
  });

  describe("createCheese", () => {
    it("should create a cheese with 201 status", async () => {
      const newCheese = {
        name: "Brie",
        description: "A soft cheese with a creamy texture.",
        price: 14.99,
      };

      const createdCheese = {
        id: "3",
        ...newCheese,
      };

      mockRequest.body = newCheese;
      (cheeseService.createCheese as jest.Mock).mockResolvedValue(createdCheese);

      await cheeseController.createCheese(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdCheese);
    });

    it("should return 400 status if required fields are missing", async () => {
      mockRequest.body = { name: "Brie" }; // Missing description and price

      await cheeseController.createCheese(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Missing required fields",
      });
    });

    it("should return 500 status on error", async () => {
      mockRequest.body = {
        name: "Brie",
        description: "A soft cheese with a creamy texture.",
        price: 14.99,
      };

      (cheeseService.createCheese as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await cheeseController.createCheese(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error creating cheese",
      });
    });
  });

  describe("updateCheese", () => {
    it("should update a cheese with 200 status", async () => {
      const updatedCheese = {
        id: "1",
        name: "Updated Gouda",
        description: "A mild-flavored cheese from the Netherlands.",
        price: 12.99,
      };

      mockRequest.params = { id: "1" };
      mockRequest.body = { name: "Updated Gouda" };
      (cheeseService.updateCheese as jest.Mock).mockResolvedValue(updatedCheese);

      await cheeseController.updateCheese(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedCheese);
    });

    it("should return 404 status if cheese not found (P2025 error)", async () => {
      mockRequest.params = { id: "999" };
      mockRequest.body = { name: "Updated Gouda" };

      const error: any = new Error("Not found");
      error.code = "P2025";
      (cheeseService.updateCheese as jest.Mock).mockRejectedValue(error);

      await cheeseController.updateCheese(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Cheese not found",
      });
    });

    it("should return 500 status on other errors", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { name: "Updated Gouda" };
      (cheeseService.updateCheese as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await cheeseController.updateCheese(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error updating cheese",
      });
    });
  });

  describe("deleteCheese", () => {
    it("should delete a cheese with 204 status", async () => {
      mockRequest.params = { id: "1" };
      (cheeseService.deleteCheese as jest.Mock).mockResolvedValue({});

      await cheeseController.deleteCheese(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it("should return 404 status if cheese not found (P2025 error)", async () => {
      mockRequest.params = { id: "999" };

      const error: any = new Error("Not found");
      error.code = "P2025";
      (cheeseService.deleteCheese as jest.Mock).mockRejectedValue(error);

      await cheeseController.deleteCheese(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Cheese not found",
      });
    });

    it("should return 500 status on other errors", async () => {
      mockRequest.params = { id: "1" };
      (cheeseService.deleteCheese as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await cheeseController.deleteCheese(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error deleting cheese",
      });
    });
  });

  describe("initializeDatabase", () => {
    it("should initialize database with 200 status", async () => {
      const cheeses = [
        {
          id: "1",
          name: "Gouda",
          description: "A mild-flavored cheese from the Netherlands.",
          price: 12.99,
        },
      ];

      (cheeseService.initializeDatabase as jest.Mock).mockResolvedValue(1);
      (cheeseService.getAllCheeses as jest.Mock).mockResolvedValue(cheeses);

      await cheeseController.initializeDatabase(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Initialized database with 1 cheese entries.",
        cheeses,
      });
    });

    it("should return 500 status on error", async () => {
      (cheeseService.initializeDatabase as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await cheeseController.initializeDatabase(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error initializing database",
      });
    });
  });
});

import { cheeseRouter } from "../cheeseRoutes";
import { cheeseController } from "../../controllers/cheeseController";

// Mock the controller
jest.mock("../../controllers/cheeseController", () => ({
  cheeseController: {
    getAllCheeses: jest.fn(),
    getCheeseById: jest.fn(),
    createCheese: jest.fn(),
    updateCheese: jest.fn(),
    deleteCheese: jest.fn(),
    initializeDatabase: jest.fn(),
  },
}));

describe("Cheese Routes", () => {
  it("should have GET / route", () => {
    const routes = cheeseRouter.stack.filter(
      (layer: any) => layer.route && layer.route.path === "/"
    );
    const getRoute = routes.find((layer: any) => layer.route.methods.get);

    expect(getRoute).toBeDefined();
  });

  it("should have GET /:id route", () => {
    const routes = cheeseRouter.stack.filter(
      (layer: any) => layer.route && layer.route.path === "/:id"
    );
    const getByIdRoute = routes.find((layer: any) => layer.route.methods.get);

    expect(getByIdRoute).toBeDefined();
  });

  it("should have POST / route", () => {
    const routes = cheeseRouter.stack.filter(
      (layer: any) => layer.route && layer.route.path === "/"
    );
    const postRoute = routes.find((layer: any) => layer.route.methods.post);

    expect(postRoute).toBeDefined();
  });

  it("should have PUT /:id route", () => {
    const routes = cheeseRouter.stack.filter(
      (layer: any) => layer.route && layer.route.path === "/:id"
    );
    const putRoute = routes.find((layer: any) => layer.route.methods.put);

    expect(putRoute).toBeDefined();
  });

  it("should have DELETE /:id route", () => {
    const routes = cheeseRouter.stack.filter(
      (layer: any) => layer.route && layer.route.path === "/:id"
    );
    const deleteRoute = routes.find((layer: any) => layer.route.methods.delete);

    expect(deleteRoute).toBeDefined();
  });

  it("should have POST /init route", () => {
    const routes = cheeseRouter.stack.filter(
      (layer: any) => layer.route && layer.route.path === "/init"
    );
    const initRoute = routes.find((layer: any) => layer.route.methods.post);

    expect(initRoute).toBeDefined();
  });

  it("should have correct number of routes", () => {
    const routes = cheeseRouter.stack.filter((layer: any) => layer.route);
    expect(routes.length).toBe(6);
  });
});

import { errorHandler } from "../errorHandler";
import { Request, Response, NextFunction } from "express";

describe("ErrorHandler Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should log the error to console", () => {
    const testError = new Error("Test error message");

    errorHandler(
      testError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(testError);
  });

  it("should return 500 status code", () => {
    const testError = new Error("Test error");

    errorHandler(
      testError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });

  it("should return JSON response with error message", () => {
    const testError = new Error("Test error");

    errorHandler(
      testError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
  });

  it("should handle errors without message", () => {
    const testError = new Error();

    errorHandler(
      testError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
  });

  it("should handle non-Error objects", () => {
    const testError = "String error" as any;

    errorHandler(
      testError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
  });

  it("should not call next() function", () => {
    const testError = new Error("Test error");

    errorHandler(
      testError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should handle multiple errors in sequence", () => {
    const error1 = new Error("First error");
    const error2 = new Error("Second error");

    errorHandler(
      error1,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(error1);

    // Clear mocks for second call
    jest.clearAllMocks();
    consoleErrorSpy.mockClear();

    errorHandler(
      error2,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(error2);
  });
});

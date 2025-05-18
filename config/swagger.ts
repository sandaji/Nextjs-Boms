import { createSwaggerSpec } from "next-swagger-doc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory API",
      version: "1.0.0",
      description: "API documentation for the Inventory Management System",
    },
    servers: [
      {
        url: process.env.API_BASE_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
    },
    security: [{ cookieAuth: [] }],
    paths: {
      "/api/auth/login": {
        post: {
          summary: "Login user",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["userName", "password"],
                  properties: {
                    userName: { type: "string" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Login successful" },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          summary: "Logout user",
          responses: {
            200: { description: "Logout successful" },
          },
        },
      },
      "/api/products": {
        get: {
          summary: "Get all products",
          parameters: [
            {
              name: "search",
              in: "query",
              description: "Search term for filtering products",
              required: false,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "List of products" },
          },
        },
        post: {
          summary: "Create a new product",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "price", "stockQuantity", "imageUrl"],
                  properties: {
                    name: { type: "string" },
                    price: { type: "number" },
                    stockQuantity: { type: "integer" },
                    rating: { type: "number" },
                    imageUrl: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Product created successfully" },
            400: { description: "Invalid input" },
          },
        },
      },
      "/api/expenses": {
        get: {
          summary: "Get all expenses",
          parameters: [
            {
              name: "page",
              in: "query",
              description: "Page number",
              required: false,
              schema: { type: "integer", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              description: "Number of items per page",
              required: false,
              schema: { type: "integer", default: 10 },
            },
          ],
          responses: {
            200: { description: "List of expenses" },
          },
        },
        post: {
          summary: "Create a new expense",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["amount", "category"],
                  properties: {
                    amount: { type: "number" },
                    category: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Expense created successfully" },
            400: { description: "Invalid input" },
          },
        },
      },
      "/api/expenses/{expenseId}": {
        get: {
          summary: "Get expense by ID",
          parameters: [
            {
              name: "expenseId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Expense details" },
            404: { description: "Expense not found" },
          },
        },
        put: {
          summary: "Update expense",
          parameters: [
            {
              name: "expenseId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["amount", "category"],
                  properties: {
                    amount: { type: "number" },
                    category: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Expense updated successfully" },
            400: { description: "Invalid input" },
            404: { description: "Expense not found" },
          },
        },
        delete: {
          summary: "Delete expense",
          parameters: [
            {
              name: "expenseId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Expense deleted successfully" },
            404: { description: "Expense not found" },
          },
        },
      },
      "/api/upload/uploadImage": {
        post: {
          summary: "Upload an image",
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["image"],
                  properties: {
                    image: {
                      type: "string",
                      format: "binary",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Image uploaded successfully" },
            400: { description: "Invalid file" },
          },
        },
      },
      "/api/users": {
        get: {
          summary: "Get all users",
          responses: {
            200: { description: "List of users" },
          },
        },
        post: {
          summary: "Create a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email"],
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "User created successfully" },
            400: { description: "Invalid input" },
          },
        },
      },
      "/api/dashboard": {
        get: {
          summary: "Get dashboard metrics",
          description:
            "Retrieves metrics including popular products, sales summary, purchase summary, and expense summaries",
          responses: {
            200: {
              description: "Dashboard metrics retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      popularProducts: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            productId: { type: "string" },
                            name: { type: "string" },
                            price: { type: "number" },
                            rating: { type: "number" },
                            stockQuantity: { type: "integer" },
                            imageUrl: { type: "string" },
                          },
                        },
                      },
                      salesSummary: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            salesSummaryId: { type: "string" },
                            totalValue: { type: "number" },
                            changePercentage: { type: "number" },
                            date: { type: "string", format: "date-time" },
                          },
                        },
                      },
                      purchaseSummary: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            purchaseSummaryId: { type: "string" },
                            totalPurchased: { type: "number" },
                            changePercentage: { type: "number" },
                            date: { type: "string", format: "date-time" },
                          },
                        },
                      },
                      expenseSummary: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            expenseSummaryId: { type: "string" },
                            totalExpenses: { type: "number" },
                            date: { type: "string", format: "date-time" },
                          },
                        },
                      },
                      expenseByCategorySummary: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            expenseByCategoryId: { type: "string" },
                            category: { type: "string" },
                            amount: { type: "string" },
                            date: { type: "string", format: "date-time" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            500: { description: "Failed to fetch dashboard metrics" },
          },
        },
      },
      "/api/auth/check": {
        get: {
          summary: "Check authentication status",
          description:
            "Verifies if the user is authenticated and returns user information",
          responses: {
            200: {
              description: "Authentication status",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      authenticated: { type: "boolean" },
                      user: {
                        type: "object",
                        properties: {
                          adminId: { type: "string" },
                          userName: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Not authenticated" },
          },
        },
      },
    },
  },
  apiFolder: "app/api",
};

export const getSwaggerSpec = () => createSwaggerSpec(swaggerOptions);

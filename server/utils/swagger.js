const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Phone Ecommerce API Docs",
      version: "1.0.0",
      description: "https://phone-ecommerce-flhd60kl9-minhhieu04.vercel.app",
      contact: {
        name: "Minh Hieu",
        email: "minhhieu.tran.mcs@gmail.com",
        url: "https://github.com/minhhieu04",
      },
    },
    servers: [
      {
        url: "http://localhost:8888/api/",
        description: "Development server",
      },
    ],
    components: {
      schema: {
        Products: {
          type: "object",
          required: ["title", "slug", "description", "brand", "price"],
          properties: {
            title: {
              type: "string",
              description: "The name of the product",
            },
            slug: {
              type: "string",
              description: "The slug of the product",
            },
            description: {
              type: "string",
              description: "The description of the product",
            },
            brand: {
              type: "string",
              description: "The brand of the product",
            },
            price: {
              type: "string",
              description: "The price of the product",
            },
            category: {
              type: "string",
              description: "The category of the product",
            },
            quantity: {
              type: "number",
              description: "The quantity of the product",
            },
            sold: {
              type: "number",
              description: "Number of products sold",
            },
          },
        },
      },
      responses: {
        201: {
          description: "created successfully",
          contents: "application/json",
        },
      },
    },
  },
  apis: ["./product.js"],
};
module.exports = options;

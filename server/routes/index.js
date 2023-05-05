const userRoutes = require("./user");
const productRoutes = require("./product");
const { notFound, errorHandler } = require("../middlewares/errorHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRoutes);
  app.use("/api/product", productRoutes);

  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoutes;

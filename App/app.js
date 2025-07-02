/** @format */

const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/BP_authRoutes");
const userRoutes = require("./routes/BP_userRoutes");
const logger = require("./middlewares/BP_logger");
const globalLimiter = require("./middlewares/BP_ratelimiter");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();
const app = express();

// Middlewares
app.use(logger);
app.use(globalLimiter);
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend Practice API",
      version: "1.0.0",
      description: "API documentation for Backend CRUD Auth, User Management, and Encryption",
    },
    servers: [
      {
        url: "http://localhost:8080/api/bp",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"], // Scan your routes for annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/bp", authRoutes);
app.use("/api/bp", userRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

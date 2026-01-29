import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { initDb } from "./db.js";
import { seedAdmin } from "./seedAdmin.js";

import authRoutes from "./routes/auth.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import productsRoutes from "./routes/products.routes.js";
import uploadsRoutes from "./routes/uploads.routes.js";

dotenv.config();

const app = express();

// ✅ CORS primero
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://jervalt.com",
  "https://www.jervalt.com",
]);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman/curl
    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ Preflight SIN usar app.options("/*") que a vos te rompe
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// ✅ Body parser
app.use(express.json());

// ✅ Static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// DB init + seed
initDb();
seedAdmin();

// health
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/uploads", uploadsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Backend corriendo en puerto", PORT));

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Asegura que exista la carpeta destino
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// storage dinámico: /uploads/<folder>/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = String(req.query.folder || "misc").replace(/[^a-z0-9_-]/gi, "");
    const dest = path.join(process.cwd(), "uploads", folder);
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".jpg";
    const name = `img_${Date.now()}_${Math.round(Math.random() * 1e9)}${safeExt}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    cb(ok ? null : new Error("Solo se permiten JPG/PNG/WEBP"), ok);
  },
});

router.post("/", requireAuth, requireAdmin, upload.single("file"), (req, res) => {
  const folder = String(req.query.folder || "misc").replace(/[^a-z0-9_-]/gi, "");
  if (!req.file) return res.status(400).json({ message: "No se recibió archivo" });

  // URL pública que va a guardar el frontend en imageUrl
  const publicUrl = `/uploads/${folder}/${req.file.filename}`;
  res.status(201).json({ url: publicUrl });
});

export default router;

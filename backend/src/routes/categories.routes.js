import express from "express";
import { db } from "../db.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";
import { slugify } from "../utils/slugify.js";

const router = express.Router();

// ---------- PUBLIC ----------
router.get("/", (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, name, slug, imageUrl, description
       FROM categories
       ORDER BY name ASC`
    )
    .all();

  res.json(rows);
});

// ---------- ADMIN (protected) ----------
router.post("/", requireAuth, requireAdmin, (req, res) => {
  const { name, slug, imageUrl, description } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: "El nombre es requerido" });
  }

  const finalSlug = (slug && String(slug).trim()) ? slugify(slug) : slugify(name);
  if (!finalSlug) return res.status(400).json({ message: "Slug inválido" });

  try {
    const info = db
      .prepare(
        `INSERT INTO categories (name, slug, imageUrl, description, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`
      )
      .run(String(name).trim(), finalSlug, imageUrl || null, description || null);

    const created = db
      .prepare(`SELECT id, name, slug, imageUrl, description FROM categories WHERE id = ?`)
      .get(info.lastInsertRowid);

    res.status(201).json(created);
  } catch (e) {
    // unique constraint
    const msg = String(e?.message || "");
    if (msg.includes("UNIQUE") && msg.includes("categories.slug")) {
      return res.status(409).json({ message: "Ya existe una categoría con ese slug" });
    }
    if (msg.includes("UNIQUE") && msg.includes("categories.name")) {
      return res.status(409).json({ message: "Ya existe una categoría con ese nombre" });
    }
    return res.status(500).json({ message: "Error creando categoría" });
  }
});

router.put("/:id", requireAuth, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ message: "ID inválido" });

  const current = db.prepare(`SELECT * FROM categories WHERE id = ?`).get(id);
  if (!current) return res.status(404).json({ message: "Categoría no encontrada" });

  const { name, slug, imageUrl, description } = req.body || {};

  const nextName = name != null ? String(name).trim() : current.name;
  if (!nextName) return res.status(400).json({ message: "El nombre es requerido" });

  const nextSlug =
    slug != null
      ? slugify(slug)
      : name != null
        ? slugify(nextName)
        : current.slug;

  if (!nextSlug) return res.status(400).json({ message: "Slug inválido" });

  try {
    db.prepare(
      `UPDATE categories
       SET name = ?, slug = ?, imageUrl = ?, description = ?, updatedAt = datetime('now')
       WHERE id = ?`
    ).run(
      nextName,
      nextSlug,
      imageUrl !== undefined ? (imageUrl || null) : current.imageUrl,
      description !== undefined ? (description || null) : current.description,
      id
    );

    const updated = db
      .prepare(`SELECT id, name, slug, imageUrl, description FROM categories WHERE id = ?`)
      .get(id);

    res.json(updated);
  } catch (e) {
    const msg = String(e?.message || "");
    if (msg.includes("UNIQUE") && msg.includes("categories.slug")) {
      return res.status(409).json({ message: "Ya existe una categoría con ese slug" });
    }
    if (msg.includes("UNIQUE") && msg.includes("categories.name")) {
      return res.status(409).json({ message: "Ya existe una categoría con ese nombre" });
    }
    return res.status(500).json({ message: "Error actualizando categoría" });
  }
});

router.delete("/:id", requireAuth, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ message: "ID inválido" });

  const current = db.prepare(`SELECT id FROM categories WHERE id = ?`).get(id);
  if (!current) return res.status(404).json({ message: "Categoría no encontrada" });

  // opcional: evitar borrar si hay productos asociados
  const hasProducts = db.prepare(`SELECT 1 FROM products WHERE categoryId = ? LIMIT 1`).get(id);
  if (hasProducts) {
    return res.status(409).json({
      message: "No se puede borrar: hay productos asociados a esta categoría",
    });
  }

  db.prepare(`DELETE FROM categories WHERE id = ?`).run(id);
  res.json({ ok: true });
});

export default router;

import express from "express";
import { db } from "../db.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router = express.Router();

/**
 * Helpers
 */
const toInt = (v, def = null) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : def;
};

/**
 * PUBLIC: lista productos visibles
 * GET /api/products?category=<slug>&q=<text>
 */
router.get("/", (req, res) => {
  const { category, q } = req.query || {};

  let where = `p.isActive = 1`;
  const params = [];

  if (q && String(q).trim()) {
    where += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
    const term = `%${String(q).trim()}%`;
    params.push(term, term);
  }

  // category = slug
  if (category && String(category).trim()) {
    where += ` AND c.slug = ?`;
    params.push(String(category).trim());
  }

  const rows = db
    .prepare(
      `
      SELECT
        p.id,
        p.name,
        p.description,
        p.imageUrl,
        p.categoryId,
        p.isActive,
        c.name AS categoryName,
        c.slug AS categorySlug
      FROM products p
      LEFT JOIN categories c ON c.id = p.categoryId
      WHERE ${where}
      ORDER BY p.createdAt DESC
    `
    )
    .all(...params);

  res.json(rows);
});

/**
 * PUBLIC: detalle de producto (solo si activo)
 * GET /api/products/:id
 */
router.get("/:id", (req, res) => {
  const id = toInt(req.params.id);
  if (!id) return res.status(400).json({ message: "ID inválido" });

  const row = db
    .prepare(
      `
      SELECT
        p.id,
        p.name,
        p.description,
        p.imageUrl,
        p.categoryId,
        p.isActive,
        c.name AS categoryName,
        c.slug AS categorySlug
      FROM products p
      LEFT JOIN categories c ON c.id = p.categoryId
      WHERE p.id = ? AND p.isActive = 1
    `
    )
    .get(id);

  if (!row) return res.status(404).json({ message: "Producto no encontrado" });
  res.json(row);
});

/**
 * ADMIN: listar TODOS (activos/inactivos)
 * GET /api/products/admin
 */
router.get("/admin/list", requireAuth, requireAdmin, (req, res) => {
  const { q } = req.query || {};

  let where = `1=1`;
  const params = [];

  if (q && String(q).trim()) {
    where += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
    const term = `%${String(q).trim()}%`;
    params.push(term, term);
  }

  const rows = db
    .prepare(
      `
      SELECT
        p.id,
        p.name,
        p.description,
        p.imageUrl,
        p.categoryId,
        p.isActive,
        c.name AS categoryName,
        c.slug AS categorySlug
      FROM products p
      LEFT JOIN categories c ON c.id = p.categoryId
      WHERE ${where}
      ORDER BY p.createdAt DESC
    `
    )
    .all(...params);

  res.json(rows);
});

/**
 * ADMIN: detalle (incluye inactivos)
 * GET /api/products/admin/:id
 */
router.get("/admin/:id", requireAuth, requireAdmin, (req, res) => {
  const id = toInt(req.params.id);
  if (!id) return res.status(400).json({ message: "ID inválido" });

  const row = db
    .prepare(
      `
      SELECT
        p.id,
        p.name,
        p.description,
        p.imageUrl,
        p.categoryId,
        p.isActive,
        c.name AS categoryName,
        c.slug AS categorySlug
      FROM products p
      LEFT JOIN categories c ON c.id = p.categoryId
      WHERE p.id = ?
    `
    )
    .get(id);

  if (!row) return res.status(404).json({ message: "Producto no encontrado" });
  res.json(row);
});

/**
 * ADMIN: crear
 * POST /api/products
 */
router.post("/", requireAuth, requireAdmin, (req, res) => {
  const { name, description, imageUrl, categoryId, isActive } = req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: "El nombre es requerido" });
  }

  const catId = categoryId != null ? toInt(categoryId) : null;

  // si mandan categoryId, verificamos que exista
  if (catId) {
    const cat = db.prepare(`SELECT id FROM categories WHERE id = ?`).get(catId);
    if (!cat) return res.status(400).json({ message: "categoryId no existe" });
  }

  const active = isActive === false || isActive === 0 || isActive === "0" ? 0 : 1;

  const info = db
    .prepare(
      `
      INSERT INTO products (name, description, imageUrl, categoryId, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `
    )
    .run(
      String(name).trim(),
      description || null,
      imageUrl || null,
      catId || null,
      active
    );

  const created = db
    .prepare(
      `
      SELECT
        p.id, p.name, p.description, p.imageUrl, p.categoryId, p.isActive,
        c.name AS categoryName, c.slug AS categorySlug
      FROM products p
      LEFT JOIN categories c ON c.id = p.categoryId
      WHERE p.id = ?
    `
    )
    .get(info.lastInsertRowid);

  res.status(201).json(created);
});

/**
 * ADMIN: actualizar
 * PUT /api/products/:id
 */
router.put("/:id", requireAuth, requireAdmin, (req, res) => {
  const id = toInt(req.params.id);
  if (!id) return res.status(400).json({ message: "ID inválido" });

  const current = db.prepare(`SELECT * FROM products WHERE id = ?`).get(id);
  if (!current) return res.status(404).json({ message: "Producto no encontrado" });

  const { name, description, imageUrl, categoryId, isActive } = req.body || {};

  const nextName = name != null ? String(name).trim() : current.name;
  if (!nextName) return res.status(400).json({ message: "El nombre es requerido" });

  const catId = categoryId !== undefined ? (categoryId ? toInt(categoryId) : null) : current.categoryId;

  if (catId) {
    const cat = db.prepare(`SELECT id FROM categories WHERE id = ?`).get(catId);
    if (!cat) return res.status(400).json({ message: "categoryId no existe" });
  }

  const active =
    isActive !== undefined
      ? (isActive === false || isActive === 0 || isActive === "0" ? 0 : 1)
      : current.isActive;

  db.prepare(
    `
    UPDATE products
    SET name = ?, description = ?, imageUrl = ?, categoryId = ?, isActive = ?, updatedAt = datetime('now')
    WHERE id = ?
  `
  ).run(
    nextName,
    description !== undefined ? (description || null) : current.description,
    imageUrl !== undefined ? (imageUrl || null) : current.imageUrl,
    catId,
    active,
    id
  );

  const updated = db
    .prepare(
      `
      SELECT
        p.id, p.name, p.description, p.imageUrl, p.categoryId, p.isActive,
        c.name AS categoryName, c.slug AS categorySlug
      FROM products p
      LEFT JOIN categories c ON c.id = p.categoryId
      WHERE p.id = ?
    `
    )
    .get(id);

  res.json(updated);
});

/**
 * ADMIN: eliminar
 * DELETE /api/products/:id
 */
router.delete("/:id", requireAuth, requireAdmin, (req, res) => {
  const id = toInt(req.params.id);
  if (!id) return res.status(400).json({ message: "ID inválido" });

  const current = db.prepare(`SELECT id FROM products WHERE id = ?`).get(id);
  if (!current) return res.status(404).json({ message: "Producto no encontrado" });

  db.prepare(`DELETE FROM products WHERE id = ?`).run(id);
  res.json({ ok: true });
});

export default router;

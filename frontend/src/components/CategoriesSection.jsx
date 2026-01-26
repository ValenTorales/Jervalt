// src/components/CategoriesSection.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import CategoryCard from "./CategoryCard.jsx";

const MOCK_CATEGORIES = [
  {
    id: 1,
    name: "Materiales",
    slug: "materiales",
    imageUrl:
      "https://res.cloudinary.com/dxa7jp1ew/image/upload/v1769020854/materiales_msvfpu.jpg",
    description: "Cemento, cal, arena, ladrillos y más.",
  },
  {
    id: 2,
    name: "Hierros",
    slug: "hierros",
    imageUrl:
      "https://res.cloudinary.com/dxa7jp1ew/image/upload/v1769051902/herreria_s5h7wi.jpg",
    description: "Barras, mallas, alambres y estructuras.",
  },
  {
    id: 3,
    name: "Herramientas",
    slug: "herramientas",
    imageUrl:
      "https://res.cloudinary.com/dxa7jp1ew/image/upload/v1769021465/herramientas_pjkgx4.jpg",
    description: "Manuales para todo tipo de trabajo.",
  },
    {
    id: 4,
    name: "Productos Para Piscinas",
    slug: "piscinas",
    imageUrl:
      "https://res.cloudinary.com/dxa7jp1ew/image/upload/v1769021708/productos_unzvgx.jpg",
    description: "Cloro, pastillas, boyas y más accesorios.",
  },
      {
    id: 5,
    name: "Pintura",
    slug: "pintura",
    imageUrl:
      "https://res.cloudinary.com/dxa7jp1ew/image/upload/v1769052329/pintura_uvrdon.jpg",
    description: "Esmaltes, látex, esmaltes sintéticos y accesorios.",
  },
  {
    id: 6,
    name: "Electricidad",
    slug: "electricidad",
    imageUrl:
      "https://res.cloudinary.com/dxa7jp1ew/image/upload/v1769021177/electricidad_efnijo.jpg",
    description: "Cables, llaves, tomas, disyuntores y más.",
  },
];

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/categories"); // backend: GET /api/categories
        if (!alive) return;

        const list = Array.isArray(data) ? data : data?.items || [];
        setCategories(list);
        setUsingMock(false);
      } catch {
        if (!alive) return;
        setCategories(MOCK_CATEGORIES);
        setUsingMock(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return categories;

    return categories.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const desc = (c.description || "").toLowerCase();
      const slug = (c.slug || "").toLowerCase();
      return name.includes(term) || desc.includes(term) || slug.includes(term);
    });
  }, [categories, q]);

  return (
    <section className="section section--products container">
      <div className="section__head">
        <h2 className="section__title">Nuestros Productos</h2>
        <p className="section__desc">
          Elegí una categoría para ver el catálogo disponible
        </p>

        <div className="products-toolbar">
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar categoría..."
          />
          {usingMock && <span className="hint">Mostrando demo (backend no disponible)</span>}
        </div>
      </div>

      {loading ? (
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton card" />
          ))}
        </div>
      ) : (
        <div className="grid grid--3">
          {filtered.map((c) => (
            <CategoryCard key={c.id || c.slug || c.name} category={c} />
          ))}
        </div>
      )}
    </section>
  );
}

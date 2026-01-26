import { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import ProductCard from "./ProductCard.jsx";

const MOCK = [
  {
    id: 1,
    name: "Cemento Portland",
    description: "Bolsa de 50kg. Ideal para todo tipo de construcción.",
    imageUrl:
      "https://images.unsplash.com/photo-1628027481676-2c6f3feee3a2?auto=format&fit=crop&w=1400&q=80",
    categoryName: "Materiales",
  },
  {
    id: 2,
    name: "Hierro de Construcción",
    description: "Barras de hierro de 6mm a 25mm. Venta por unidad o tonelada.",
    imageUrl:
      "https://images.unsplash.com/photo-1541976590-713941681591?auto=format&fit=crop&w=1400&q=80",
    categoryName: "Materiales",
  },
  {
    id: 3,
    name: "Herramientas Eléctricas",
    description: "Taladros, amoladoras, sierras y más. Marcas reconocidas.",
    imageUrl:
      "https://images.unsplash.com/photo-1586864387789-628af9feed72?auto=format&fit=crop&w=1400&q=80",
    categoryName: "Herramientas",
  },
];

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/products"); // backend: GET /api/products
        if (!alive) return;

        const list = Array.isArray(data) ? data : data?.items || [];
        setProducts(list);
        setUsingMock(false);
      } catch {
        if (!alive) return;
        setProducts(MOCK);
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
    if (!term) return products;
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const cat = (p.categoryName || p.category?.name || "").toLowerCase();
      return name.includes(term) || desc.includes(term) || cat.includes(term);
    });
  }, [products, q]);

  return (
    <section className="section section--products container">
      <div className="section__head">
        <h2 className="section__title">Nuestros Productos</h2>
        <p className="section__desc">
          Contamos con un amplio stock de materiales de construcción y herramientas de las mejores marcas
        </p>

        <div className="products-toolbar">
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar producto o categoría..."
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
          {filtered.map((p) => (
            <ProductCard key={p.id || p.slug || p.name} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

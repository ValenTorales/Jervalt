// src/pages/CategoryProducts.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ProductCard from "../components/ProductCard.jsx";

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Cemento Portland",
    description: "Bolsa de 50kg. Ideal para todo tipo de construcción.",
    imageUrl:
      "https://images.unsplash.com/photo-1628027481676-2c6f3feee3a2?auto=format&fit=crop&w=1400&q=80",
    categorySlug: "materiales",
    categoryName: "Materiales",
  },
  {
    id: 2,
    name: "Hierro de Construcción",
    description: "Barras de hierro de 6mm a 25mm. Venta por unidad o tonelada.",
    imageUrl:
      "https://images.unsplash.com/photo-1541976590-713941681591?auto=format&fit=crop&w=1400&q=80",
    categorySlug: "hierros",
    categoryName: "Hierros",
  },
  {
    id: 3,
    name: "Taladro Percutor",
    description: "Taladro percutor para trabajos exigentes.",
    imageUrl:
      "https://images.unsplash.com/photo-1586864387789-628af9feed72?auto=format&fit=crop&w=1400&q=80",
    categorySlug: "herramientas",
    categoryName: "Herramientas",
  },
];

export default function CategoryProducts() {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState("");

  const flecha = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 20"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block" }}
    >
      <path d="M11 17h6l-4 -5l4 -5h-6l-4 5z" />
    </svg>
  );

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        // GET /api/products?category=materiales
        const { data } = await api.get("/products", { params: { category: slug } });
        if (!alive) return;

        const list = Array.isArray(data) ? data : data?.items || [];
        setProducts(list);
        setUsingMock(false);

        const first = list[0];
        setCategoryTitle(first?.categoryName || first?.category?.name || slug);
      } catch {
        if (!alive) return;

        const list = MOCK_PRODUCTS.filter((p) => p.categorySlug === slug);
        setProducts(list);
        setUsingMock(true);
        setCategoryTitle(list[0]?.categoryName || slug);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [slug]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products;

    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      return name.includes(term) || desc.includes(term);
    });
  }, [products, q]);

  const noResults = !loading && filtered.length === 0;

  return (
    <div className="app">
      <Navbar />

      <main className="section container">
        <div className="section__head">
          <h2 className="section__title" style={{ marginBottom: 6 }}>
            {categoryTitle || "Categoría"}
          </h2>

          <p className="section__desc">Productos disponibles en esta categoría.</p>

          <div className="products-toolbar">
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar producto..."
            />

            {usingMock && <span className="hint">Mostrando demo (backend no disponible)</span>}

            <Link
              to="/"
              className="btn"
              style={{
                marginBottom: 6,
                backgroundColor: "#0a234b",
                color: "#ffffff",
                padding: "10px 16px",
                borderRadius: "14px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center" }}>{flecha}</span>
              <span style={{ fontWeight: 800 }}>Volver</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton card" />
            ))}
          </div>
        ) : noResults ? (
          <div className="card" style={{ padding: 18, textAlign: "center" }}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>
              No contamos con ese producto
            </div>
            <div className="muted" style={{ lineHeight: 1.5 }}>
              Probá con otro nombre o revisá la categoría.
            </div>
          </div>
        ) : (
          <div className="grid grid--3">
            {filtered.map((p) => (
              <ProductCard key={p.id || p.slug || p.name} product={p} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import { resolveImageUrl } from "../../utils/resolveImage.js";

export default function AdminProducts() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products/admin/list");
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      alert(err?.response?.data?.message || "No se pudieron cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((p) => (p.name || "").toLowerCase().includes(term));
  }, [rows, q]);

  const onDelete = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await api.delete(`/products/${id}`);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || "No se pudo eliminar");
    }
  };

  const Thumb = ({ p }) => {
    const src =
      resolveImageUrl(p?.imageUrl) ||
      "https://via.placeholder.com/120?text=IMG";
    return <img className="admin-thumb" src={src} alt={p?.name || "Producto"} loading="lazy" />;
  };

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h2 className="admin-page__title">Productos</h2>
          <p className="admin-page__desc">Agregá, editá o eliminá productos del catálogo</p>
        </div>
        <Link className="btn btn--primary" to="/admin/productos/nuevo">
          + Nuevo producto
        </Link>
      </div>

      <div className="admin-page__tools">
        <input
          className="input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar producto..."
        />
      </div>

      <div className="card admin-table admin-table--mobileLike">
        <div className="admin-table__row admin-table__head admin-table--4">
          <div className="admin-col-center">Imagen</div>
          <div className="desktop-only admin-col-center">Nombre</div>
          <div className="admin-col-center">Categoría</div>
          <div className="admin-col-actions">Acciones</div>
        </div>

        {loading ? (
          <div className="admin-table__row admin-table--4">
            <div>Cargando...</div><div /><div /><div />
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-table__row admin-table--4">
            <div>No hay productos</div><div /><div /><div />
          </div>
        ) : (
          filtered.map((p) => (
            <div key={p.id} className="admin-table__row admin-table--4">
              <div className="admin-nameCell admin-imgCell">
                <img
                  className="admin-thumb"
                  src={resolveImageUrl(p.imageUrl) || "https://via.placeholder.com/120?text=IMG"}
                  alt={p.name}
                  loading="lazy"
                />
                <div className="mobile-only admin-nameText">{p.name}</div>
              </div>

              <div className="admin-nameOnly desktop-only">{p.name}</div>

              <div className="admin-catCell">{p.categoryName || "Sin categoría"}</div>

              <div className="admin-actionsRow">
                <Link className="btn btn--sm" to={`/admin/productos/${p.id}/editar`}>Editar</Link>
                <button className="btn btn--danger btn--sm" onClick={() => onDelete(p.id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

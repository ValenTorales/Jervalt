import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

export default function AdminCategories() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories"); // público, pero OK usarlo aquí también
      setRows(Array.isArray(data) ? data : []);
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
    return rows.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const slug = (c.slug || "").toLowerCase();
      return name.includes(term) || slug.includes(term);
    });
  }, [rows, q]);

  const onDelete = async (id) => {
    if (!confirm("¿Eliminar categoría?")) return;

    try {
      await api.delete(`/categories/${id}`); // protegido por token (interceptor)
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || "No se pudo eliminar");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h2 className="admin-page__title">Categorías</h2>
          <p className="admin-page__desc">Creá, editá o eliminá categorías del catálogo</p>
        </div>
        <Link className="btn btn--primary" to="/admin/categorias/nueva">
          + Nueva categoría
        </Link>
      </div>

      <div className="admin-page__tools">
        <input
          className="input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar categoría..."
        />
      </div>

      <div className="card admin-table">
        <div className="admin-table__row admin-table__head admin-table--cats">
          <div>Nombre</div>
          <div className="desktop-only ">Slug</div>
          <div className="admin-col-actions">Acciones</div>
        </div>

        {loading ? (
          <div className="admin-table__row">
            <div>Cargando...</div>
            <div />
            <div />
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-table__row">
            <div>No hay categorías</div>
            <div />
            <div />
          </div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="admin-table__row admin-table--cats">
              <div className="admin-cats-name w600">{c.name}</div>
              <div className="admin-cats-slug desktop-only ">{c.slug}</div>
              <div className="admin-cats-actions">
                <Link className="btn btn--sm w600" to={`/admin/categorias/${c.id}/editar`}>
                  Editar
                </Link>{" "}
                <button className="btn btn--danger btn--sm w600" onClick={() => onDelete(c.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

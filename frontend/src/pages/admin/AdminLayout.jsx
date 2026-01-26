import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "./auth";

export default function AdminLayout() {
  const nav = useNavigate();

  const logout = () => {
    clearToken();
    nav("/");
  };

  return (
    <div className="admin">
      <aside className="admin__side">
        <div className="admin__brand">
          <div className="admin__logo">🛠️</div>
          <div>
            <div className="admin__title">Admin</div>
            <div className="admin__sub">Ferretería & Corralón</div>
          </div>
        </div>

        <nav className="admin__nav">
          <Link className="admin__link" to="/admin/productos">
            Productos
          </Link>
          <Link className="admin__link" to="/admin/categorias">
            Categorías
          </Link>
        </nav>

        <button className="btn admin__logout" onClick={logout}>
          Salir
        </button>
      </aside>

      <section className="admin__main">
        <Outlet />
      </section>
    </div>
  );
}

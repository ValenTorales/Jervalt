import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "./auth";

export default function AdminLayout() {
  const logo = "https://res.cloudinary.com/dxa7jp1ew/image/upload/f_auto,q_auto/v1768591576/logo_umev31.jpg";

  const nav = useNavigate();

  const logout = () => {
    clearToken();
    nav("/");
  };

  return (
    <div className="admin">
      <aside className="admin__side">
        <div className="admin__brand">
          <div className="brand__logo" aria-hidden="true">
            <img src={logo} alt="Logo" className="brand__logo-img" />
          </div>
          <div>
            <div className="admin__title">Panel de Administrador</div>
            <div className="admin__sub">JERVALT</div>
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

const WA_PHONE = import.meta.env.VITE_WA_PHONE || "";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function waLink(message) {
  const phone = String(WA_PHONE).replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${text}`;
}

export default function Navbar() {
  const logo = "https://res.cloudinary.com/dxa7jp1ew/image/upload/f_auto,q_auto/v1768591576/logo_umev31.jpg"
  return (
    <header className="nav">
      <div className="nav__inner container">
        <div className="brand" onClick={() => scrollToId("top")} role="button" tabIndex={0}>
          <div className="brand__logo" aria-hidden="true">
            <img src={logo} alt="Logo" className="brand__logo-img" />
          </div>
          <div className="brand__text">
            <div className="brand__title">JERVALT</div>
            <div className="brand__sub">Corralón y Ferretería</div>
          </div>
        </div>

        <nav className="nav__links">
          <button className="nav__link" onClick={() => scrollToId("info")}>
            Información
          </button>
          <button className="nav__link" onClick={() => scrollToId("productos")}>
            Productos
          </button>
          <button className="nav__link" onClick={() => scrollToId("contacto")}>
            Contacto
          </button>
        </nav>

        <a
          className="btn btn--primary"
          href={waLink("Hola! Quiero hacer una consulta.")
          }
          target="_blank"
          rel="noreferrer"
        >
          Consultar
        </a>
      </div>
    </header>
  );
}

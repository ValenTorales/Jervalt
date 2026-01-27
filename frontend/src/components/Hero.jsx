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

export default function Hero() {
  const bg = "https://res.cloudinary.com/dxa7jp1ew/image/upload/f_auto,q_auto/v1768590644/frente_gca1fg.jpg"
  const flecha = <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="3 1 20 20"
    fill="none"
    stroke="#ffffff"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block" }}
  >
    <path d="M11 17h6l-4 -5l4 -5h-6l-4 5z" />
  </svg>;
  return (
    <section className="hero" style={{ backgroundImage: `url(${bg})` }}>
      <div className="hero__overlay" />
      <div className="hero__content container">
        <h1 className="hero__title">Todo lo que necesitás<br />para tu obra</h1>

        <p className="hero__subtitle">
          Materiales de construcción, herramientas profesionales y asesoramiento experto.
          Más de 5 años brindando soluciones para constructores y particulares.
        </p>

        <div className="hero__actions">
          <button className="btn btn--primary" onClick={() => scrollToId("productos")}>
            <span aria-hidden="true">{flecha}</span>Ver Productos 
          </button>

          <a
            className="btn btn--ghost"
            href={waLink("Hola! Quería contactarlos para una consulta general.")
            }
            target="_blank"
            rel="noreferrer"
          >
            Contactanos
          </a>
        </div>
      </div>
    </section>
  );
}

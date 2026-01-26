export default function Footer() {
  const logo = "https://res.cloudinary.com/dxa7jp1ew/image/upload/f_auto,q_auto/v1768591576/logo_umev31.jpg";
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <div className="brand__logo" aria-hidden="true">
            <img src={logo} alt="Logo" className="brand__logo-img" />
          </div>
          <div>
            <div className="footer__title">Jervalt</div>
            <div className="footer__sub">Corralón y Ferreteria</div>
          </div>
        </div>

        <div className="footer__copy">
          © {new Date().getFullYear()} Jervalt. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

export default function Contact() {

  const phone = <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b94813" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" >
    <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
    <path d="M15 6l2 2l4 -4" />
  </svg> ;
  const direccion = <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b94813" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" >
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M12 17l-1 -4l-4 -1l9 -4z" />
    </svg>;
  const meta = <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b94813" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" >
      <path d="M12 10.174c1.766 -2.784 3.315 -4.174 4.648 -4.174c2 0 3.263 2.213 4 5.217c.704 2.869 .5 6.783 -2 6.783c-1.114 0 -2.648 -1.565 -4.148 -3.652a27.627 27.627 0 0 1 -2.5 -4.174z" />
      <path d="M12 10.174c-1.766 -2.784 -3.315 -4.174 -4.648 -4.174c-2 0 -3.263 2.213 -4 5.217c-.704 2.869 -.5 6.783 2 6.783c1.114 0 2.648 -1.565 4.148 -3.652c1 -1.391 1.833 -2.783 2.5 -4.174z" />
    </svg>;
  const facebook = <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 21" fill="none" stroke="#160be0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" >
      <path d="M18 2h-3a5 5 0 0 0 -5 5v3h-3v4h3v8h4v-8h3.642l.358 -4h-4v-2a1 1 0 0 1 1 -1h3z" />
    </svg>;
  const instagram = <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 19" fill="none" stroke="#6427a5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" >
      <rect x="2" y="1" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1 -4.94 -4.94a4 4 0 0 1 4.94 4.94z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>;

  return (
    <section className="section container">
      <div className="section__head">
        <h2 className="section__title">Visitanos o Contactanos</h2>
        <p className="section__desc">Estamos para ayudarte con tu proyecto de construcción</p>
      </div>

      <div className="grid grid--3">
        <div className="card contact-card">
          <div className="contact-card__icon" aria-hidden="true">{phone}</div>
          <div className="contact-card__title">Teléfono</div>
          <div className="contact-card__text">
            +54 9 3454 11-8567  <br />
          </div>
        </div>

        <div className="card contact-card">
          <div className="contact-card__icon" aria-hidden="true">{direccion}</div>
          <div className="contact-card__title">Dirección</div>
          <div className="contact-card__text">
            Av. Juan Bautista Alberdi <br />
            La Criolla, Entre Ríos, Argentina
          </div>
        </div>

        <div className="card contact-card">
          <div className="contact-card__icon" aria-hidden="true">{meta}</div>
          <div className="contact-card__title">Redes Sociales</div>
          <div className="contact-card__text">
            {facebook} Jervalt Corralón <br />
            {instagram} jervarlt.corralon
          </div>
        </div>
      </div>
    </section>
  );
}

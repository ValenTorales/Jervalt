import WhyUsCard from "./WhyUsCard.jsx";

export default function WhyUs() {
  const hora = <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M12 7v5" />
    <path d="M12 12l2 -3" />
  </svg>

  const entrega = <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
    <path d="M3 9l4 0" />
  </svg>

  const telefono = <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" >
    <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
    <path d="M15 6l2 2l4 -4" />
  </svg>

  const ubicacion = <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" >
    <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0" />
    <path d="M12 2l0 2" />
    <path d="M12 20l0 2" />
    <path d="M20 12l2 0" />
    <path d="M2 12l2 0" />
  </svg>

  return (
    <section className="section container">
      <div className="section__head">
        <h2 className="section__title">¿Por qué elegirnos?</h2>
        <p className="section__desc">
          Más de 5 años de experiencia nos respaldan. Ofrecemos calidad, variedad y el mejor servicio.
        </p>
      </div>

      <div className="grid grid--4">
        <WhyUsCard icon={hora} title="Horarios Extendidos">
          Lunes a Sábados: 8:00 a 12:00hs y de 16:30 a 20:00hs<br />
        </WhyUsCard>

        <WhyUsCard icon={entrega} title="Entrega a Domicilio">
          Servicio de transporte propio para materiales pesados y grandes volúmenes
        </WhyUsCard>

        <WhyUsCard icon={telefono} title="Asesoramiento">
          Respondemos a tus consultas telefónicas y por WhatsApp de forma rápida y personalizada
        </WhyUsCard>

        <WhyUsCard icon={ubicacion} title="Ubicación Central">
          Fácil acceso y amplio estacionamiento para carga de materiales
        </WhyUsCard>
      </div>
    </section>
  );
}

// src/pages/Home.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import WhyUs from "../components/WhyUs.jsx";
import CategoriesSection from "../components/CategoriesSection.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const id = location.state?.scrollTo;
    if (!id) return;

    // pequeño delay para asegurar que el DOM ya renderizó
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, [location.state]);

  return (
    <div className="app" id="top">
      <Navbar />
      <main>
        <Hero />
        <section id="info">
          <WhyUs />
        </section>

        {/* antes: ProductsSection */}
        <section id="productos">
          <CategoriesSection />
        </section>

        <section id="contacto">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
}

// src/pages/Home.jsx
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import WhyUs from "../components/WhyUs.jsx";
import CategoriesSection from "../components/CategoriesSection.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
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

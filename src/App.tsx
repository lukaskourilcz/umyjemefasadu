import { useFadeUpReveal } from "./hooks/useFadeUpReveal";
import Landscape from "./components/Landscape";
import Nav from "./components/Nav";
import RevealHero from "./components/RevealHero";
import dirtyHero from "./assets/dirty-hero.webp";
import cleanHero from "./assets/clean-hero.webp";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import Services from "./components/Services";
import Process from "./components/Process";
import WhyUs from "./components/WhyUs";
import Stats from "./components/Stats";
import Team from "./components/Team";
import References from "./components/References";
import Pricing from "./components/Pricing";
import Advice from "./components/Advice";
import OrderProcess from "./components/OrderProcess";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CallBar from "./components/CallBar";

export default function App() {
  // Quiet, deliberate scroll reveals - disabled under reduced-motion via CSS.
  useFadeUpReveal();

  return (
    <>
      <Nav />
      <main>
        <RevealHero before={dirtyHero} after={cleanHero} />
        <Hero backdrop={<Landscape className="h-full w-full" />} />
        <TrustStrip />
        <Services />
        <Process />
        <WhyUs />
        <Stats />
        <Team />
        {/* Gallery (before/after sliders) is intentionally unmounted until real
            paired photos exist - see src/components/Gallery.tsx */}
        <References />
        <Pricing />
        <OrderProcess />
        <Faq />
        <Advice />
        <Contact />
      </main>
      <Footer />
      <CallBar />
    </>
  );
}

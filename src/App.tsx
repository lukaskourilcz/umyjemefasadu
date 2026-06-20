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
import Gallery from "./components/Gallery";
import Stats from "./components/Stats";
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
        <RevealHero
          before={dirtyHero}
          after={cleanHero}
          label=""
        />
        <Hero backdrop={<Landscape className="h-full w-full" />} />
        <TrustStrip />
        <Services />
        <Process />
        <WhyUs />
        <Gallery />
        <Stats />
        <OrderProcess />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <CallBar />
    </>
  );
}

import { useFadeUpReveal } from "./hooks/useFadeUpReveal";
import { useContent } from "./content";
import Landscape from "./components/Landscape";
import Nav from "./components/Nav";
import RevealHero from "./components/RevealHero";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import WhyClean from "./components/WhyClean";
import Risks from "./components/Risks";
import Services from "./components/Services";
import Process from "./components/Process";
import WhyUs from "./components/WhyUs";
import Stats from "./components/Stats";
import Team from "./components/Team";
import References from "./components/References";
import Pricing from "./components/Pricing";
import OrderProcess from "./components/OrderProcess";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CallBar from "./components/CallBar";
import PreviewBanner from "./components/PreviewBanner";

export default function App() {
  // Quiet, deliberate scroll reveals - disabled under reduced-motion via CSS.
  useFadeUpReveal();
  const { revealHero, stats, team } = useContent();

  return (
    <>
      <PreviewBanner />
      <Nav />
      <main>
        <RevealHero
          before={revealHero.beforeImage}
          after={revealHero.afterImage}
        />
        <Hero backdrop={<Landscape className="h-full w-full" />} />
        <TrustStrip />
        <WhyClean />
        <Risks />
        <Services />
        <Process />
        <WhyUs />
        {stats.visible && <Stats />}
        {team.visible && <Team />}
        {/* Gallery (before/after sliders) is intentionally unmounted until real
            paired photos exist - see src/components/Gallery.tsx */}
        <References />
        <Pricing />
        <OrderProcess />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <CallBar />
    </>
  );
}

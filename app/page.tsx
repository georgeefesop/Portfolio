import ProductHero from "@/components/sections/ProductHero";
import Intro from "@/components/sections/Intro";
import CredibilityBar from "@/components/sections/CredibilityBar";
import CaseStudies from "@/components/sections/CaseStudies";
import Testimonials from "@/components/sections/Testimonials";
import Gallery from "@/components/sections/Gallery";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Resources from "@/components/sections/Resources";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";

export default function Home() {
    return (
        <main className="flex flex-col min-h-screen bg-bg-primary">
            {/* 
        Hero is imported from previous part. 
        It has a black background which transitions to bg-primary (#0F0F0F) in the following sections.
      */}
            <ProductHero />
            <CredibilityBar />
            <Intro />
            <CaseStudies />
            <Testimonials />
            <Gallery />
            <Services />
            <Process />
            <Resources />
            <About />
            <Contact />
            <Footer />
        </main>
    );
}

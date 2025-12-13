import HeroSection from "../../components/HeroSection";
import HomeSection from "../../components/HomeSection";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <div className="bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <HeroSection />
      <HomeSection />
      <Footer />
    </div>
  );
}

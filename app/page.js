import LandingNav from '../components/landing/LandingNav';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import FinalCTA from '../components/landing/FinalCTA';
import LandingFooter from '../components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-nunito">
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}

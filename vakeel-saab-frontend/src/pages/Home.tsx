import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import FeatureCards from "../components/FeatureCards"
import WhyVakeelSaab from "../components/WhyVakeelSaab"
import BackgroundGlow from "../components/BackgroundGlow"
import Footer from "@/components/Footer"

export default function Home() {

  return (
    <div className="min-h-screen bg-black text-white relative">

      <BackgroundGlow />

      <Navbar />

      <Hero />

      <FeatureCards />

      <WhyVakeelSaab/>

      <Footer />
    </div>
  )

}
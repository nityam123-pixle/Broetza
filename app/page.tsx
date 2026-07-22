import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import VideoScrub from "@/components/VideoScrub";
import PostScript from "@/components/PostScript";
import StickySlider from "@/components/StickySlider";
import LocationsSection from "@/components/LocationsSection";
import FaqBreaker from "@/components/FaqBreaker";
import FaqSection from "@/components/FaqSection";
import ClosingPanel from "@/components/ClosingPanel";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

export default function Home() {
  return (
    <main>
      <Preloader />
      <Header />
      <VideoScrub />
      <PostScript />
      <StickySlider />
      <LocationsSection />
      <FaqBreaker />
      <FaqSection />
      <ClosingPanel />
      <Footer />
      <BookingModal />
    </main>
  );
}
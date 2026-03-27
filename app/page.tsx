import FaqSection from "@/components/HomePage/FaqSection/FaqSection";
import LectureSection from "@/components/HomePage/LectureSection/LectureSection";
import HeroSection from "@/components/HomePage/HeroSection/HeroSection";
import PaymentSection from "@/components/HomePage/PaymentSection/PaymentSection";

const Main = () => {
  return (
    <>
      <HeroSection />
      <FaqSection />
      <LectureSection />
      <PaymentSection />
    </>
  );
}

export default Main;
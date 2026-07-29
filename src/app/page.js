import Banner from "@/components/home/Banner";
import FeaturedDoctors from "@/components/home/FeaturedDoctors";
import Specializations from "@/components/home/Specializations";
import PlatformStats from "@/components/home/PlatformStats";
import Testimonials from "@/components/home/Testimonials";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Banner Section */}
      <Banner />

      {/* 2. Medical Specializations Section */}
      <Specializations />

      {/* 3. Featured Doctors Section */}
      <FeaturedDoctors />

      {/* 4. Platform Statistics Section */}
      <PlatformStats />

      {/* 5. Why Choose Us Section */}
      <WhyChooseUs />

      {/* 6. Patient Success Stories / Testimonials */}
      <Testimonials />
    </main>
  );
}
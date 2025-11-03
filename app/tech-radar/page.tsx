import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TechPill from "@/components/TechPill";

export default function TechRadar() {
  return (
    <main className="page-glow min-h-screen flex flex-col">
      <Header />
      <TechPill />
      <Footer />
    </main>
  );
}

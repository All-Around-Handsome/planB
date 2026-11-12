import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ children, footer = true }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="flex-1 flex flex-col">{children}</div>

      {footer && <Footer />}
    </div>
  );
}

export default MainLayout;

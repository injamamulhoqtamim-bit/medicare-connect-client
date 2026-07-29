import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import AuthProvider from "@/providers/AuthProvider";
import "./globals.css";

export const metadata = {
  title: "MediCare Connect - Hospital & Healthcare System",
  description: "Book doctor appointments and manage healthcare seamlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans text-slate-800 bg-white">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">{children}</div>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
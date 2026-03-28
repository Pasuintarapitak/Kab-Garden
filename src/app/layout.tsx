import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Providers } from "./components/SessionProvider";
const inter = Inter({ subsets: ["latin"] });
import { getServerSession } from "next-auth"; 
import Footer from "./components/Footer";
export const metadata = {
  title: "KABSHOP",
  description: "KABSHOP ONLINE",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession()
  return (
    <html lang="en">

      <body className={inter.className}>
        
        
        <Providers>
          <Navbar />
          {children}
          <Footer/>
        </Providers>
         
        
        </body>

    </html>
  );
}

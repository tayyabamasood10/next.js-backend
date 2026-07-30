import "./globals.css";
import Navbar from "./components/Navbar";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 flex flex-col min-h-screen">
        {/* <Navbar /> */}

        <main className="flex-grow">{children}</main>

        
      </body>
    </html>
  );
}





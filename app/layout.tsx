import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { CartProvider } from "@/context/cart-context";
import { OrderProvider } from "@/context/order-context";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "AI Revenue Recovery",
  description: "Identify revenue leaks and get AI-powered recommendations to grow your ecommerce store.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="font-sans antialiased bg-background text-foreground">
        <CartProvider>
          <OrderProvider>
            {children}
          </OrderProvider>
        </CartProvider>
      </body>
    </html>
  );
}

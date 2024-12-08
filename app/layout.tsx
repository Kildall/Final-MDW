import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import StoreProvider from "@/app/store-provider";
import { Navbar } from "@/components/ui/navbar/navbar";

const doto = localFont({
  src: "./fonts/doto-variable.ttf",
  variable: "--font-doto",
  weight: "100 900",
});
const spaceGrotesk = localFont({
  src: "./fonts/spacegrotesk-variable.ttf",
  variable: "--font-space-grotesk",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GVM Dashboard",
  description: "Dashboard para el control de GVM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${doto.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <StoreProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto p-4">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}

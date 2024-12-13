import "@/app/globals.css";
import StoreProvider from "@/app/store-provider";
import { ErrorToast } from "@/components/error-toast";
import { LoadingIndicator } from "@/components/loading-indicator";
import { SessionChecker } from "@/components/session-checker";
import { Navbar } from "@/components/ui/navbar/navbar";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import localFont from "next/font/local";

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
  title: {
    default: "GVM Dashboard",
    template: "%s | GVM Dashboard",
  },
  description: "Dashboard para el control de GVM",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "GVM Dashboard",
    description: "Dashboard para el control de GVM",
    url: "https://mdw.kildall.ar",
    siteName: "GVM Dashboard",
    locale: "es-AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${doto.variable} ${spaceGrotesk.variable} antialiased flex flex-col min-h-screen`}
      >
        <StoreProvider>
          <Navbar />
          <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4">
            {children}
          </main>
          <Toaster />
          <SessionChecker />
          <LoadingIndicator />
          <ErrorToast />
        </StoreProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

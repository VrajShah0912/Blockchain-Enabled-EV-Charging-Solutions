import type React from "react";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";  // Import the AuthProvider
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EV Charging Solution",
  description: "Blockchain-Enabled EV Charging Solution",
  generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap the whole app with AuthProvider to provide auth context */}
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <Header />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

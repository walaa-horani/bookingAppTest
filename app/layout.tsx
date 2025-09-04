import { IBM_Plex_Sans_Arabic, Readex_Pro, Rubik } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
 
} from '@clerk/nextjs'
import Provider from "./Provider";

const rubik = Rubik({
  subsets: ["arabic", "latin"],     
  weight: ["300","400","500","700","800","900"], 
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Schedule Your Consultation",
  description: "Reserve a 60-minute session to discuss your product, startup, or digital strategy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ar" dir="rtl" className={`${rubik.variable} antialiased`}>
      
      <body className="font-sans antialiased">
     
       
        <Provider>
          
        {children}
        </Provider>
      </body>
    </html>
    </ClerkProvider>
  );
}

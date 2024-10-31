import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { NextUIProvider } from "@nextui-org/react";
import Header from "./Header";
import { Orbitron,Pixelify_Sans } from "next/font/google";
import { Metadata } from "next";
import  { Toaster } from 'react-hot-toast';

export const PixelifySans = Pixelify_Sans({ subsets: ["cyrillic"] });
const orbitron = Orbitron({ subsets: ["latin"] });

// export const metadata: Metadata = {
// 	title: 'DcentraBids',
// 	description: 'A platform to buy anything on auction.',
// 	icons: {
// 		icon: "/favicon.ico"
// 	}
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     
      <body
        className={`${orbitron.className} min-h-screen light bg-white antialiased`}
      >
         <NextUIProvider>
         <ThirdwebProvider>
        <div className="relative flex flex-col pb-10 w-full">
				<Header />
				<main className="relative">
					<div className="container mx-auto w-full px-6 relative">
						{children}
					</div>
				</main>

			</div>
      <Toaster/>
        </ThirdwebProvider>
        </NextUIProvider>
      </body>
     
    </html>
  );
}

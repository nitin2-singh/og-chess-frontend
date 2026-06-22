import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import WebsiteNavbar from "@/components/website/navbar";
import { Toaster } from "sonner";

// 2. Configure a monospace font for chess notation/engine stats
const fontMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OgChess | Multiplayer Chess",
  description: "Play real-time multiplayer chess with modern UI and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Add suppressHydrationWarning if you are using next-themes for dark mode!
      suppressHydrationWarning
    >
      <body
        className={`${fontMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <WebsiteNavbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import { Notification } from "@/components/ui/Notification";
import { LanguageProvider } from "@/components/i18n/LanguageSwitcher";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME || 'TodoApp'} - Modern Task Management`,
  description: "A modern and vibrant todo application to help you organize your life and increase productivity.",
  metadataBase: new URL("https://todoapp.example.com"),
  keywords: "todo, task management, productivity, organizer, tasks, checklist",
  authors: [{ name: `${process.env.NEXT_PUBLIC_APP_NAME || 'TodoApp'} Team` }],
  creator: `${process.env.NEXT_PUBLIC_APP_NAME || 'TodoApp'} Team`,
  publisher: `${process.env.NEXT_PUBLIC_APP_NAME || 'TodoApp'} Team`,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    url: "https://todoapp.example.com",
    title: `${process.env.NEXT_PUBLIC_APP_NAME || 'TodoApp'} - Modern Task Management`,
    description: "A modern and vibrant todo application to help you organize your life and increase productivity.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${process.env.NEXT_PUBLIC_APP_NAME || 'TodoApp'} - Modern Task Management`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${process.env.NEXT_PUBLIC_APP_NAME || 'TodoApp'} - Modern Task Management`,
    description: "A modern and vibrant todo application to help you organize your life and increase productivity.",
    images: ["/images/twitter-image.jpg"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
              <MainLayout>
                {children}
                <Notification />
              </MainLayout>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

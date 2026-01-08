import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import { Notification } from "@/components/ui/Notification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TodoApp - Modern Task Management",
  description: "A modern and vibrant todo application to help you organize your life and increase productivity.",
  keywords: "todo, task management, productivity, organizer, tasks, checklist",
  authors: [{ name: "TodoApp Team" }],
  creator: "TodoApp Team",
  publisher: "TodoApp Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    url: "https://todoapp.example.com",
    title: "TodoApp - Modern Task Management",
    description: "A modern and vibrant todo application to help you organize your life and increase productivity.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TodoApp - Modern Task Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TodoApp - Modern Task Management",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MainLayout>
            {children}
            <Notification />
          </MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}

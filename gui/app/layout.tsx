import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Macy's Campaign Command Center",
  description: "GenAI marketing operations platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full" style={{ backgroundColor: "#F9F6F1", color: "#2C2C2C" }}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Humble Book Bundle Score",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="px-4 py-10 max-w-3xl mx-auto">
          <h1 className="text-4xl mb-8">Humble Book Bundle Score</h1>
          {children}
        </div>
      </body>
    </html>
  );
}

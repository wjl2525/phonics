import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qihang Phonics Lab",
  description: "Help kids build strong phonics foundations by connecting letters, sounds, words, and images",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔤</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

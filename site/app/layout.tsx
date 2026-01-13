import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://crystal-web-framework-stars.vercel.app'),
  title: "Top Crystal Web Frameworks",
  description: "A list of popular github projects related to Crystal web framework (ranked by stars automatically)",
  openGraph: {
    title: "Top Crystal Web Frameworks",
    description: "A list of popular github projects related to Crystal web framework (ranked by stars automatically)",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Top Crystal Web Frameworks",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Crystal Web Frameworks",
    description: "A list of popular github projects related to Crystal web framework (ranked by stars automatically)",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

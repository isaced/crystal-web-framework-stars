import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Top Crystal Web Frameworks",
  description: "A list of popular github projects related to Crystal web framework (ranked by stars automatically)",
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

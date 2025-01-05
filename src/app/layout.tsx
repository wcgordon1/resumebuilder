import "globals.css";
import { TopNavBar } from "components/TopNavBar";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "lib/context/AuthContext";

export const metadata = {
  title: "Prosper.cv - Resume Builder and Parser to help you get hired",
  description:
    "Prosper.cv is a free, open-source, and powerful resume builder that allows anyone to create a modern professional resume in 3 simple steps. For those who have an existing resume, Prosper.cv also provides a resume parser to help test and confirm its ATS readability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TopNavBar />
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}

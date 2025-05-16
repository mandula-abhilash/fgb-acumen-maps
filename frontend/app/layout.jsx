import "./globals.css";

import { AuthProvider } from "@/visdak-auth/src/components/AuthProvider";

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  metadataBase: new URL("https://opportunities.fgbacumen.com/"),
  title: {
    default: "FGB Acumen - Opportunities Hub",
    template: "%s | FGB Acumen",
  },
  description:
    "Explore live development projects, including Section 106 and grant-funded schemes, with FGB Acumen's Opportunities Hub. Designed for Registered Providers (Housing Associations), our platform offers tailored opportunities, expert insights, and essential tools to streamline affordable housing delivery across the UK.",
  keywords: [
    "affordable housing",
    "housing associations",
    "registered providers",
    "Section 106 opportunities",
    "grant-funded housing",
    "housing development projects",
    "affordable housing schemes",
    "community housing",
    "social housing opportunities",
    "housing investment UK",
    "property development UK",
  ],
  authors: [{ name: "FGB Acumen" }],
  creator: "FGB Acumen",
  publisher: "FGB Acumen",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://opportunities.fgbacumen.com/",
    title: "FGB Acumen - Opportunities Hub",
    description: `Explore live development projects, including Section 106 and grant-funded schemes, with FGB Acumen's Opportunities Hub. Designed for Registered Providers (Housing Associations), our platform offers tailored opportunities, expert insights, and essential tools to streamline affordable housing delivery across the UK.`,
    siteName: "FGB Acumen - Opportunities Hub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FGB Acumen - Opportunities Hub | Affordable Housing Development Insights & Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FGB Acumen - Site Opportunities Hub",
    description:
      "Explore live development projects, including Section 106 and grant-funded schemes, with FGB Acumen's Opportunities Hub. Designed for Registered Providers (Housing Associations), our platform offers tailored opportunities, expert insights, and essential tools to streamline affordable housing delivery across the UK.",
    images: ["/twitter-image.jpg"],
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

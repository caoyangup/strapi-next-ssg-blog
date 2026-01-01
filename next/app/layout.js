import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import apiClient, { api } from "@/lib/strapi/client";
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default async function RootLayout({ children }) {
  const globalData = await api.global.find({
    populate: [
      'navbar.logo',
      'navbar.logoDark',
      'navbar.nav.subItems',
      'navbar.navMobile.subItems',
      'footer.logo',
      'footer.logoDark',
      'footer.nav.subItems',
    ],
  });
  const { footer, navbar } = globalData.data
  return (
    <html lang="zh-Hans" suppressHydrationWarning>
      <body className="selection:bg-primary selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar data={navbar} />
          {children}
          <Footer data={footer} />
        </ThemeProvider>
      </body>
    </html>
  );
}

export async function generateMetadata() {
  const globalData = await await api.global.find();
  return globalData.data.metadataNextLayout || { title: 'Default Title', description: 'Default Description' };
}

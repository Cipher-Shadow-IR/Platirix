import "../styles/globals.css";
import { ToastProvider } from "../components/Toast";
import ThemeToggle from "../components/ThemeToggle";

export const metadata = {
  title: "Platirix — Food Ordering Platform",
  description: "Order delicious food online with Platirix",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem("theme");
                var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (theme === "dark" || (!theme && prefersDark)) {
                  document.documentElement.classList.add("dark");
                }
              } catch(e) {}
            })();
          `
        }} />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fbfbfa] dark:bg-[#0f0f0f] transition-colors duration-300">
        <ToastProvider>
          <header className="bg-[#fbfbfa] dark:bg-[#0f0f0f] border-b border-neutral-200/50 dark:border-neutral-800/50 transition-colors duration-300">
            <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
              <a href="/" className="text-2xl font-bold text-brand-600 dark:text-brand-400 font-serif tracking-tight transition-colors duration-300">Platirix</a>
              <div className="flex items-center gap-6">
                <div className="flex gap-8 text-sm font-medium">
                  <a href="/" className="text-gray-600 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-300">Menu</a>
                  <a href="/cart" className="text-gray-600 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-300">Cart</a>
                  <a href="/orders" className="text-gray-600 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-300">Orders</a>
                </div>
                <ThemeToggle />
              </div>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="bg-[#fbfbfa] dark:bg-[#0f0f0f] border-t border-neutral-200/50 dark:border-neutral-800/50 py-8 text-center text-sm text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
            &copy; {new Date().getFullYear()} Platirix. All rights reserved.
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}

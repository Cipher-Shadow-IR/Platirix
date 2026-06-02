import "../styles/globals.css";
import { ToastProvider } from "../components/Toast";

export const metadata = {
  title: "Platirix — Food Ordering Platform",
  description: "Order delicious food online with Platirix",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ToastProvider>
          <header className="bg-white shadow-sm border-b">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <a href="/" className="text-2xl font-bold text-brand-600">Platirix</a>
              <div className="flex gap-6">
                <a href="/" className="hover:text-brand-600 transition">Menu</a>
                <a href="/cart" className="hover:text-brand-600 transition">Cart</a>
                <a href="/orders" className="hover:text-brand-600 transition">Orders</a>
              </div>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Platirix. All rights reserved.
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}

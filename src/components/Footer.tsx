export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🎮</span>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Gaming Store
              </h3>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Platform top up game terpercaya di Indonesia. Kami menyediakan
              layanan top up untuk berbagai game populer dengan harga terbaik
              dan proses yang cepat.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-green-400">
                <span>✅</span>
                <span className="text-sm">Legal & Aman</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <span>🕒</span>
                <span className="text-sm">24/7 Service</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Game Populer
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Cara Top Up
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Riwayat Transaksi
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Live Chat
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <h4 className="font-semibold text-white mb-4 text-center">
            Metode Pembayaran
          </h4>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              "DANA",
              "OVO",
              "GoPay",
              "ShopeePay",
              "QRIS",
              "BCA",
              "BNI",
              "BRI",
              "Mandiri",
              "Alfamart",
              "Indomaret",
            ].map((payment) => (
              <div
                key={payment}
                className="bg-gray-800/50 px-3 py-2 rounded-lg text-sm font-medium text-gray-200 border border-gray-600/30"
              >
                {payment}
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-border/50">
          <p className="text-gray-300 text-sm">
            © 2024 Gaming Store. All rights reserved. |
            <span className="text-purple-400"> Made with ❤️ for Gamers</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

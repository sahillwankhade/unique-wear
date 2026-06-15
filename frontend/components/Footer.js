import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#070708] text-gray-400 border-t border-white/5 pt-16 pb-8 mt-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-extrabold uppercase tracking-widest text-gold-gradient">
              Unique Wear
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed pt-2">
              Elevate your street presence with our custom Champagne Gold collections. Modern aesthetics, tailored specifically for the bold.
            </p>
          </div>

          {/* Quick Links Col */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products" className="hover:text-gold transition duration-200">
                  Shop Collection
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-gold transition duration-200">
                  Shop Categories
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-gold transition duration-200">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Col */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Kariya Hospital, Jajoo Chouk, Yavatmal, Maharashtra 445001</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contact@uniquewear.com</span>
              </li>
            </ul>
          </div>

          {/* Social Links Col */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Follow Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/unique_._wear?igsh=MW83ZHI4aXR0d3Q2Zg=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gold transition duration-200"
                title="Instagram Redirect"
              >
                <span className="w-10 h-10 rounded-full border border-white/10 hover:border-gold hover:text-gold flex items-center justify-center transition duration-300 bg-white/5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </span>
                <span className="font-bold">@unique_._wear</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 text-center text-xs text-gray-600 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {currentYear} Unique Wear E-Commerce. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

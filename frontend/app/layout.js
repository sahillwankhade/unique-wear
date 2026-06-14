import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Unique Wear | Premium Modern Fashion',
  description: 'Shop the latest premium fashion at Unique Wear.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
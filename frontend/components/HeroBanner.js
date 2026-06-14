import Link from 'next/link';

export default function HeroBanner() {
  return (
    <div className="relative bg-black h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070')] bg-cover bg-center"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">ELEVATE YOUR STYLE</h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">Discover the premium collection of modern fashion. Designed for the unique you.</p>
        <Link href="/products" className="bg-gold text-black px-8 py-4 text-lg font-bold uppercase tracking-widest hover:bg-gold-light transition">Shop Collection</Link>
      </div>
    </div>
  );
}
import Link from 'next/link';

export default function HeroBanner() {
  return (
    <div className="relative bg-[#070708] h-[650px] flex items-center justify-center overflow-hidden">
      {/* Background Graphic & Texture overlay */}
      <div className="absolute inset-0 opacity-35 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070')] bg-cover bg-center scale-105 filter saturate-50"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-black/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,90,0.1)_0%,transparent_70%)]"></div>

      {/* Decorative lines/circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gold/5 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gold/10 blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <span className="text-gold text-xs md:text-sm font-extrabold uppercase tracking-[0.3em] mb-4 inline-block drop-shadow-md">
          New Season Collection 2026
        </span>
        <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tight uppercase leading-none">
          Elevate Your <span className="text-gold-gradient">Style</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          Experience the intersection of modern minimalist streetwear and premium gold aesthetics. Designed specifically for the unique you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            href="/products" 
            className="btn-gold py-4 px-8 text-sm rounded-full shadow-[0_0_20px_rgba(197,168,90,0.3)] hover:shadow-[0_0_30px_rgba(197,168,90,0.6)] hover:scale-105 active:scale-100 transition duration-300 w-full sm:w-auto"
          >
            Shop Collection
          </Link>
          <Link 
            href="/categories" 
            className="text-white hover:text-gold border border-white/20 hover:border-gold py-4 px-8 text-sm font-bold uppercase tracking-widest rounded-full transition duration-300 backdrop-blur-sm w-full sm:w-auto"
          >
            Explore Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
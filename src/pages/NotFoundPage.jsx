import { Link } from 'react-router-dom';
import { Compass, Home, Search, ArrowRight } from 'lucide-react';
import { BRAND } from '../data/brand';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#111A2C] border border-[#223049] rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center mb-6 shadow-inner">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
          Error 404
        </span>
        <h1 className="text-2xl font-bold text-white mt-2 mb-3">Page Not Found</h1>
        <p className="text-xs text-slate-400 leading-relaxed mb-8">
          The requested route does not exist or has been relocated within {BRAND.name} catalog.
        </p>

        <div className="space-y-3">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Store Home</span>
          </Link>
          <Link
            to="/catalog"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B1220] border border-[#223049] hover:border-slate-500 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};

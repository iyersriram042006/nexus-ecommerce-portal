import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';

export const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs text-slate-400">Verifying merchant credentials...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto my-20 p-8 rounded-2xl bg-[#111A2C] border border-[#223049] text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Merchant Privileges Required</h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Your current account (<span className="text-slate-200">{user.email}</span>) has the{' '}
          <strong className="text-blue-400">customer</strong> role. Access to the Admin Command Center requires an{' '}
          <strong className="text-amber-400">admin</strong> role assigned in the Firestore <code className="text-xs bg-[#0B1220] px-1.5 py-0.5 rounded border border-[#223049] text-slate-300">users/{user.uid}.role == &quot;admin&quot;</code> record.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Store Home</span>
        </Link>
      </div>
    );
  }

  return children;
};

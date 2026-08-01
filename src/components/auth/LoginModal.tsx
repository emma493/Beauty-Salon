import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ShieldCheck, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const LoginModal: React.FC = () => {
  const { login, settings, currentRoleView, setCurrentRoleView } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isAdminPortal = currentRoleView === 'admin';

  // Keep state in sync with URL on mount / path check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathIsAdmin = window.location.pathname.toLowerCase().startsWith('/admin');
      if (pathIsAdmin && currentRoleView !== 'admin') {
        setCurrentRoleView('admin');
      } else if (!pathIsAdmin && currentRoleView !== 'user') {
        setCurrentRoleView('user');
      }
    }
  }, []);

  const handleTabChange = (role: 'admin' | 'user') => {
    setCurrentRoleView(role);
    if (typeof window !== 'undefined') {
      const targetPath = role === 'admin' ? '/admin' : '/';
      window.history.pushState({}, '', targetPath);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  const logoUrl =
    settings.companyLogoUrl ||
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPMa5VhqKVOgQMYbb5sZBdxxb4PGZc0kSiLC3iTRgQWA&s=10';

  return (
    <div className="min-h-screen w-full bg-[#E3E5ED] dark:bg-slate-950 flex items-center justify-center p-4 sm:p-8 font-sans">
      {/* Main Split Card Container */}
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[560px]">
        
        {/* Left Form Panel */}
        <div className="p-8 sm:p-12 flex flex-col justify-between space-y-6 bg-white dark:bg-slate-900">
          {/* Brand Header & Portal Selector Tabs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-9 h-9 rounded-full object-cover shadow-xs border border-slate-100 dark:border-slate-800"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {settings.shopName || 'Beauty Salon'}
                </span>
              </div>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                  isAdminPortal
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-700/50'
                    : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-700/50'
                }`}
              >
                {isAdminPortal ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5" /> Staff
                  </>
                )}
              </span>
            </div>

            {/* Role Switcher Tabs */}
            <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleTabChange('user')}
                className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  !isAdminPortal
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Worker Login
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('admin')}
                className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isAdminPortal
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Login
              </button>
            </div>
          </div>

          {/* Mobile Art Header (Only visible on small screens) */}
          <div className="md:hidden flex flex-col items-center justify-center my-1">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 shadow-md flex items-center justify-center">
              <img
                src={logoUrl}
                alt="Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Form Content Area */}
          <div className="max-w-sm w-full mx-auto space-y-5 my-auto">
            <div className="space-y-1 text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {isAdminPortal ? 'Admin Portal' : 'Worker Portal'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                {isAdminPortal
                  ? 'Sign in with your administrator account to access store controls and reports.'
                  : 'Sign in with your worker account to process sales and manage inventory.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isAdminPortal ? 'admin@grocery.com' : 'worker@grocery.com'}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#486B1C] focus:border-transparent transition shadow-2xs"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#486B1C] focus:border-transparent transition shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#486B1C] hover:bg-[#3b5817] text-white font-semibold text-sm rounded-xl shadow-xs transition-all duration-150 active:scale-[0.99] mt-2 cursor-pointer"
              >
                {isAdminPortal ? 'Sign In as Administrator' : 'Sign In as Worker'}
              </button>
            </form>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            {isAdminPortal ? (
              <span>Not an admin? <button type="button" onClick={() => handleTabChange('user')} className="text-[#486B1C] font-bold underline cursor-pointer">Switch to Worker Login</button></span>
            ) : (
              <span>Administrator? <button type="button" onClick={() => handleTabChange('admin')} className="text-[#486B1C] font-bold underline cursor-pointer">Switch to Admin Login</button></span>
            )}
          </div>
        </div>

        {/* Right Art Panel (Desktop) */}
        <div className="hidden md:flex bg-[#F8F9FD] dark:bg-slate-800/40 border-l border-slate-100 dark:border-slate-800/50 items-center justify-center p-8 relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-72 h-72 bg-[#486B1C]/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Centered Full Logo Card */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Soft Glow ring around card */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#486B1C]/20 via-lime-300/30 to-emerald-400/20 rounded-[32px] blur-xl opacity-75"></div>

            {/* Logo Badge Container */}
            <div className="relative w-56 h-56 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02]">
              <img
                src={logoUrl}
                alt={settings.shopName || 'Company Logo'}
                className="w-full h-full object-contain drop-shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};



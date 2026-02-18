
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, role, userName }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('aa_current_user');
    navigate('/login');
  };

  const navItems = {
    [UserRole.ADMIN]: [
      { name: 'Dashboard', icon: 'fa-chart-line', path: '/admin' },
    ],
    [UserRole.ADVOCATE]: [
      { name: 'Overview', icon: 'fa-home', path: '/advocate' },
      { name: 'Cases', icon: 'fa-briefcase', path: '/advocate/cases' },
      { name: 'Appointments', icon: 'fa-calendar-check', path: '/advocate/appointments' },
      { name: 'AI Assistant', icon: 'fa-robot', path: '/advocate/ai' },
    ],
    [UserRole.CLIENT]: [
      { name: 'Dashboard', icon: 'fa-user', path: '/client' },
      { name: 'Find Advocate', icon: 'fa-search', path: '/client/search' },
      { name: 'My Cases', icon: 'fa-folder-open', path: '/client/cases' },
    ],
    [UserRole.JUNIOR]: [
        { name: 'My Tasks', icon: 'fa-tasks', path: '/junior' }
    ]
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-[#021208] border-r border-emerald-900/40 flex flex-col p-6">
        <div className="mb-12 flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#48f520] rounded-lg flex items-center justify-center">
            <i className="fas fa-balance-scale text-[#021208] text-sm"></i>
          </div>
          <h1 className="text-lg font-black text-white tracking-tighter uppercase">
            Advocate<span className="text-[#48f520]">Auto</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems[role]?.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                location.pathname === item.path
                  ? 'bg-[#48f520] text-[#021208] font-black shadow-[0_0_20px_rgba(72,245,32,0.2)]'
                  : 'text-gray-400 hover:text-white hover:bg-emerald-950/20'
              }`}
            >
              <i className={`fas ${item.icon} text-lg w-6`}></i>
              <span className="text-xs uppercase tracking-[0.15em] font-black">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-emerald-900/30">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-[#48f520]/20 flex items-center justify-center">
              <span className="text-[#48f520] font-black">{userName.charAt(0)}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white uppercase tracking-wider truncate">{userName}</p>
              <p className="text-[10px] text-emerald-500 uppercase tracking-[0.2em]">{role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-red-400 hover:bg-red-950/20 transition-all text-[10px] uppercase font-black tracking-widest"
          >
            <i className="fas fa-power-off"></i>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="h-20 flex items-center justify-between px-10 bg-[#021208]/80 backdrop-blur-xl border-b border-emerald-900/30 sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-4 bg-[#48f520] rounded-full"></div>
            <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">
                {navItems[role]?.find(item => item.path === location.pathname)?.name || 'Portal'}
            </h2>
          </div>
          <div className="flex items-center space-x-6">
             <div className="text-right">
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">System Status</p>
                <p className="text-[10px] text-[#48f520] font-black uppercase tracking-widest flex items-center justify-end">
                    <span className="w-1.5 h-1.5 bg-[#48f520] rounded-full mr-2 animate-pulse"></span>
                    Online
                </p>
             </div>
             <div className="w-10 h-10 rounded-full border border-emerald-900/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer">
                <i className="fas fa-bell"></i>
             </div>
          </div>
        </header>
        <div className="p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

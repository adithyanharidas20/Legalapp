
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../database';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const users = db.getUsers();
    const user = users.find(u => u.email === email);

    if (user) {
      if (email === 'admin@gmail.com' && password !== 'admin@123') {
        setError('Invalid admin credentials');
        return;
      }
      
      if (user.role === 'advocate' && !user.isApproved) {
        setError('Your account is awaiting admin approval');
        return;
      }

      localStorage.setItem('aa_current_user', JSON.stringify(user));
      
      switch (user.role) {
        case 'admin': navigate('/admin'); break;
        case 'advocate': navigate('/advocate'); break;
        case 'client': navigate('/client'); break;
        case 'junior': navigate('/junior'); break;
      }
    } else {
      setError('Account not found. Please register or check credentials.');
    }
  };

  const quickSwitch = (role: 'admin' | 'advocate') => {
    if (role === 'admin') {
      setEmail('admin@gmail.com');
      setPassword('admin@123');
    } else {
      const advocate = db.getUsers().find(u => u.role === 'advocate' && u.isApproved);
      if (advocate) {
        setEmail(advocate.email);
        setPassword('password123');
      } else {
        setError('No approved advocates found in database yet.');
      }
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#021208]">
      {/* Left Section: 60% Width - Enhanced Advocate Mascot */}
      <div className="hidden lg:flex lg:w-[60%] relative items-center justify-center overflow-hidden bg-[#021208]">
        
        {/* Unified Background Layers */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-10" 
          style={{ 
            backgroundImage: 'linear-gradient(#48f520 1px, transparent 1px), linear-gradient(90deg, #48f520 1px, transparent 1px)', 
            backgroundSize: '80px 80px' 
          }}
        ></div>
        
        {/* Cinematic Lighting & Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#48f520]/5 via-transparent to-transparent blur-[160px] rounded-full z-0 animate-pulse-slow"></div>

        {/* Dynamic Tech Rings */}
        <div className="absolute w-[600px] h-[600px] border border-emerald-500/10 rounded-full z-5 animate-spin-slow"></div>
        <div className="absolute w-[450px] h-[450px] border border-dashed border-emerald-400/5 rounded-full z-5 animate-spin-reverse-slow"></div>
        <div className="absolute w-[300px] h-[300px] border border-[#48f520]/10 rounded-full z-5 blur-sm animate-pulse-slow"></div>

        {/* Advocate Mascot Image Container */}
        <div className="relative z-20 flex flex-col items-center">
          <div className="relative group">
            {/* Holographic Underglow */}
            <div className="absolute -inset-8 bg-gradient-to-t from-[#48f520]/15 to-transparent blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <img 
              src="law.png" 
              alt="Advocate Mascot"
              className="w-[520px] h-auto drop-shadow-[0_45px_70px_rgba(0,0,0,1)] animate-float pointer-events-none z-30 relative"
              onError={(e) => {
                // If law.png is missing, we try the known character URL as fallback
                (e.target as HTMLImageElement).src = "https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/legal-advocate-mascot.png";
              }}
            />

            {/* Glitch/Laser Effects */}
            <div className="absolute top-[20%] -left-16 w-32 h-[1px] bg-gradient-to-r from-transparent via-[#48f520]/40 to-transparent animate-glitch-line"></div>
            <div className="absolute bottom-[30%] -right-16 w-32 h-[1px] bg-gradient-to-r from-transparent via-[#48f520]/40 to-transparent animate-glitch-line-delayed"></div>
          </div>
          
          {/* Identity Tag & Status */}
          <div className="mt-10 text-center animate-fade-in-up">
            <div className="inline-flex items-center space-x-3 px-6 py-2 rounded-full bg-emerald-950/40 border border-[#48f520]/20 backdrop-blur-md mb-4 shadow-xl">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#48f520] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#48f520]"></span>
              </span>
              <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.4em]">Neural Uplink Active</span>
            </div>
            <h3 className="text-4xl font-black text-white uppercase tracking-[0.25em] drop-shadow-2xl">
              ADVOCATE<span className="text-[#48f520]">AUTO</span>
            </h3>
            <p className="text-[10px] text-emerald-900 font-black uppercase tracking-[0.6em] mt-3">
              Professional Grade Legal Intelligence
            </p>
          </div>
        </div>

        {/* Scanning Effect */}
        <div className="absolute inset-x-0 top-0 h-[6px] bg-gradient-to-r from-transparent via-[#48f520]/15 to-transparent animate-scan z-40 pointer-events-none"></div>
        
        {/* Terminal Text Overlays */}
        <div className="absolute bottom-12 left-12 font-mono text-[9px] text-emerald-900/40 uppercase tracking-[0.4em] z-30">
          Root: Secure // Version: 4.12.0 // Node: 8
        </div>
        <div className="absolute top-12 right-12 font-mono text-[9px] text-emerald-900/40 uppercase tracking-[0.4em] z-30 text-right">
          LATENCY: 2.1ms // PING: OK
        </div>
      </div>

      {/* Right Section: 40% Width - Login Panel */}
      <div className="w-full lg:w-[40%] flex flex-col items-center justify-center p-8 sm:p-20 bg-[#021208] relative z-50 shadow-[0_0_120px_rgba(0,0,0,1)] border-l border-emerald-900/30">
        <div className="w-full max-w-md fade-in">
          
          <div className="mb-14 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-8">
                <div className="w-12 h-12 bg-[#48f520] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(72,245,32,0.5)] rotate-3">
                    <i className="fas fa-fingerprint text-black text-2xl"></i>
                </div>
                <h1 className="text-xl font-black text-white uppercase tracking-[0.4em]">Vault<span className="text-[#48f520]">Sec</span></h1>
            </div>
            <h2 className="text-5xl font-black text-white mb-5 uppercase tracking-tighter leading-none">Access <span className="text-[#48f520]">Matrix</span></h2>
            <p className="text-gray-500 text-sm font-medium tracking-wide">Initialize biometric encryption to enter the command center.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-7">
            {error && (
              <div className="p-5 bg-red-950/20 border border-red-500/40 text-red-400 text-xs rounded-2xl flex items-center animate-shake">
                <i className="fas fa-shield-virus mr-4 text-xl"></i>
                <div>
                  <p className="font-black uppercase tracking-widest">Authentication Denied</p>
                  <p className="opacity-80 mt-0.5">{error}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-800/80 ml-1">Terminal ID</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/60 group-focus-within:text-[#48f520] transition-colors">
                  <i className="fas fa-terminal"></i>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full input-glass pl-16 pr-6 py-5 text-sm text-white focus:outline-none placeholder:text-gray-800"
                  placeholder="operator@nexus.core"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-800/80 ml-1">Access Key</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-900/60 group-focus-within:text-[#48f520] transition-colors">
                  <i className="fas fa-key"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full input-glass pl-16 pr-16 py-5 text-sm text-white focus:outline-none placeholder:text-gray-800"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-900 hover:text-white transition-colors"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full neon-button text-black font-black py-6 rounded-[2rem] text-xs uppercase tracking-[0.6em] mt-12"
            >
              Verify Uplink
            </button>
          </form>

          <div className="mt-16">
            <div className="relative flex items-center justify-center mb-12">
              <div className="flex-grow border-t border-emerald-950"></div>
              <span className="mx-6 text-[8px] font-black uppercase tracking-[0.7em] text-emerald-900">Direct Command</span>
              <div className="flex-grow border-t border-emerald-950"></div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <button 
                  onClick={() => quickSwitch('admin')}
                  className="portal-btn group py-8 rounded-[2.5rem] flex flex-col items-center"
              >
                <i className="fas fa-shield-halved text-[#48f520] mb-4 text-xl group-hover:scale-125 transition-transform duration-700"></i>
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest group-hover:text-white">Admin Hub</span>
              </button>
              <button 
                  onClick={() => quickSwitch('advocate')}
                  className="portal-btn group py-8 rounded-[2.5rem] flex flex-col items-center"
              >
                <i className="fas fa-gavel text-[#48f520] mb-4 text-xl group-hover:scale-125 transition-transform duration-700"></i>
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest group-hover:text-white">Advocate Node</span>
              </button>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">
              New Practitioner? <Link to="/register" className="text-[#48f520] hover:underline hover:text-white transition-colors ml-2">Request Access</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: -15%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 115%; opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(2deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
        }
        @keyframes glitch-line {
          0% { transform: translateX(-150%) scaleX(0); opacity: 0; }
          25% { opacity: 1; }
          75% { opacity: 1; }
          100% { transform: translateX(150%) scaleX(3); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-scan { animation: scan 14s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 70s linear infinite; }
        .animate-spin-reverse-slow { animation: spin-reverse-slow 45s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 10s ease-in-out infinite; }
        .animate-glitch-line { animation: glitch-line 6s ease-in-out infinite; }
        .animate-glitch-line-delayed { animation: glitch-line 6s ease-in-out infinite 3s; }
        .animate-fade-in-up { animation: fade-in-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Login;


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
      // Find the first approved advocate for demo purposes
      const advocate = db.getUsers().find(u => u.role === 'advocate' && u.isApproved);
      if (advocate) {
        setEmail(advocate.email);
        setPassword('password123'); // Assuming a default for demo
      } else {
        setError('No approved advocates found in database yet.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Top Logo Branding */}
      <div className="flex items-center space-x-3 mb-10 fade-in">
        <div className="w-10 h-10 bg-[#15b01a] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(21,176,26,0.4)]">
            <i className="fas fa-balance-scale text-white text-xl"></i>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">Legal Case Manager</h1>
      </div>

      <div className="w-full max-w-md glass-card p-10 shadow-2xl fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Securely access your case dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-950/30 border border-red-500/50 text-red-400 text-xs rounded-xl">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Email or Username</label>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#48f520] transition-colors">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full input-glass pl-14 pr-4 py-4 text-sm text-white focus:outline-none"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Password</label>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#48f520] transition-colors">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full input-glass pl-14 pr-14 py-4 text-sm text-white focus:outline-none"
                placeholder="Enter your password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-xs font-bold neon-text hover:brightness-125 transition-all tracking-wide">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full neon-button text-black font-black py-4 rounded-2xl text-base uppercase tracking-widest"
          >
            Log In
          </button>
        </form>

        <div className="mt-10">
          <div className="relative flex items-center justify-center mb-8">
            <div className="flex-grow border-t border-emerald-900/50"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">Or continue with</span>
            <div className="flex-grow border-t border-emerald-900/50"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={() => quickSwitch('admin')}
                className="portal-btn flex items-center justify-center space-x-2 py-4 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-300"
            >
              <i className="fas fa-user-shield text-[#48f520]"></i>
              <span>Admin Portal</span>
            </button>
            <button 
                onClick={() => quickSwitch('advocate')}
                className="portal-btn flex items-center justify-center space-x-2 py-4 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-300"
            >
              <i className="fas fa-gavel text-[#48f520]"></i>
              <span>Advocate</span>
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-xs">
            Don't have an account? <Link to="/register-client" className="neon-text font-black hover:underline uppercase tracking-widest ml-1">Contact Admin</Link>
          </p>
        </div>
      </div>

      <div className="mt-10 flex items-center space-x-3 text-[10px] text-gray-500 uppercase tracking-[0.25em] font-black fade-in" style={{ animationDelay: '0.2s' }}>
        <i className="fas fa-shield-alt text-emerald-800 text-xs"></i>
        <span>256-bit SSL Secured Connection</span>
      </div>
    </div>
  );
};

export default Login;

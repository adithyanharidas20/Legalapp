
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../database';
import { UserRole } from '../types';
import { INDIAN_STATES } from '../constants';

const Register: React.FC = () => {
  const [role, setRole] = useState<UserRole.CLIENT | UserRole.ADVOCATE>(UserRole.CLIENT);
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', address: '', 
    barCouncilNumber: '', barId: '', aadhaar: '', 
    state: '', court: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (role === UserRole.ADVOCATE && !formData.barId) {
      setError('Please upload your Bar ID document');
      return;
    }

    const newUser = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      role: role,
      isApproved: role === UserRole.CLIENT ? true : false
    };

    db.saveUser(newUser as any);
    if (role === UserRole.ADVOCATE) {
      alert('Application submitted! Your documents will be reviewed by the Admin.');
    }
    navigate('/login');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For the simulation, we store the filename. In production, this would be a URL or Base64.
      setFormData({ ...formData, barId: file.name });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
      <div className="flex items-center space-x-3 mb-8 fade-in">
        <div className="w-10 h-10 bg-[#15b01a] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(21,176,26,0.4)]">
            <i className="fas fa-balance-scale text-white text-xl"></i>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase tracking-widest">Register Account</h1>
      </div>

      <div className="w-full max-w-2xl glass-card p-10 shadow-2xl fade-in">
        <div className="mb-8 flex justify-center p-1 bg-black/30 rounded-2xl border border-emerald-900/50">
          <button 
            type="button"
            onClick={() => setRole(UserRole.CLIENT)}
            className={`flex-1 py-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === UserRole.CLIENT ? 'bg-[#48f520] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Client
          </button>
          <button 
            type="button"
            onClick={() => setRole(UserRole.ADVOCATE)}
            className={`flex-1 py-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === UserRole.ADVOCATE ? 'bg-[#48f520] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Advocate
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {error && <div className="col-span-full p-3 bg-red-950/30 border border-red-500/50 text-red-400 text-xs rounded-xl">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full input-glass px-5 py-4 text-sm text-white focus:outline-none" placeholder="John Doe" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
            <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full input-glass px-5 py-4 text-sm text-white focus:outline-none" placeholder="john@example.com" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile</label>
            <input required type="tel" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full input-glass px-5 py-4 text-sm text-white focus:outline-none" placeholder="+91 0000000000" />
          </div>

          {role === UserRole.CLIENT ? (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address</label>
              <input required type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full input-glass px-5 py-4 text-sm text-white focus:outline-none" placeholder="Residential Address" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bar Council No.</label>
                <input required type="text" value={formData.barCouncilNumber} onChange={(e) => setFormData({...formData, barCouncilNumber: e.target.value})} className="w-full input-glass px-5 py-4 text-sm text-white focus:outline-none" placeholder="BAR/2024/001" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                <select required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full input-glass px-5 py-4 text-sm text-white focus:outline-none appearance-none">
                  <option value="" className="bg-[#021208]">Select State</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s} className="bg-[#021208]">{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Court</label>
                <input required type="text" value={formData.court} onChange={(e) => setFormData({...formData, court: e.target.value})} className="w-full input-glass px-5 py-4 text-sm text-white focus:outline-none" placeholder="High Court / Supreme Court" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bar ID Document</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`w-full input-glass px-5 py-4 text-sm flex items-center justify-between ${formData.barId ? 'text-white' : 'text-gray-500'}`}>
                    <span className="truncate">{formData.barId || "Choose File (PDF/JPG)"}</span>
                    <i className="fas fa-upload text-[#48f520]"></i>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full input-glass px-5 py-4 text-sm text-white focus:outline-none" placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm</label>
            <input required type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full input-glass px-5 py-4 text-sm text-white focus:outline-none" placeholder="••••••••" />
          </div>

          <button type="submit" className="col-span-full neon-button text-black font-black py-4 rounded-2xl text-base uppercase tracking-widest mt-4">
            Create {role === UserRole.CLIENT ? 'Client' : 'Advocate'} Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs">
            Already have an account? <Link to="/login" className="neon-text font-black hover:underline uppercase tracking-widest ml-1">Log In</Link>
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center space-x-3 text-[10px] text-gray-500 uppercase tracking-[0.25em] font-black fade-in">
        <i className="fas fa-shield-alt text-emerald-800 text-xs"></i>
        <span>Secured Registration Portal</span>
      </div>
    </div>
  );
};

export default Register;

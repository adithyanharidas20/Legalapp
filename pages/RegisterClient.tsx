
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../database';
import { UserRole } from '../types';

const RegisterClient: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      address: formData.address,
      role: UserRole.CLIENT,
      isApproved: true
    };

    db.saveUser(newUser);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-950 via-black to-green-950 py-12">
      <div className="w-full max-w-2xl glass p-8 rounded-3xl shadow-2xl border border-emerald-800">
        <h2 className="text-3xl font-bold text-emerald-400 mb-8 text-center">Client Registration</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {error && <div className="col-span-full p-3 bg-red-900/30 border border-red-500 text-red-400 rounded-lg">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-sm text-emerald-200">Full Name</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-emerald-200">Email</label>
            <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-emerald-200">Mobile Number</label>
            <input required type="tel" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-emerald-200">Address</label>
            <input required type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-emerald-200">Password</label>
            <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-emerald-200">Confirm Password</label>
            <input required type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <button type="submit" className="col-span-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-3 rounded-xl mt-4 transition-all neon-glow">
            Create Account
          </button>
        </form>
        <p className="mt-6 text-center text-emerald-100/60">
            Already have an account? <Link to="/login" className="text-emerald-400 font-semibold">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterClient;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../database';
import { UserRole } from '../types';
import { INDIAN_STATES } from '../constants';

const RegisterAdvocate: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', barCouncilNumber: '', barId: '', 
    aadhaar: '', state: '', court: '', password: '', confirmPassword: ''
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
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      role: UserRole.ADVOCATE,
      isApproved: false // Requires admin approval
    };
    
    db.saveUser(newUser);
    alert('Registration successful! Waiting for Admin approval.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-950 via-black to-green-950 py-12">
      <div className="w-full max-w-3xl glass p-8 rounded-3xl shadow-2xl border border-emerald-800">
        <h2 className="text-3xl font-bold text-emerald-400 mb-8 text-center">Advocate Registration</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {error && <div className="col-span-full p-3 bg-red-900/30 border border-red-500 text-red-400 rounded-lg">{error}</div>}
          
          <input required placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500" />
          <input required placeholder="Email" type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500" />
          <input required placeholder="Mobile" type="tel" onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500" />
          <input required placeholder="Bar Council Number" onChange={(e) => setFormData({...formData, barCouncilNumber: e.target.value})} className="bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500" />
          <input required placeholder="Bar ID" onChange={(e) => setFormData({...formData, barId: e.target.value})} className="bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500" />
          <input required placeholder="Aadhaar Number" onChange={(e) => setFormData({...formData, aadhaar: e.target.value})} className="bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500" />
          
          <select required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500">
            <option value="">Select State</option>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          
          <input required placeholder="Practice Court" onChange={(e) => setFormData({...formData, court: e.target.value})} className="bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500" />
          <input required placeholder="Password" type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500" />
          <input required placeholder="Confirm Password" type="password" onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="bg-emerald-900/20 border border-emerald-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500" />

          <button type="submit" className="col-span-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-3 rounded-xl mt-4 transition-all neon-glow">
            Submit Application
          </button>
        </form>
        <p className="mt-6 text-center text-emerald-100/60">
            Already registered? <Link to="/login" className="text-emerald-400 font-semibold">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterAdvocate;

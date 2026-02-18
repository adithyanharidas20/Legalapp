
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { db } from '../database';
import { User, UserRole, AppointmentStatus } from '../types';

const ClientFindAdvocate: React.FC = () => {
  const [advocates, setAdvocates] = useState<User[]>([]);
  const [selectedAdvocate, setSelectedAdvocate] = useState<User | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const currentUser: User = JSON.parse(localStorage.getItem('aa_current_user') || '{}');

  useEffect(() => {
    const allUsers = db.getUsers();
    setAdvocates(allUsers.filter(u => u.role === UserRole.ADVOCATE && u.isApproved));
  }, []);

  const handleBook = () => {
    if (!selectedAdvocate || !bookingDate) return;

    const newAppointment = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: currentUser.id,
      advocateId: selectedAdvocate.id,
      date: bookingDate,
      status: AppointmentStatus.PENDING
    };

    db.saveAppointment(newAppointment);
    alert('Appointment booked! Waiting for advocate approval.');
    setSelectedAdvocate(null);
    setBookingDate('');
  };

  return (
    <Layout role={UserRole.CLIENT} userName={currentUser.name}>
      <div className="mb-8">
        <input 
          placeholder="Search by name, state or court..."
          className="w-full bg-emerald-900/20 border border-emerald-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advocates.map(adv => (
          <div key={adv.id} className="glass-card p-6 rounded-2xl border border-emerald-800/50 hover:border-emerald-500 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-800 flex items-center justify-center text-2xl font-bold border border-emerald-500">
                {adv.name.charAt(0)}
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20">
                {adv.court}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{adv.name}</h3>
            <p className="text-emerald-400/70 text-sm mb-4">Bar Council: {adv.barCouncilNumber}</p>
            <div className="flex items-center text-emerald-200/50 text-xs space-x-4 mb-6">
              <span><i className="fas fa-map-marker-alt mr-1"></i> {adv.state}</span>
              <span><i className="fas fa-user-shield mr-1"></i> Verified</span>
            </div>
            <button 
              onClick={() => setSelectedAdvocate(adv)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedAdvocate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-emerald-500/30">
            <h3 className="text-2xl font-bold mb-4">Book with {selectedAdvocate.name}</h3>
            <p className="text-emerald-100/60 mb-6 text-sm">Select a date for your initial consultation.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-emerald-200 mb-2">Preferred Date</label>
                <input 
                  type="date" 
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-emerald-900/40 border border-emerald-800 rounded-xl px-4 py-3 text-white"
                />
              </div>
              
              <div className="flex space-x-4 mt-8">
                <button 
                  onClick={() => setSelectedAdvocate(null)}
                  className="flex-1 bg-transparent border border-emerald-800 hover:bg-emerald-900/50 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBook}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-3 rounded-xl transition-all shadow-lg neon-glow"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ClientFindAdvocate;

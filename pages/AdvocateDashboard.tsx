
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { db } from '../database';
import { User, UserRole, Case, Appointment, AppointmentStatus } from '../types';

const AdvocateDashboard: React.FC = () => {
  const [stats, setStats] = useState({ cases: 0, appointments: 0, pending: 0 });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const currentUser: User = JSON.parse(localStorage.getItem('aa_current_user') || '{}');

  useEffect(() => {
    const allCases = db.getCases().filter(c => c.advocateId === currentUser.id);
    const allApps = db.getAppointments().filter(a => a.advocateId === currentUser.id);
    const pendingApps = allApps.filter(a => a.status === AppointmentStatus.PENDING);
    
    setStats({
      cases: allCases.length,
      appointments: allApps.length,
      pending: pendingApps.length
    });
    setAppointments(pendingApps);
  }, [currentUser.id]);

  const handleApprove = (id: string) => {
    db.updateAppointment(id, { status: AppointmentStatus.APPROVED });
    setAppointments(prev => prev.filter(a => a.id !== id));
    alert('Appointment approved');
  };

  return (
    <Layout role={UserRole.ADVOCATE} userName={currentUser.name}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-emerald-400 font-bold uppercase text-xs tracking-wider mb-1">Total Cases</p>
            <h3 className="text-4xl font-black">{stats.cases}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-900/50 flex items-center justify-center text-emerald-400">
            <i className="fas fa-briefcase text-xl"></i>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-emerald-400 font-bold uppercase text-xs tracking-wider mb-1">Appointments</p>
            <h3 className="text-4xl font-black">{stats.appointments}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-900/50 flex items-center justify-center text-emerald-400">
            <i className="fas fa-calendar-alt text-xl"></i>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center justify-between border-emerald-500/30">
          <div>
            <p className="text-orange-400 font-bold uppercase text-xs tracking-wider mb-1">Pending Requests</p>
            <h3 className="text-4xl font-black">{stats.pending}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-950/30 flex items-center justify-center text-orange-400">
            <i className="fas fa-clock text-xl"></i>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
            <i className="fas fa-bell mr-3 text-emerald-400"></i>
            Appointment Requests
        </h2>
        {appointments.length === 0 ? (
          <p className="text-emerald-100/30 italic text-center py-12">No pending requests at the moment.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map(app => {
              const client = db.getUsers().find(u => u.id === app.clientId);
              return (
                <div key={app.id} className="flex items-center justify-between p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-800 flex items-center justify-center font-bold">
                        {client?.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold">{client?.name}</p>
                        <p className="text-sm text-emerald-400/70">{app.date}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={() => handleApprove(app.id)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-bold">
                        Approve
                    </button>
                    <button className="px-4 py-2 border border-emerald-800 hover:bg-red-900/20 text-emerald-200 rounded-lg transition-colors text-sm">
                        Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdvocateDashboard;

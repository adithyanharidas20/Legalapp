
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ChatWindow from '../components/ChatWindow';
import { db } from '../database';
import { User, UserRole, Case, Appointment, AppointmentStatus } from '../types';

const AdvocateDashboard: React.FC = () => {
  const [stats, setStats] = useState({ cases: 0, appointments: 0, pending: 0 });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [chattingWith, setChattingWith] = useState<User | null>(null);
  
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

  // Chat recpient logic
  const adminUser = db.getUsers().find(u => u.role === UserRole.ADMIN);
  const myCases = db.getCases().filter(c => c.advocateId === currentUser.id);
  const clientIds = Array.from(new Set(myCases.map(c => c.clientId)));
  const myClients = db.getUsers().filter(u => clientIds.includes(u.id));

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

      {/* Messaging System for Advocate */}
      <div className="fixed bottom-10 right-10 flex flex-col items-end space-y-4 z-50">
        {chattingWith && (
          <div className="mb-4">
            <ChatWindow 
              currentUser={currentUser} 
              targetUser={chattingWith} 
              onClose={() => setChattingWith(null)} 
            />
          </div>
        )}

        {showChatMenu && !chattingWith && (
          <div className="w-72 bg-[#021208] border border-emerald-900/40 rounded-3xl p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4 px-2">Secure Channels</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {adminUser && (
                <button 
                  onClick={() => { setChattingWith(adminUser); setShowChatMenu(false); }}
                  className="w-full p-3 rounded-xl bg-emerald-900/20 border border-emerald-900/40 hover:border-[#48f520]/40 flex items-center space-x-3 group transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-xs font-black">A</div>
                  <div className="text-left">
                    <p className="text-[11px] font-black text-white uppercase tracking-wider">Super Admin</p>
                    <p className="text-[8px] text-emerald-500 font-bold uppercase">System Support</p>
                  </div>
                </button>
              )}
              
              <div className="border-t border-emerald-900/30 my-2"></div>
              
              {myClients.length === 0 ? (
                <p className="text-[9px] text-gray-600 uppercase font-black text-center py-4">No active clients</p>
              ) : (
                myClients.map(cl => (
                  <button 
                    key={cl.id}
                    onClick={() => { setChattingWith(cl); setShowChatMenu(false); }}
                    className="w-full p-3 rounded-xl bg-black/40 border border-emerald-900/20 hover:border-[#48f520]/40 flex items-center space-x-3 group transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center text-xs font-black text-emerald-500">{cl.name.charAt(0)}</div>
                    <div className="text-left">
                      <p className="text-[11px] font-black text-white uppercase tracking-wider">{cl.name}</p>
                      <p className="text-[8px] text-gray-500 font-bold uppercase">Client</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <button 
          onClick={() => {
            setShowChatMenu(!showChatMenu);
            if (chattingWith) setChattingWith(null);
          }}
          className="w-16 h-16 bg-[#48f520] text-black rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(72,245,32,0.4)] hover:scale-110 transition-all"
        >
          <i className={`fas ${showChatMenu || chattingWith ? 'fa-times' : 'fa-comments-alt'} text-2xl`}></i>
        </button>
      </div>
    </Layout>
  );
};

export default AdvocateDashboard;

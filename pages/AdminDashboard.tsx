
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { db } from '../database';
import { User, UserRole, Case } from '../types';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedUserDoc, setSelectedUserDoc] = useState<string | null>(null);
  const [viewingCase, setViewingCase] = useState<Case | null>(null);

  const currentUser: User = JSON.parse(localStorage.getItem('aa_current_user') || '{}');

  useEffect(() => {
    setUsers(db.getUsers());
    setCases(db.getCases());
  }, []);

  const handleAction = (userId: string, approve: boolean) => {
    if (approve) {
      db.updateUser(userId, { isApproved: true });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isApproved: true } : u));
    } else {
      const filtered = users.filter(u => u.id !== userId);
      localStorage.setItem('aa_users', JSON.stringify(filtered));
      setUsers(filtered);
    }
  };

  const pendingAdvocates = users.filter(u => u.role === UserRole.ADVOCATE && !u.isApproved);
  const totalRevenue = cases.filter(c => c.paymentStatus === 'Paid').reduce((acc, c) => acc + c.feeAmount, 0);

  return (
    <Layout role={UserRole.ADMIN} userName={currentUser.name}>
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-6 border border-emerald-900/40">
            <p className="text-[#48f520] text-[10px] font-black uppercase tracking-widest mb-2">Total Platform Users</p>
            <h4 className="text-3xl font-black text-white">{users.length}</h4>
        </div>
        <div className="glass-card p-6 border border-emerald-900/40">
            <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest mb-2">Verification Queue</p>
            <h4 className="text-3xl font-black text-white">{pendingAdvocates.length}</h4>
        </div>
        <div className="glass-card p-6 border border-emerald-900/40">
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Collection</p>
            <h4 className="text-3xl font-black text-white">₹{totalRevenue.toLocaleString()}</h4>
        </div>
        <div className="glass-card p-6 border border-[#48f520]/20">
            <p className="text-[#48f520] text-[10px] font-black uppercase tracking-widest mb-2">System Status</p>
            <h4 className="text-3xl font-black text-white">OPTIMAL</h4>
        </div>
      </div>

      <div className="space-y-10">
        {/* Verification Queue */}
        <section className="glass-card p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center">
                  <i className="fas fa-shield-alt mr-4 text-orange-400"></i>
                  Advocate Verification
              </h2>
          </div>
          
          {pendingAdvocates.length === 0 ? (
            <div className="text-center py-10 bg-black/20 rounded-3xl border border-dashed border-emerald-900/50">
              <p className="text-gray-500 text-xs font-black uppercase tracking-widest">No pending verifications</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[#48f520] text-[10px] font-black uppercase tracking-widest border-b border-emerald-900/40">
                    <th className="pb-4">Advocate Details</th>
                    <th className="pb-4">Credential Check</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/20">
                  {pendingAdvocates.map(adv => (
                    <tr key={adv.id} className="group hover:bg-emerald-950/10 transition-colors">
                      <td className="py-6">
                        <p className="font-black text-white uppercase tracking-wider text-sm">{adv.name}</p>
                        <p className="text-[10px] text-gray-500">{adv.email}</p>
                      </td>
                      <td className="py-6">
                        <button 
                            onClick={() => setSelectedUserDoc(adv.barId || 'demo-id.jpg')}
                            className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-lg hover:bg-emerald-800 hover:text-white transition-all"
                        >
                            <i className="fas fa-file-image mr-2"></i> View Bar ID
                        </button>
                      </td>
                      <td className="py-6 text-right">
                        <div className="flex justify-end space-x-3">
                          <button onClick={() => handleAction(adv.id, true)} className="bg-[#48f520] text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Approve</button>
                          <button onClick={() => handleAction(adv.id, false)} className="border border-red-900 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Deny</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Master Case Log */}
        <section className="glass-card p-8 shadow-xl">
          <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8 flex items-center">
              <i className="fas fa-database mr-4 text-blue-400"></i>
              Platform Master Case Log
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cases.map(c => (
                  <div key={c.id} className="p-6 bg-black/30 border border-emerald-900/30 rounded-3xl flex justify-between items-center group hover:border-[#48f520]/40 transition-all">
                      <div>
                          <p className="text-white font-black uppercase tracking-wider text-sm">{c.title}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{c.category} • Case #{c.id}</p>
                      </div>
                      <button 
                        onClick={() => setViewingCase(c)}
                        className="w-10 h-10 rounded-full border border-emerald-900/50 flex items-center justify-center text-gray-400 group-hover:text-[#48f520] group-hover:border-[#48f520]"
                      >
                          <i className="fas fa-eye"></i>
                      </button>
                  </div>
              ))}
          </div>
        </section>
      </div>

      {/* ID Viewing Modal */}
      {selectedUserDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
              <div className="max-w-xl w-full text-center">
                  <h3 className="text-white font-black uppercase tracking-widest mb-6">Credential Document Preview</h3>
                  <div className="aspect-video bg-emerald-900/20 border-2 border-dashed border-emerald-800 rounded-3xl flex items-center justify-center mb-8">
                      <i className="fas fa-id-card text-6xl text-emerald-800"></i>
                      <p className="ml-4 text-emerald-600 font-mono text-xs">{selectedUserDoc}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedUserDoc(null)}
                    className="neon-button text-black font-black px-12 py-3 rounded-2xl uppercase tracking-widest text-xs"
                  >
                      Close Preview
                  </button>
              </div>
          </div>
      )}

      {/* Master Case Details Modal */}
      {viewingCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <div className="glass-card w-full max-w-2xl p-10 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-start mb-8">
                      <div>
                          <h3 className="text-2xl font-black text-white uppercase tracking-widest">{viewingCase.title}</h3>
                          <p className="text-xs text-emerald-500 font-black uppercase tracking-[0.2em]">{viewingCase.category}</p>
                      </div>
                      <button onClick={() => setViewingCase(null)} className="text-gray-500 hover:text-white">
                          <i className="fas fa-times text-xl"></i>
                      </button>
                  </div>

                  <div className="space-y-8">
                      <div>
                          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Event Timeline (History)</h4>
                          <div className="space-y-3">
                              {viewingCase.history?.map((h, i) => (
                                  <div key={h.id} className="flex items-center space-x-4 text-xs">
                                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                      <span className="text-gray-400 font-mono w-32 shrink-0">{new Date(h.date).toLocaleDateString()}</span>
                                      <span className="text-white font-black uppercase tracking-widest">{h.actor}</span>
                                      <span className="text-emerald-500/80 italic">{h.event}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;

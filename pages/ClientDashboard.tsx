
import React, { useState } from 'react';
import Layout from '../components/Layout';
import ChatWindow from '../components/ChatWindow';
import { db } from '../database';
import { User, UserRole } from '../types';

const ClientDashboard: React.FC = () => {
  const currentUser: User = JSON.parse(localStorage.getItem('aa_current_user') || '{}');
  const [showChat, setShowChat] = useState(false);

  const adminUser = db.getUsers().find(u => u.role === UserRole.ADMIN);

  return (
    <Layout role={UserRole.CLIENT} userName={currentUser.name}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-emerald-400 text-lg font-bold mb-1">Active Cases</h3>
            <p className="text-4xl font-black">0</p>
          </div>
          <i className="fas fa-folder-open text-emerald-900/40 text-6xl self-end mt-4"></i>
        </div>
        
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-emerald-400 text-lg font-bold mb-1">Appointments</h3>
            <p className="text-4xl font-black">0</p>
          </div>
          <i className="fas fa-calendar-alt text-emerald-900/40 text-6xl self-end mt-4"></i>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border-emerald-500/50 border-2">
          <div>
            <h3 className="text-emerald-400 text-lg font-bold mb-1">Total Paid</h3>
            <p className="text-4xl font-black">₹ 0</p>
          </div>
          <i className="fas fa-rupee-sign text-emerald-900/40 text-6xl self-end mt-4"></i>
        </div>
      </div>

      <div className="mt-12 glass-card p-8 rounded-3xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
            <i className="fas fa-history mr-3 text-emerald-400"></i>
            Recent Activity
        </h2>
        <div className="space-y-4">
            <div className="flex items-center justify-center p-12 text-emerald-100/30 italic">
                No recent activity found. Start by finding an advocate.
            </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-10 right-10 flex flex-col items-end space-y-4">
        {showChat && adminUser && (
          <ChatWindow 
            currentUser={currentUser} 
            targetUser={adminUser} 
            onClose={() => setShowChat(false)} 
          />
        )}
        <button 
          onClick={() => setShowChat(!showChat)}
          className="w-16 h-16 bg-[#48f520] text-black rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(72,245,32,0.4)] hover:scale-110 transition-all z-50"
        >
          <i className={`fas ${showChat ? 'fa-times' : 'fa-headset'} text-2xl`}></i>
        </button>
      </div>
    </Layout>
  );
};

export default ClientDashboard;

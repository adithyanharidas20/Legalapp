
import React from 'react';
import Layout from '../components/Layout';
import { User, UserRole } from '../types';

const ClientDashboard: React.FC = () => {
  const currentUser: User = JSON.parse(localStorage.getItem('aa_current_user') || '{}');

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
    </Layout>
  );
};

export default ClientDashboard;

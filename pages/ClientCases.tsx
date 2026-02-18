
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { db } from '../database';
import { User, UserRole, Case, PaymentStatus } from '../types';

declare const Razorpay: any;

const ClientCases: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Case | null>(null);
  const currentUser: User = JSON.parse(localStorage.getItem('aa_current_user') || '{}');

  useEffect(() => {
    setCases(db.getCases().filter(c => c.clientId === currentUser.id));
  }, [currentUser.id]);

  const handleFileUpload = (caseId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc = { name: file.name, date: new Date().toISOString(), type: file.type };
      const updatedCase = cases.find(c => c.id === caseId);
      if (updatedCase) {
        db.updateCase(caseId, { documents: [...(updatedCase.documents || []), newDoc] }, currentUser.name);
        setCases(db.getCases().filter(c => c.clientId === currentUser.id));
      }
    }
  };

  const handlePay = (caseObj: Case) => {
    const options = {
      key: "rzp_test_SHZ0Zgts7Gkb8r",
      amount: caseObj.feeAmount * 100,
      currency: "INR",
      name: "AdvocateAutomated",
      description: `Legal fee for ${caseObj.title}`,
      handler: function(response: any) {
        alert("Payment Successful! Reference: " + response.razorpay_payment_id);
        db.updateCase(caseObj.id, { paymentStatus: PaymentStatus.PAID }, currentUser.name);
        setCases(db.getCases().filter(c => c.clientId === currentUser.id));
      },
      prefill: {
        name: currentUser.name,
        email: currentUser.email,
        contact: currentUser.mobile
      },
      theme: { color: "#48f520" }
    };
    const rzp = new Razorpay(options);
    rzp.open();
  };

  return (
    <Layout role={UserRole.CLIENT} userName={currentUser.name}>
      <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white mb-10">Legal Matter Portfolio</h2>
      
      {cases.length === 0 ? (
        <div className="glass-card p-20 text-center rounded-3xl border border-dashed border-emerald-900/40">
          <i className="fas fa-folder-open text-emerald-900/40 text-6xl mb-6"></i>
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest italic">No active cases found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {cases.map(c => {
            const advocate = db.getUsers().find(u => u.id === c.advocateId);
            return (
              <div key={c.id} className="glass-card p-8 flex flex-col border border-emerald-900/30 group hover:border-[#48f520]/30 transition-all relative">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-wider">{c.title}</h3>
                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em]">{c.category}</p>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        c.paymentStatus === 'Paid' ? 'bg-[#48f520]/10 text-[#48f520] border-[#48f520]/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                        {c.paymentStatus}
                    </span>
                </div>

                <div className="flex items-center space-x-3 mb-8 p-3 bg-black/40 rounded-2xl border border-emerald-900/20">
                    <div className="w-8 h-8 rounded-xl bg-emerald-900/40 flex items-center justify-center font-black text-[#48f520] text-xs">
                        {advocate?.name.charAt(0)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Advocate: {advocate?.name}</span>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <span>Associated Documents ({c.documents?.length || 0})</span>
                        <label className="cursor-pointer text-[#48f520] hover:underline">
                            <i className="fas fa-upload mr-2"></i>Upload New
                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(c.id, e)} />
                        </label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {c.documents?.map((doc, i) => (
                            <div key={i} className="px-3 py-1 bg-emerald-950/40 border border-emerald-900/40 rounded-lg text-[10px] text-gray-400 flex items-center">
                                <i className="fas fa-file-pdf mr-2 text-red-500"></i>
                                {doc.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-emerald-900/30">
                  <div>
                    <p className="text-[9px] text-[#48f520] font-black uppercase tracking-widest">Case Valuation</p>
                    <p className="text-2xl font-black text-white">₹{c.feeAmount.toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                        onClick={() => setSelectedCase(c)}
                        className="p-3 rounded-xl border border-emerald-900/50 text-gray-400 hover:text-white transition-all"
                        title="View History"
                    >
                        <i className="fas fa-history"></i>
                    </button>
                    {c.paymentStatus !== 'Paid' ? (
                        <button onClick={() => handlePay(c)} className="neon-button text-black font-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest">Pay Fee</button>
                    ) : (
                        <button 
                            onClick={() => setViewingInvoice(c)}
                            className="bg-black border border-[#48f520]/40 text-[#48f520] font-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest flex items-center"
                        >
                            <i className="fas fa-file-invoice mr-2"></i> Invoice
                        </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History Modal */}
      {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <div className="glass-card w-full max-w-md p-10">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest mb-8">Case Timeline Log</h3>
                  <div className="space-y-6 relative border-l border-emerald-900/50 ml-2">
                      {selectedCase.history?.slice().reverse().map((h, i) => (
                          <div key={h.id} className="pl-6 relative">
                              <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-[#48f520] shadow-[0_0_10px_#48f520]"></div>
                              <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{new Date(h.date).toLocaleString()}</p>
                              <p className="text-xs text-white font-bold">{h.event}</p>
                              <p className="text-[10px] text-emerald-700 uppercase font-black">By: {h.actor}</p>
                          </div>
                      ))}
                  </div>
                  <button onClick={() => setSelectedCase(null)} className="w-full mt-10 py-4 border border-emerald-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white">Close Log</button>
              </div>
          </div>
      )}

      {/* Invoice Modal */}
      {viewingInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg">
              <div className="bg-white text-black w-full max-w-2xl p-12 rounded-none shadow-2xl font-serif">
                  <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-8">
                      <div>
                          <h1 className="text-3xl font-black uppercase tracking-tighter">ADVOCATEAUTO</h1>
                          <p className="text-xs uppercase font-bold text-gray-600">Premium Legal Case Management System</p>
                      </div>
                      <div className="text-right">
                          <h2 className="text-4xl font-black uppercase mb-1">INVOICE</h2>
                          <p className="text-xs font-bold">INV-#{viewingInvoice.id.toUpperCase()}</p>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-12 mb-12">
                      <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Billed To</p>
                          <p className="text-lg font-black uppercase">{currentUser.name}</p>
                          <p className="text-xs text-gray-600">{currentUser.email}</p>
                          <p className="text-xs text-gray-600">{currentUser.address}</p>
                      </div>
                      <div className="text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Issue Date</p>
                          <p className="text-sm font-bold">{new Date().toLocaleDateString()}</p>
                      </div>
                  </div>

                  <table className="w-full text-left mb-12 border-collapse">
                      <thead>
                          <tr className="border-b-2 border-black">
                              <th className="py-4 text-xs font-black uppercase">Description of Services</th>
                              <th className="py-4 text-right text-xs font-black uppercase">Amount</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr className="border-b border-gray-200">
                              <td className="py-6">
                                  <p className="font-bold uppercase text-sm">Legal Professional Fee</p>
                                  <p className="text-xs text-gray-500">Matter: {viewingInvoice.title}</p>
                              </td>
                              <td className="py-6 text-right font-black">₹{viewingInvoice.feeAmount.toLocaleString()}</td>
                          </tr>
                      </tbody>
                  </table>

                  <div className="flex justify-end mb-12">
                      <div className="w-64">
                          <div className="flex justify-between py-2">
                              <span className="text-xs font-bold uppercase">Subtotal</span>
                              <span className="font-bold">₹{viewingInvoice.feeAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-2 border-t-2 border-black mt-2">
                              <span className="text-sm font-black uppercase">Total Due</span>
                              <span className="text-xl font-black">₹{viewingInvoice.feeAmount.toLocaleString()}</span>
                          </div>
                      </div>
                  </div>

                  <div className="border-t border-gray-200 pt-8 flex justify-between items-end">
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                          <p>Digitally signed by AdvocateAuto Authority</p>
                          <p>Payment ID: RZP_SUCCESS_ID_MOCK</p>
                      </div>
                      <button onClick={() => window.print()} className="bg-black text-white px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-widest no-print">Download PDF</button>
                      <button onClick={() => setViewingInvoice(null)} className="ml-4 text-gray-500 hover:text-black font-black uppercase text-[10px] no-print">Close</button>
                  </div>
              </div>
          </div>
      )}
    </Layout>
  );
};

export default ClientCases;

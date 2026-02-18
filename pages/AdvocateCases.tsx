
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { db } from '../database';
import { User, UserRole, Case, PaymentStatus } from '../types';
import { CASE_CATEGORIES } from '../constants';
import { gemini } from '../geminiService';

const AdvocateCases: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newCase, setNewCase] = useState({ title: '', clientId: '', category: '', feeAmount: 0, description: '' });
  const [clients, setClients] = useState<User[]>([]);
  const [selectedCaseHistory, setSelectedCaseHistory] = useState<Case | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{ title: string; text: string } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  const currentUser: User = JSON.parse(localStorage.getItem('aa_current_user') || '{}');

  useEffect(() => {
    setCases(db.getCases().filter(c => c.advocateId === currentUser.id));
    setClients(db.getUsers().filter(u => u.role === UserRole.CLIENT));
  }, [currentUser.id]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const c: Case = {
      ...newCase,
      id: Math.random().toString(36).substr(2, 9),
      advocateId: currentUser.id,
      paymentStatus: PaymentStatus.UNPAID,
      documents: [],
      history: [{ id: 'h1', actor: currentUser.name, event: 'Case Initialized', date: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    };
    db.saveCase(c);
    setCases([...cases, c]);
    setShowCreate(false);
  };

  const handleAiAnalysis = async (caseTitle: string, docName: string) => {
    setAnalyzing(true);
    const result = await gemini.analyzeDocument(docName, caseTitle);
    setAiAnalysisResult({ title: docName, text: result });
    setAnalyzing(false);
  };

  return (
    <Layout role={UserRole.ADVOCATE} userName={currentUser.name}>
      <div className="flex justify-between items-center mb-10">
        <div>
            <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white">Legal Case Portfolio</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-1">Manage active files, verify documents, and track milestones</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="neon-button text-black font-black px-8 py-3 rounded-2xl transition-all flex items-center space-x-3 text-xs uppercase tracking-widest"
        >
          <i className="fas fa-plus"></i>
          <span>Initialize Case</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {cases.length === 0 ? (
            <div className="glass-card p-20 text-center border-emerald-900/30">
                <i className="fas fa-folder-open text-emerald-900/40 text-6xl mb-6"></i>
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest">No active cases registered</p>
            </div>
        ) : (
            cases.map(c => {
                const client = clients.find(u => u.id === c.clientId);
                return (
                    <div key={c.id} className="glass-card p-8 border border-emerald-900/20 hover:border-[#48f520]/20 transition-all group">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-6">
                                <div className="w-16 h-16 rounded-3xl bg-black/40 border border-[#48f520]/10 flex items-center justify-center text-[#48f520] transition-all">
                                    <i className="fas fa-file-contract text-2xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-black text-lg text-white uppercase tracking-wider">{c.title}</h4>
                                    <div className="flex items-center space-x-3 mt-1">
                                        <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">{c.category}</span>
                                        <span className="text-emerald-900">|</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Client: {client?.name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-8">
                                <div className="text-right">
                                    <p className="text-[9px] text-[#48f520] font-black uppercase tracking-widest">Fee Quote</p>
                                    <p className="text-2xl font-black text-white">₹{c.feeAmount.toLocaleString()}</p>
                                </div>
                                <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                                    c.paymentStatus === 'Paid' ? 'bg-[#48f520]/10 text-[#48f520] border-[#48f520]/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                }`}>
                                    {c.paymentStatus}
                                </div>
                                <button 
                                    onClick={() => setSelectedCaseHistory(c)}
                                    className="w-10 h-10 rounded-full border border-emerald-900/40 text-emerald-500 hover:bg-[#48f520] hover:text-black transition-all"
                                >
                                    <i className="fas fa-history"></i>
                                </button>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="mt-6 pt-6 border-t border-emerald-900/20">
                            <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Uploaded Evidences & Files</h5>
                            {c.documents?.length === 0 ? (
                                <p className="text-[10px] text-gray-600 italic">No files shared by client yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {c.documents?.map((doc, idx) => (
                                        <div key={idx} className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center space-x-3 overflow-hidden">
                                                <i className="fas fa-file-alt text-emerald-500 shrink-0"></i>
                                                <span className="text-xs text-white truncate font-medium">{doc.name}</span>
                                            </div>
                                            <div className="flex space-x-2 shrink-0">
                                                <a href="#" onClick={(e) => { e.preventDefault(); alert('Starting download for: ' + doc.name); }} className="p-2 text-gray-500 hover:text-white transition-colors" title="Download">
                                                    <i className="fas fa-download"></i>
                                                </a>
                                                <button 
                                                    onClick={() => handleAiAnalysis(c.title, doc.name)}
                                                    className="px-3 py-1 bg-emerald-900/50 text-[#48f520] text-[9px] font-black uppercase rounded-lg hover:bg-[#48f520] hover:text-black transition-all"
                                                >
                                                    AI Analyze
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })
        )}
      </div>

      {/* History Modal */}
      {selectedCaseHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <div className="glass-card w-full max-w-md p-10">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest mb-8">Case Milestone History</h3>
                  <div className="space-y-6 relative border-l border-emerald-900/50 ml-2">
                      {selectedCaseHistory.history?.slice().reverse().map((h) => (
                          <div key={h.id} className="pl-6 relative">
                              <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-[#48f520] shadow-[0_0_10px_#48f520]"></div>
                              <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{new Date(h.date).toLocaleString()}</p>
                              <p className="text-xs text-white font-bold">{h.event}</p>
                              <p className="text-[10px] text-emerald-700 uppercase font-black">Operator: {h.actor}</p>
                          </div>
                      ))}
                  </div>
                  <button onClick={() => setSelectedCaseHistory(null)} className="w-full mt-10 py-4 border border-emerald-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white">Close Log</button>
              </div>
          </div>
      )}

      {/* AI Analysis Modal */}
      {(analyzing || aiAnalysisResult) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
              <div className="glass-card w-full max-w-2xl p-10">
                  {analyzing ? (
                      <div className="text-center py-20">
                          <i className="fas fa-robot fa-spin text-[#48f520] text-5xl mb-6"></i>
                          <h3 className="text-white font-black uppercase tracking-[0.3em] text-sm animate-pulse">Gemini 3 Pro Analyzing Context...</h3>
                      </div>
                  ) : (
                      <>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-[#48f520] uppercase tracking-widest">Document Intelligence Report</h3>
                            <button onClick={() => setAiAnalysisResult(null)} className="text-gray-500 hover:text-white"><i className="fas fa-times"></i></button>
                        </div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Subject: {aiAnalysisResult?.title}</p>
                        <div className="bg-emerald-950/20 border border-emerald-900/40 p-6 rounded-3xl overflow-y-auto max-h-[50vh] text-emerald-50 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                            {aiAnalysisResult?.text}
                        </div>
                        <button onClick={() => setAiAnalysisResult(null)} className="w-full mt-8 py-4 neon-button text-black font-black rounded-2xl text-[10px] uppercase tracking-widest">Acknowledged</button>
                      </>
                  )}
              </div>
          </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#021208]/90 backdrop-blur-md">
          <div className="glass-card w-full max-w-lg p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[#48f520]/20">
            <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-widest">Open New File</h3>
            <form onSubmit={handleCreate} className="space-y-5">
              <input required placeholder="Case Title" className="w-full input-glass px-5 py-4 text-sm text-white focus:outline-none" 
                onChange={e => setNewCase({...newCase, title: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <select required className="w-full input-glass px-5 py-4 text-sm text-white focus:outline-none appearance-none"
                    onChange={e => setNewCase({...newCase, clientId: e.target.value})}>
                    <option value="" className="bg-[#021208]">Select Client</option>
                    {clients.map(cl => <option key={cl.id} value={cl.id} className="bg-[#021208]">{cl.name}</option>)}
                </select>

                <select required className="w-full input-glass px-5 py-4 text-sm text-white focus:outline-none appearance-none"
                    onChange={e => setNewCase({...newCase, category: e.target.value})}>
                    <option value="" className="bg-[#021208]">Category</option>
                    {CASE_CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#021208]">{cat}</option>)}
                </select>
              </div>

              <input required type="number" placeholder="Professional Fee (₹)" className="w-full input-glass px-5 py-4 text-sm text-white focus:outline-none" 
                onChange={e => setNewCase({...newCase, feeAmount: Number(e.target.value)})} />

              <textarea placeholder="Brief summary of matter..." className="w-full input-glass px-5 py-4 text-sm text-white focus:outline-none h-32 resize-none"
                onChange={e => setNewCase({...newCase, description: e.target.value})}></textarea>

              <div className="flex space-x-4 pt-6">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 border border-emerald-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">Discard</button>
                <button type="submit" className="flex-1 neon-button text-black font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest">Execute Case</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdvocateCases;

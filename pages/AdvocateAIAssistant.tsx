
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { gemini } from '../geminiService';
import { User, UserRole } from '../types';

const AdvocateAIAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const currentUser: User = JSON.parse(localStorage.getItem('aa_current_user') || '{}');

  const handleResearch = async () => {
    if (!query) return;
    setLoading(true);
    const research = await gemini.getLegalResearch(query);
    setResult(research || "Error fetching result.");
    setLoading(false);
  };

  return (
    <Layout role={UserRole.ADVOCATE} userName={currentUser.name}>
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 rounded-3xl mb-8 border-emerald-500/20">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <i className="fas fa-robot mr-3 text-emerald-400"></i>
                AI Legal Research Assistant
            </h2>
            <p className="text-emerald-100/60 mb-6">Enter a legal topic, case query, or drafting request to get instant AI-powered insights.</p>
            
            <div className="flex space-x-4">
                <input 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Precedents for property dispute involving ancestral land..."
                    className="flex-1 bg-emerald-900/40 border border-emerald-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button 
                    onClick={handleResearch}
                    disabled={loading}
                    className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-emerald-950 font-bold px-8 py-4 rounded-2xl transition-all shadow-lg neon-glow"
                >
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Research'}
                </button>
            </div>
        </div>

        {result && (
          <div className="glass-card p-8 rounded-3xl animate-in fade-in duration-500 border border-emerald-900/50">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-emerald-400 uppercase tracking-widest text-sm">Research Result</h3>
                <button className="text-xs text-emerald-100/40 hover:text-white" onClick={() => window.print()}>
                    <i className="fas fa-print mr-2"></i> Print Report
                </button>
            </div>
            <div className="prose prose-invert max-w-none text-emerald-50 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                {result}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdvocateAIAssistant;

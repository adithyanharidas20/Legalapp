
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../database';
import { ChatMessage, User } from '../types';

interface ChatWindowProps {
  currentUser: User;
  targetUser: User;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, targetUser, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = () => {
      const allMsgs = db.getChatMessages();
      const filtered = allMsgs.filter(m => 
        (m.senderId === currentUser.id && m.receiverId === targetUser.id) ||
        (m.senderId === targetUser.id && m.receiverId === currentUser.id)
      );
      setMessages(filtered);
    };

    loadMessages();
    const interval = setInterval(loadMessages, 2000); // Polling for "real-time" simulation
    return () => clearInterval(interval);
  }, [currentUser.id, targetUser.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      receiverId: targetUser.id,
      text: inputText,
      timestamp: new Date().toISOString()
    };

    db.saveChatMessage(newMsg);
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md bg-[#021208] border border-emerald-900/40 rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="p-4 bg-emerald-950/40 border-b border-emerald-900/40 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center font-black text-white">
            {targetUser.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-black text-white uppercase tracking-wider">{targetUser.name}</p>
            <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">Connected</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-600 text-[10px] uppercase font-black tracking-widest italic">
            Secure channel initialized. Say hello.
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === currentUser.id;
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  isMe ? 'bg-[#48f520] text-black font-medium' : 'bg-emerald-900/40 text-white'
                }`}>
                  <p>{m.text}</p>
                  <p className={`text-[8px] mt-1 uppercase font-black opacity-50 ${isMe ? 'text-black' : 'text-emerald-500'}`}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-emerald-950/20 border-t border-emerald-900/40 flex space-x-2">
        <input 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Command..."
          className="flex-1 bg-black/40 border border-emerald-900/40 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#48f520]"
        />
        <button type="submit" className="w-10 h-10 bg-[#48f520] text-black rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(72,245,32,0.3)]">
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;

'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Search, Plus, Terminal, Hash, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = query(collection(db, "solutions"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans">
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/5 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal className="text-emerald-500" size={20} />
            <h1 className="font-mono font-bold text-white tracking-tighter text-sm uppercase">Dev_Log_v2</h1>
          </div>
          <Link href="/nuevo" className="bg-white text-black px-4 py-2 rounded-lg text-xs font-black hover:bg-emerald-400 transition-colors">
            + AGREGAR ENTRADA
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto pt-24 p-6">
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
          <input 
            type="text" 
            placeholder="Filtrar por error o plataforma..." 
            className="w-full bg-slate-900/50 border border-white/5 p-4 pl-12 rounded-xl outline-none focus:border-emerald-500/50 transition-all text-sm"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets
            .filter(t => t.titulo.toLowerCase().includes(search.toLowerCase()) || t.app.toLowerCase().includes(search.toLowerCase()))
            .map((ticket, index) => (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                key={ticket.id}
                className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl hover:bg-slate-900/80 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-mono text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {ticket.app}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono italic">
                    {ticket.fecha?.toDate().toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{ticket.titulo}</h3>
                <div className="bg-[#05070a] p-4 rounded-lg border border-white/5">
                  <p className="text-slate-400 text-xs font-mono leading-relaxed whitespace-pre-wrap">
                    <span className="text-emerald-900 mr-2 font-bold">{">"}</span>
                    {ticket.solucion}
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      </main>
    </div>
  );
}

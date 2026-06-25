'use client';
import { useState, useEffect } from 'react';
import { db, doc, deleteDoc, updateDoc } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Search, Terminal, Trash2, Edit2, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [editingTicket, setEditingTicket] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, "solutions"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta entrada de tu diario?')) {
      await deleteDoc(doc(db, "solutions", id));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDoc(doc(db, "solutions", editingTicket.id), {
      titulo: editingTicket.titulo,
      app: editingTicket.app,
      solucion: editingTicket.solucion
    });
    setEditingTicket(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0c14] text-slate-300 font-sans selection:bg-emerald-500/30">
      {/* Navbar con efecto glass */}
      <nav className="sticky top-0 w-full z-50 bg-[#0a0c14]/80 backdrop-blur-xl border-b border-white/5 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <Terminal className="text-emerald-400" size={24} />
            </div>
            <h1 className="font-bold text-white tracking-tight text-xl">MI DIARIO INGENES HUBSPOT</h1>
          </div>
          <Link href="/nuevo" className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            <Sparkles size={14} /> AGREGAR ENTRADA
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 mt-6">
        {/* Barra de búsqueda mejorada */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Buscar en tus notas..." 
            className="w-full bg-[#11131d] border border-white/5 p-5 pl-14 rounded-2xl text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Grid de Tarjetas Estilo "Card Glow" */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.filter(t => t.titulo.toLowerCase().includes(search.toLowerCase()) || t.app.toLowerCase().includes(search.toLowerCase())).map((ticket) => (
            <motion.div key={ticket.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group relative bg-[#11131d] border border-white/5 p-6 rounded-3xl hover:border-emerald-500/30 transition-all hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.15)]">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">{ticket.app}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingTicket(ticket)} className="text-slate-500 hover:text-white"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(ticket.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-4 line-clamp-2">{ticket.titulo}</h3>
              <div className="bg-[#0a0c14] p-4 rounded-xl border border-white/5">
                <p className="text-slate-400 text-xs font-mono leading-relaxed">{ticket.solucion}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Modal Moderno */}
      <AnimatePresence>
        {editingTicket && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingTicket(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.form initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onSubmit={handleUpdate} className="relative bg-[#11131d] border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Editar entrada</h2>
                <button onClick={() => setEditingTicket(null)} className="text-slate-500 hover:text-white"><X size={20} /></button>
              </div>
              <input className="w-full bg-[#0a0c14] border border-white/5 p-4 rounded-xl mb-3 outline-none focus:border-emerald-500" value={editingTicket.titulo} onChange={(e) => setEditingTicket({...editingTicket, titulo: e.target.value})} />
              <input className="w-full bg-[#0a0c14] border border-white/5 p-4 rounded-xl mb-3 outline-none focus:border-emerald-500" value={editingTicket.app} onChange={(e) => setEditingTicket({...editingTicket, app: e.target.value})} />
              <textarea className="w-full bg-[#0a0c14] border border-white/5 p-4 rounded-xl h-32 outline-none focus:border-emerald-500" value={editingTicket.solucion} onChange={(e) => setEditingTicket({...editingTicket, solucion: e.target.value})} />
              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl mt-6 transition-colors">Guardar Cambios</button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

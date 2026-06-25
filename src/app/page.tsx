'use client';
import { useState, useEffect } from 'react';
import { db, doc, deleteDoc, updateDoc } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Search, Terminal, Trash2, Edit2, X } from 'lucide-react';
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
    if (confirm('¿Seguro que quieres borrar este ticket?')) {
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
        <input 
          type="text" 
          placeholder="Filtrar por error o plataforma..." 
          className="w-full bg-slate-900/50 border border-white/5 p-4 rounded-xl mb-10 text-sm outline-none focus:border-emerald-500"
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.filter(t => t.titulo.toLowerCase().includes(search.toLowerCase()) || t.app.toLowerCase().includes(search.toLowerCase())).map((ticket) => (
            <motion.div key={ticket.id} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded">{ticket.app}</span>
                <div className="flex gap-2">
                  <button onClick={() => setEditingTicket(ticket)} className="text-slate-600 hover:text-white"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(ticket.id)} className="text-slate-600 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{ticket.titulo}</h3>
              <p className="text-slate-400 text-xs font-mono bg-[#05070a] p-4 rounded-lg">{ticket.solucion}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Modal de Edición */}
      <AnimatePresence>
        {editingTicket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-[100]">
            <form onSubmit={handleUpdate} className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-lg">
              <div className="flex justify-between mb-4">
                <h2 className="text-white font-bold">Editar Ticket</h2>
                <button onClick={() => setEditingTicket(null)}><X size={20} /></button>
              </div>
              <input className="w-full bg-black p-3 rounded mb-2" value={editingTicket.titulo} onChange={(e) => setEditingTicket({...editingTicket, titulo: e.target.value})} />
              <input className="w-full bg-black p-3 rounded mb-2" value={editingTicket.app} onChange={(e) => setEditingTicket({...editingTicket, app: e.target.value})} />
              <textarea className="w-full bg-black p-3 rounded h-32" value={editingTicket.solucion} onChange={(e) => setEditingTicket({...editingTicket, solucion: e.target.value})} />
              <button type="submit" className="w-full bg-emerald-500 text-black font-bold py-2 rounded mt-4">Guardar Cambios</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NuevoTicket() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    
    try {
      await addDoc(collection(db, "solutions"), {
        titulo: formData.get('titulo'),
        app: formData.get('app'),
        solucion: formData.get('solucion'),
        fecha: serverTimestamp(),
      });
      window.location.href = "/";
    } catch (e) { alert("Error al guardar datos."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-6 flex flex-col items-center">
      <div className="w-full max-w-lg pt-12">
        <Link href="/" className="text-slate-600 hover:text-white flex items-center gap-2 mb-8 text-xs font-mono">
          <ChevronLeft size={14} /> CANCEL_AND_RETURN
        </Link>

        <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Platform</label>
            <input name="app" required placeholder="HubSpot, Vercel, etc." className="w-full bg-[#05070a] border border-white/10 p-3 rounded-lg outline-none focus:border-emerald-500 text-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Issue_Subject</label>
            <input name="titulo" required placeholder="Título del error..." className="w-full bg-[#05070a] border border-white/10 p-3 rounded-lg outline-none focus:border-emerald-500 text-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Resolution_Steps</label>
            <textarea name="solucion" rows="6" required placeholder="Escribe aquí la solución paso a paso..." className="w-full bg-[#05070a] border border-white/10 p-3 rounded-lg outline-none focus:border-emerald-500 text-xs font-mono resize-none" />
          </div>

          <button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs">
            {loading ? "PROCESANDO..." : "REGISTRAR EN MEMORIA"}
          </button>
        </form>
      </div>
    </div>
  );
}
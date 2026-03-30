import { AlertTriangle, Info } from 'lucide-react';

export const Incidents = () => {
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Investigations & Incidents
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Audit logs and reported issues for physical and digital assets.
        </p>
      </div>

      <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center p-12 text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-orange-100">
          <AlertTriangle className="w-10 h-10 text-[#ff8000]" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Audit Logs Restricted
        </h2>
        <p className="text-slate-500 max-w-sm font-medium">
          The incident management engine is being synchronized with the new
          asset reporting system. Logs will be visible once the data migration
          is complete.
        </p>

        <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Info className="w-3 h-3 text-[#ff8000]" />
          Data Synchronization In Progress
        </div>
      </div>
    </div>
  );
};

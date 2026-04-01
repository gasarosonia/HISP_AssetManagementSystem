import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LifeBuoy,
  Plus,
  ShieldAlert,
  Monitor,
  Smartphone,
  Printer,
  Box,
  Calendar,
  Check,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { Asset } from '../types/assets';

export const StaffOverview = ({
  onOpenRequest,
  onOpenIncident,
}: {
  onOpenRequest: () => void;
  onOpenIncident: () => void;
}) => {
  const { user: currentUser } = useAuth();

  const { data: assets } = useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await api.get('/assets');
      return response.data;
    },
  });

  const stats = useMemo(() => {
    if (!assets) return null;

    const userAssets = assets.filter(
      (a) => a.assigned_to?.id === currentUser?.id,
    );

    return {
      userAssets,
      userAssetsCount: userAssets.length,
    };
  }, [assets, currentUser]);

  const getAssetIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('laptop') || n.includes('computer'))
      return <Monitor className="w-8 h-8" />;
    if (n.includes('phone')) return <Smartphone className="w-8 h-8" />;
    if (n.includes('printer')) return <Printer className="w-8 h-8" />;
    return <Box className="w-8 h-8" />;
  };

  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="px-3 py-1 bg-blue-50 rounded-full border border-blue-100 text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-1.5 shadow-sm">
              <LifeBuoy className="w-3.5 h-3.5" /> Personnel Portal
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {currentUser?.department?.name || 'Operations'} Directorate
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">
            Equipment Dashboard
          </h1>
          <p className="text-slate-500 font-medium text-sm max-w-xl leading-relaxed">
            Overview of your assigned assets and quick access to requisition
            tools.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content: Assets */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <div className="w-1 h-6 bg-blue-500 rounded-full" /> Assets
              Assigned To Me
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.userAssets?.map((asset) => (
              <div
                key={asset.id}
                className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-slate-100 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3">
                  <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                    Functional
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors border border-slate-50 shadow-inner">
                  <div className="text-slate-400 group-hover:text-blue-500 transition-colors scale-50">
                    {getAssetIcon(asset.name)}
                  </div>
                </div>
                <h4 className="text-base font-black text-slate-900 mb-0.5 truncate group-hover:text-[#ff8000] transition-colors">
                  {asset.name}
                </h4>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 leading-none">
                  {asset.tag_id || asset.serial_number}
                </p>
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      Assigned Mar 2024
                    </span>
                  </div>
                  <Check className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            ))}
            {(!stats.userAssets || stats.userAssets.length === 0) && (
              <div className="col-span-full py-20 px-8 text-center bg-slate-50 border-2 border-dashed border-slate-100 rounded-2xl">
                <Box className="w-12 h-12 text-slate-200 mx-auto mb-4 opacity-20" />
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  No assets found
                </h4>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-1">
              Quick Actions
            </h3>
            <div className="space-y-4">
              <button
                onClick={onOpenRequest}
                className="w-full group relative bg-[#ff8000] rounded-xl p-3.5 text-white text-left overflow-hidden transition-all hover:shadow-lg hover:shadow-orange-100"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Plus className="w-4.5 h-4.5 text-white group-hover:rotate-90 transition-transform duration-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black tracking-tight mb-0">
                      Request Asset
                    </h4>
                    <p className="text-white/70 text-[10px] font-medium leading-tight line-clamp-1">
                      Start a requisition
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={onOpenIncident}
                className="w-full group relative bg-orange-50 border border-orange-100 rounded-xl p-3.5 text-left overflow-hidden transition-all hover:bg-orange-100/50"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center border border-orange-200">
                    <ShieldAlert className="w-4.5 h-4.5 text-[#ff8000]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 tracking-tight mb-0">
                      Report Issue
                    </h4>
                    <p className="text-slate-500 text-[10px] font-medium leading-tight line-clamp-1">
                      Broken or lost equipment?
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Notice
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Assets listed here are officially assigned to your personnel
              record. For transfer requests, please contact Operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

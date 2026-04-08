import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  Monitor,
  Smartphone,
  Printer,
  Box,
  Users,
  Laptop,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { Asset } from '../types/assets';

export const HODOverview = () => {
  const { user: currentUser } = useAuth();

  const { data: assets } = useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await api.get('/assets');
      return response.data;
    },
  });

  const stats = useMemo(() => {
    if (!assets || !currentUser?.department?.id) return null;

    const departmentAssets = assets.filter(
      (a) => a.department?.id === currentUser?.department?.id,
    );

    const sharedAssets = departmentAssets.filter((a) => !a.assigned_to);
    const individualAssets = departmentAssets.filter((a) => !!a.assigned_to);

    return {
      total: departmentAssets.length,
      sharedAssets,
      individualAssets,
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'ASSIGNED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'BROKEN':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'MISSING':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="px-3 py-1 bg-orange-50 rounded-full border border-orange-100 text-[9px] font-black uppercase tracking-[0.2em] text-[#ff8000] flex items-center gap-1.5 shadow-sm">
              <Building2 className="w-3.5 h-3.5" /> Department Portal
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {currentUser?.department?.name || 'Unknown'} Directorate
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">
            HOD Overview Dashboard
          </h1>
          <p className="text-slate-500 font-medium text-sm max-w-xl leading-relaxed">
            Manage your department's shared resources and monitor staff-assigned
            equipment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
            <Box className="w-6 h-6 text-[#ff8000]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Total Dept Assets
            </p>
            <p className="text-2xl font-black text-slate-800">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Shared Assets
            </p>
            <p className="text-2xl font-black text-slate-800">
              {stats.sharedAssets.length}
            </p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Laptop className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Individual Staff Assets
            </p>
            <p className="text-2xl font-black text-slate-800">
              {stats.individualAssets.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Shared Assets */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-1 h-6 bg-blue-500 rounded-full" /> Shared
            Department Assets
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {stats.sharedAssets.map((asset) => (
              <div
                key={asset.id}
                className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4 group hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <div className="text-slate-400 group-hover:text-blue-500 transition-colors scale-75">
                    {getAssetIcon(asset.name)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-slate-900 truncate">
                    {asset.name}
                  </h4>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 truncate">
                    {asset.tag_id || asset.serial_number}
                  </p>
                </div>
                <div
                  className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(asset.status)}`}
                >
                  {asset.status}
                </div>
              </div>
            ))}
            {stats.sharedAssets.length === 0 && (
              <div className="py-12 px-8 text-center bg-slate-50 border border-slate-100 rounded-2xl">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  No Shared Assets
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Individual Assets */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-1 h-6 bg-emerald-500 rounded-full" /> Individual
            Staff Assets
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {stats.individualAssets.map((asset) => (
              <div
                key={asset.id}
                className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4 group hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <div className="text-slate-400 group-hover:text-emerald-500 transition-colors scale-75">
                    {getAssetIcon(asset.name)}
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <h4 className="text-sm font-black text-slate-900 truncate">
                    {asset.name}
                  </h4>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#ff8000] truncate">
                    {asset.assigned_to?.full_name}
                  </p>
                </div>
                <div
                  className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(asset.status)}`}
                >
                  {asset.status}
                </div>
              </div>
            ))}
            {stats.individualAssets.length === 0 && (
              <div className="py-12 px-8 text-center bg-slate-50 border border-slate-100 rounded-2xl">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  No Individual Assets
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

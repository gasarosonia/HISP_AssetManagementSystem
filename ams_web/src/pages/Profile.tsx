import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  User as UserIcon,
  Mail,
  Building2,
  ShieldCheck,
  Calendar,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import { Asset } from '../types/assets';

export const Profile = () => {
  const { user } = useAuth();

  const { data: assets } = useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await api.get('/assets');
      return response.data;
    },
  });

  const myAssets = useMemo(() => {
    if (!assets) return [];
    return assets.filter((a) => a.assigned_to?.id === user?.id);
  }, [assets, user]);

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ff8000] to-[#e49f37] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-orange-100 border-2 border-white">
            {user.full_name?.charAt(0)}
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-1.5 pt-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {user.full_name}
              </h1>
              <div className="hidden sm:flex px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-black uppercase tracking-widest border border-emerald-100 items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified
              </div>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-400 font-medium text-xs">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-orange-400/60" />
                <span>{user.email}</span>
              </div>
              <div className="hidden md:block w-1 h-1 rounded-full bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-orange-400/60" />
                <span>{user.department?.name || 'Operations'}</span>
              </div>
            </div>
          </div>
        </div>

        <button className="relative z-10 px-5 py-2.5 bg-slate-50 border border-slate-200 hover:border-[#ff8000] rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-[#ff8000] transition-all flex items-center gap-2">
          <Edit className="w-3.5 h-3.5" /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm min-h-[400px]">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2.5 px-1 pt-1">
              <Laptop className="w-5 h-5 text-orange-400" /> My Assigned
              Equipment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myAssets.length > 0 ? (
                myAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-5 bg-slate-50/40 border border-slate-100 rounded-xl flex flex-col justify-between group hover:bg-white hover:border-orange-100 transition-all border-b-2 hover:border-b-[#ff8000] active:scale-[0.98]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                        <Laptop className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mb-0.5">
                          Status
                        </p>
                        <p className="text-[10px] font-bold text-slate-600">
                          Active
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 group-hover:text-[#ff8000] transition-colors truncate">
                        {asset.name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {asset.tag_id || asset.serial_number}
                        </p>
                        <ExternalLink className="w-3 h-3 text-slate-200 group-hover:text-slate-400" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                  <AlertCircle className="w-10 h-10 text-slate-200 mx-auto mb-4 opacity-40" />
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    No equipment found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-1">
              Account Metadata
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
                  <UserIcon className="w-4.5 h-4.5 text-[#ff8000]" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5 leading-none">
                    Access Level
                  </p>
                  <p className="text-xs font-black text-slate-900 tracking-tight">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                  <Calendar className="w-4.5 h-4.5 text-blue-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5 leading-none">
                    Registered Since
                  </p>
                  <p className="text-xs font-black text-slate-900 tracking-tight">
                    {new Date().toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5 leading-none">
                    Account Status
                  </p>
                  <p className="text-xs font-black text-emerald-500 tracking-tight">
                    Active & Secured
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
              System Identity
            </p>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <code className="text-[9px] font-bold text-slate-500 break-all uppercase tracking-tighter">
                UUID-AMS-{user.id?.substring(0, 8) || 'SYSTEM'}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

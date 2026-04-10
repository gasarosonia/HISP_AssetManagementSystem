import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Banknote,
  ArrowRight,
  Monitor,
  Target,
  ShieldCheck,
  ShieldAlert,
  TrendingDown,
  Activity,
  FileText,
  Building2,
  PieChart,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { Asset, AssetRequest, User } from '../types/assets';

export const CEOOverview = () => {
  const navigate = useNavigate();
  const { isCEO } = useAuth();

  const { data: assets } = useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await api.get('/assets');
      return response.data;
    },
  });

  const { data: requests } = useQuery<AssetRequest[]>({
    queryKey: ['assets-requests'],
    queryFn: async () => {
      const response = await api.get('/assets-requests');
      return response.data;
    },
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data;
    },
    enabled: isCEO,
  });

  const stats = useMemo(() => {
    if (!assets || !requests) return null;

    const totalValue = assets.reduce(
      (sum, a) => sum + (Number(a.current_value) || 0),
      0,
    );
    const purchaseCost = assets.reduce(
      (sum, a) => sum + (Number(a.purchase_cost) || 0),
      0,
    );
    const totalDepreciation = purchaseCost - totalValue;

    const missingAssets = assets.filter((a) => a.status === 'MISSING').length;
    const brokenAssets = assets.filter((a) => a.status === 'BROKEN').length;

    // CEO specifically cares about requests in CEO_REVIEW
    const ceoPending = requests.filter((r) => r.status === 'CEO_REVIEW');
    const ceoPendingValue = ceoPending.reduce((sum, r: AssetRequest) => {
      const val =
        r.financials?.grand_total ??
        (r.quantity || 0) * (r.estimated_unit_cost || 0);
      return sum + val;
    }, 0);

    const departments: Record<string, { count: number; value: number }> = {};
    assets.forEach((a) => {
      const deptName = a.department?.name || 'Unassigned';
      if (!departments[deptName])
        departments[deptName] = { count: 0, value: 0 };
      departments[deptName].count++;
      departments[deptName].value += Number(a.current_value) || 0;
    });

    const topDepartments = Object.entries(departments)
      .sort((a, b) => b[1].value - a[1].value)
      .slice(0, 5);

    const categories: Record<string, { count: number; value: number }> = {};
    assets.forEach((a) => {
      const catName = a.category?.name || 'Uncategorized';
      if (!categories[catName]) categories[catName] = { count: 0, value: 0 };
      categories[catName].count++;
      categories[catName].value += Number(a.current_value) || 0;
    });

    return {
      totalValue,
      inventoryCount: assets.length,
      ceoPendingCount: ceoPending.length,
      ceoPendingValue,
      missingAssets,
      brokenAssets,
      totalUsers: users?.length || 0,
      totalDepreciation,
      topDepartments,
      categories: Object.entries(categories).sort(
        (a, b) => b[1].value - a[1].value,
      ),
      ceoRequests: ceoPending
        .sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime(),
        )
        .slice(0, 5),
    };
  }, [assets, requests, users]);

  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2 px-1">
            <div className="px-2 py-0.5 bg-indigo-50 rounded-md border border-indigo-100 text-[8px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3 h-3 text-indigo-500" /> Executive
              Strategic Dashboard
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
            Asset Intelligence Portal
          </h1>
          <p className="text-slate-500 font-medium mt-3 text-sm max-w-xl leading-relaxed">
            Corporate oversight, procurement authorization, and
            organization-wide resource stewardship for HISP-Rwanda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'Total Asset Value',
            value: (stats.totalValue || 0).toLocaleString(),
            unit: 'RWF',
            icon: Banknote,
            color: 'indigo',
            trend: 'Direct Valuation',
            path: '/assets',
          },
          {
            label: 'Executive Approvals',
            value: stats.ceoPendingCount,
            unit: 'AWAITING',
            icon: Target,
            color: 'amber',
            trend: `${(stats.ceoPendingValue || 0).toLocaleString()} Exposure`,
            path: '/requests',
          },
          {
            label: 'Asset Roster',
            value: stats.inventoryCount,
            unit: 'UNITS',
            icon: Monitor,
            color: 'emerald',
            trend: 'Resource Deployment',
            path: '/assets',
          },
          {
            label: 'Directorates',
            value: stats.topDepartments.length,
            unit: 'ACTIVE',
            icon: Building2,
            color: 'purple',
            trend: `${stats.totalUsers} Workforce Node`,
            path: '/directorate',
          },
        ].map((stat, i) => (
          <Link
            key={i}
            to={stat.path}
            className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm group hover:border-indigo-500 hover:shadow-md transition-all block relative overflow-hidden"
          >
            <div
              className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-full blur-2xl -mr-8 -mt-8`}
            />
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-colors">
                <stat.icon className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1 leading-none">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2 leading-none">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                {stat.value}
              </h3>
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                {stat.unit}
              </span>
            </div>
            <p className="mt-4 text-[9px] font-bold uppercase tracking-widest text-slate-400">
              {stat.trend}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {stats.ceoPendingCount > 0 && (
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 relative overflow-hidden group shadow-lg shadow-indigo-100">
              <div className="absolute top-0 right-0 w-64 h-full bg-white/10 blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner shrink-0">
                    <ShieldAlert className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-[0.1em]">
                      Executive Authorization Pending
                    </h3>
                    <p className="text-white/70 text-xs font-medium leading-relaxed mt-1">
                      There are {stats.ceoPendingCount} verified procurement
                      requisitions totaling{' '}
                      {stats.ceoPendingValue.toLocaleString()} RWF that require
                      your immediate approval.
                    </p>
                  </div>
                </div>
                <Link
                  to="/requests"
                  className="px-6 py-3 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl whitespace-nowrap"
                >
                  Review Queue
                </Link>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <Activity className="w-6 h-6 text-indigo-500" /> Pending
                  Decisions
                </h3>
                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">
                  Awaiting Executive Signature
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {stats.ceoRequests.length > 0 ? (
                stats.ceoRequests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => navigate('/requests')}
                    className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:border-indigo-200 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100 text-indigo-500 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-black text-slate-800 group-hover:text-indigo-600 transition-colors truncate mb-1">
                          {req.title}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                            <Building2 className="w-3.5 h-3.5" />{' '}
                            {req.department?.name}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <p className="text-[11px] font-bold text-slate-500">
                            Requested by{' '}
                            <span className="text-slate-900 font-black">
                              {req.requested_by?.full_name}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-3 shrink-0">
                      <p className="text-xl font-black text-slate-900 tracking-tight">
                        {(req.financials?.grand_total || 0).toLocaleString()}{' '}
                        <span className="text-xs text-slate-400">RWF</span>
                      </p>
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-purple-100">
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                  <Activity className="w-12 h-12 text-slate-200 mx-auto mb-4 opacity-40" />
                  <p className="text-sm text-slate-400 font-black uppercase tracking-widest">
                    Procurement pipeline is clear
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-8 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-400" /> Capital
              Allocation
            </h3>
            <div className="space-y-8">
              {stats.categories.slice(0, 6).map(([name, data]) => (
                <div key={name} className="group/item">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3 group-hover/item:text-indigo-600 transition-colors">
                    <span>{name}</span>
                    <span>
                      {((data.value / (stats.totalValue || 1)) * 100).toFixed(
                        0,
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div
                      className="h-full bg-indigo-500 group-hover/item:bg-indigo-600 transition-all duration-1000 ease-out"
                      style={{
                        width: `${(data.value / (stats.totalValue || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
                    <span>{data.count} Assets</span>
                    <span>{data.value.toLocaleString()} RWF</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">
                Cumulative Depreciation
              </p>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-3">
                <TrendingDown className="w-6 h-6 text-red-500" />{' '}
                {stats.totalDepreciation.toLocaleString()}{' '}
                <span className="text-xs text-slate-400">RWF</span>
              </h4>
            </div>
          </div>

          <div className="p-8 bg-slate-900 rounded-3xl relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 text-center">
              Network Stability
            </p>
            <div className="flex flex-col items-center gap-3 text-white">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  {new Date().toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  UTC
                </span>
              </div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                HISP-AMS NODE: 01-RWANDA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

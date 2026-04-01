import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Search,
  Eye,
  Calendar,
  User as UserIcon,
  Laptop,
  Clock,
  Trash2,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../lib/api';
import { ResolveIncidentModal } from '../components/ResolveIncidentModal';
import { useAuth } from '../hooks/useAuth';
import { AssetIncident } from '../types/assets';

export const Incidents = () => {
  const { isFinanceAdmin, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedIncident, setSelectedIncident] =
    useState<AssetIncident | null>(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  const { data: incidents, isLoading } = useQuery<AssetIncident[]>({
    queryKey: ['asset-incidents'],
    queryFn: async () => {
      const response = await api.get('/asset-incidents');
      return response.data;
    },
  });

  const filteredIncidents = useMemo(() => {
    if (!incidents) return [];
    let result = incidents;

    if (filterType !== 'ALL') {
      result = result.filter((i) => i.incident_type === filterType);
    }

    if (filterStatus !== 'ALL') {
      result = result.filter((i) => i.investigation_status === filterStatus);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.asset?.name?.toLowerCase().includes(q) ||
          i.reported_by?.full_name?.toLowerCase().includes(q) ||
          i.explanation?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [incidents, filterType, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    if (!incidents) return { investigating: 0, accepted: 0, denied: 0 };
    return {
      investigating: incidents.filter(
        (i) => i.investigation_status === 'INVESTIGATING',
      ).length,
      accepted: incidents.filter((i) => i.investigation_status === 'ACCEPTED')
        .length,
      denied: incidents.filter((i) => i.investigation_status === 'DENIED')
        .length,
    };
  }, [incidents]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'INVESTIGATING':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'ACCEPTED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'DENIED':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const handleResolve = (incident: AssetIncident) => {
    setSelectedIncident(incident);
    setIsResolveModalOpen(true);
  };

  if (!isAdmin && !isFinanceAdmin) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center text-center animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mb-6 border border-red-100">
          <ShieldX className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">
          Access Restricted
        </h1>
        <p className="text-slate-500 font-medium max-w-sm">
          Investigations and audit logs are only accessible to Administration
          and Finance personnel.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-[#ff8000] rounded-full" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff8000]">
              Security & Audit
            </h4>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            Investigations
          </h1>
          <p className="text-slate-500 font-medium mt-3 text-xs max-w-xl leading-relaxed">
            Audit logs for broken or missing equipment. Investigation outcomes
            determine replacement eligibility or staff penalties.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm hover:bg-slate-50 flex items-center gap-2 group">
            <Download className="w-4 h-4 text-[#ff8000]" /> Export Logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center shadow-inner border border-amber-100">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5 leading-none">
              Open Cases
            </p>
            <p className="text-xl font-black text-slate-900 leading-none">
              {stats.investigating}{' '}
              <span className="text-[9px] font-bold text-slate-400">
                INVESTIGATIONS
              </span>
            </p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center shadow-inner border border-emerald-100">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5 leading-none">
              Accepted
            </p>
            <p className="text-xl font-black text-slate-900 leading-none">
              {stats.accepted}{' '}
              <span className="text-[9px] font-bold text-slate-400">
                REPLACEMENTS
              </span>
            </p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center shadow-inner border border-red-100">
            <ShieldX className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5 leading-none">
              Denied
            </p>
            <p className="text-xl font-black text-slate-900 leading-none">
              {stats.denied}{' '}
              <span className="text-[9px] font-bold text-slate-400">
                PENALTIES
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white p-2.5 rounded-2xl shadow-lg mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by asset, tag, or personnel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none pl-12 pr-4 py-2.5 text-xs font-black text-slate-700 placeholder:text-slate-400 outline-none"
          />
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          {['ALL', 'BROKEN', 'MISSING'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-2 focus:ring-[#ff8000]/10"
          >
            <option value="ALL">All Status</option>
            <option value="INVESTIGATING">INVESTIGATING</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="DENIED">DENIED</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Incident Details
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Affected Asset
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Reporter
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                  Status
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-20 text-center text-xs font-black text-slate-300 uppercase tracking-widest"
                  >
                    Compiling Investigation Data...
                  </td>
                </tr>
              )}

              {!isLoading &&
                filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${
                            inc.incident_type === 'MISSING'
                              ? 'bg-red-50 text-red-500 border-red-100'
                              : 'bg-orange-50 text-orange-500 border-orange-100'
                          }`}
                        >
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">
                            #{inc.id.slice(0, 8).toUpperCase()} -{' '}
                            {inc.incident_type}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter truncate max-w-[200px]">
                            {inc.explanation}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black text-slate-700 flex items-center gap-2">
                          <Laptop className="w-3.5 h-3.5 text-slate-400" />{' '}
                          {inc.asset?.name || 'Legacy Asset'}
                        </span>
                        <span className="text-[8px] font-black text-[#ff8000] uppercase tracking-widest">
                          {inc.asset?.tag_id || 'NO TAG'}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-black text-slate-700 flex items-center gap-2">
                          <UserIcon className="w-3.5 h-3.5 text-slate-400" />{' '}
                          {inc.reported_by?.full_name}
                        </span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />{' '}
                          {new Date(inc.reported_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5 text-center">
                      <div
                        className={`inline-flex px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(inc.investigation_status)} shadow-sm`}
                      >
                        {inc.investigation_status}
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2 pr-2">
                        {inc.investigation_status === 'INVESTIGATING' && (
                          <button
                            onClick={() => handleResolve(inc)}
                            className="p-2 bg-orange-50 text-[#ff8000] hover:bg-[#ff8000] hover:text-white rounded-lg transition-all shadow-sm border border-orange-100"
                            title="Resolve Investigation"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-lg transition-all border border-slate-100">
                          <Eye className="w-4 h-4" />
                        </button>
                        {(isFinanceAdmin || isAdmin) && (
                          <button className="p-2 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-100">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              {(!incidents || filteredIncidents.length === 0) && !isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-32 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="w-12 h-12 text-emerald-100 mb-4" />
                      <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">
                        No investigation logs found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
          <span>{filteredIncidents.length} Investigations Registered</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Pending
              Audit
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Case
              Resolved
            </span>
          </div>
        </div>
      </div>

      {selectedIncident && (
        <ResolveIncidentModal
          isOpen={isResolveModalOpen}
          onClose={() => {
            setIsResolveModalOpen(false);
            setSelectedIncident(null);
          }}
          incident={selectedIncident}
        />
      )}
    </div>
  );
};

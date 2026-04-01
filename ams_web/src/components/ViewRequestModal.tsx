import {
  X,
  FileText,
  Banknote,
  Building2,
  User as UserIcon,
  Calendar,
  AlertTriangle,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from 'lucide-react';

import { AssetRequest } from '../pages/Requests';

interface ViewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: AssetRequest | null;
}

export const ViewRequestModal = ({
  isOpen,
  onClose,
  request,
}: ViewRequestModalProps) => {
  if (!isOpen || !request) return null;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'APPROVED':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'FULFILLED':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-3.5 h-3.5" />;
      case 'APPROVED':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'FULFILLED':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'REJECTED':
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return <Activity className="w-3.5 h-3.5" />;
    }
  };

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'HIGH':
        return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'MEDIUM':
        return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'LOW':
        return 'text-slate-600 bg-slate-100 border-slate-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const totalCost =
    (request.quantity || 0) * (request.estimated_unit_cost || 0);

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col border-l border-slate-100">
        <div className="px-8 py-8 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5 shadow-inner">
            <FileText className="w-7 h-7 text-blue-500" />
          </div>

          <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight mb-2">
            {request.title}
          </h2>

          <div className="flex flex-wrap gap-2 mt-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(request.status)}`}
            >
              {getStatusIcon(request.status)} {request.status}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getUrgencyStyle(request.urgency)}`}
            >
              {request.urgency === 'CRITICAL' && (
                <AlertTriangle className="w-3 h-3" />
              )}{' '}
              URGENCY: {request.urgency}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Banknote className="w-3.5 h-3.5" /> Budget Calculation
            </h3>

            <div className="flex justify-between items-end mb-3 pb-3 border-b border-slate-200/60">
              <div>
                <p className="text-xs font-bold text-slate-500">Unit Cost</p>
                <p className="text-sm font-bold text-slate-800">
                  {(request.estimated_unit_cost || 0).toLocaleString()} RWF
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Multiplier
                </p>
                <p className="text-sm font-bold text-slate-600">
                  x {request.quantity}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-slate-700">
                Total Est. Cost
              </span>
              <span className="text-lg font-black text-emerald-600">
                {totalCost.toLocaleString()} RWF
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Business Justification
            </h3>
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                {request.description || 'No justification provided.'}
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Requisition Details
            </h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <UserIcon className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Requested By
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {request.requested_by?.full_name || 'Unknown User'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Charge To Directorate
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {request.department?.name || 'Unknown Directorate'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Date Submitted
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {new Date(request.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-xl shadow-sm transition-colors"
          >
            Close Requisition
          </button>
        </div>
      </div>
    </>
  );
};

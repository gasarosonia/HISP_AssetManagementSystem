import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Shield,
  User as UserIcon,
  MoreVertical,
  Building2,
  Mail,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';

const ROLES = [
  'All Roles',
  'Staff',
  'HOD',
  'Admin and Finance',
  'Office of the CEO',
];

// Define the TypeScript interface for our User data
interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department?: { name: string };
}

export const Users = () => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [showRoleFilter, setShowRoleFilter] = useState(false);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data;
    },
  });

  const isAdmin =
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'SYSTEM_ADMIN' ||
    currentUser?.role === 'Admin and Finance';

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    const q = searchQuery.toLowerCase().trim();
    return users.filter((user) => {
      const matchesSearch =
        !q ||
        user.full_name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q);
      const matchesRole =
        selectedRole === 'All Roles' || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRole]);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Staff Directory
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage enterprise access and system roles.
          </p>
        </div>

        {isAdmin && (
          <button className="bg-[#ff8000] hover:bg-[#e49f37] text-white px-5 py-2.5 rounded-xl font-bold shadow-[0_8px_16px_-6px_rgba(255,128,0,0.4)] transform active:scale-95 transition-all flex items-center gap-2 group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Provision New User
          </button>
        )}
      </div>

      <div className="bg-white/60 backdrop-blur-md border border-white p-2 rounded-2xl shadow-sm mb-6 flex items-center gap-2 relative">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="users-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-transparent border-none pl-10 pr-8 py-2 text-sm focus:ring-0 outline-none font-medium text-slate-700 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="h-6 w-px bg-slate-200 mx-2"></div>
        <div className="relative">
          <button
            onClick={() => setShowRoleFilter(!showRoleFilter)}
            className={`px-4 py-2 text-sm font-bold transition-colors rounded-xl hover:bg-white/50 ${selectedRole !== 'All Roles' ? 'text-[#ff8000]' : 'text-slate-500 hover:text-[#ff8000]'}`}
          >
            {selectedRole !== 'All Roles' ? selectedRole : 'Filter by Role'}
          </button>
          {showRoleFilter && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 z-10 overflow-hidden animate-in fade-in zoom-in duration-150">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setSelectedRole(role);
                    setShowRoleFilter(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors hover:bg-slate-50 ${selectedRole === role ? 'text-[#ff8000]' : 'text-slate-600'}`}
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Personnel
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Contact
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  System Role
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Department
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#ff8000]/30 border-t-[#ff8000] rounded-full animate-spin mb-3"></div>
                      <span className="text-sm font-bold">
                        Synchronizing Directory...
                      </span>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400 font-medium"
                  >
                    {searchQuery || selectedRole !== 'All Roles'
                      ? 'No staff members match your search.'
                      : 'No staff members found in the system.'}
                  </td>
                </tr>
              )}

              {!isLoading &&
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/60 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-white shadow-sm flex items-center justify-center text-slate-600 font-bold text-xs">
                          {user.full_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .substring(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">
                            {user.full_name}
                          </span>
                          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                            <UserIcon className="w-3 h-3" /> ID:{' '}
                            {user.id.substring(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {user.email}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                          user.role === 'Admin and Finance'
                            ? 'bg-[#ff8000]/10 text-[#ff8000] border-[#ff8000]/20'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {user.role === 'Admin and Finance' && (
                          <Shield className="w-3 h-3" />
                        )}
                        {user.role.replace('_', ' ')}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {user.department?.name || 'Unassigned'}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="p-2 text-slate-400 hover:text-[#ff8000] hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100/50 bg-white/40 flex items-center justify-between text-xs font-bold text-slate-400">
          <span>
            Showing {filteredUsers.length}
            {users && filteredUsers.length !== users.length
              ? ` of ${users.length}`
              : ''}{' '}
            users
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 hover:bg-white rounded-md transition-colors">
              Prev
            </button>
            <button className="px-3 py-1 hover:bg-white rounded-md transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

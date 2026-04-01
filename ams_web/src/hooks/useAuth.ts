import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user } = context;

  const role = user?.role?.toUpperCase() || '';
  const deptName = user?.department?.name?.toUpperCase() || '';

  const isAdmin =
    role === 'SYSTEM_ADMIN' ||
    role === 'ADMIN' ||
    role.includes('ADMIN') ||
    role.includes('FINANCE') ||
    role.includes('DIRECTOR') ||
    role.includes('OFFICER') ||
    deptName.includes('FINANCE') ||
    deptName.includes('ADMIN');

  return { ...context, isAdmin };
};

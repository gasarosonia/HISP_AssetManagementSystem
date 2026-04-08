import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AdminOverview } from './AdminOverview';
import { StaffOverview } from './StaffOverview';
import { HODOverview } from './HODOverview';

interface DashboardContext {
  openRequest: () => void;
  openIncident: () => void;
}

export const Overview = () => {
  const { isAdmin, isHOD } = useAuth();
  const { openRequest, openIncident } = useOutletContext<DashboardContext>();

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {isAdmin ? (
        <AdminOverview />
      ) : isHOD ? (
        <HODOverview />
      ) : (
        <StaffOverview
          onOpenRequest={openRequest}
          onOpenIncident={openIncident}
        />
      )}
    </div>
  );
};

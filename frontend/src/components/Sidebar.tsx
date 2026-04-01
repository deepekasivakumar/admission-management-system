import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, Settings, LogOut, Building, Map, BookOpen, Layers } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Admission CRM</div>
      
      <nav className="nav-menu">
        <NavLink to="/dashboard" className="nav-link">
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        
        {user?.role === 'ADMIN' && (
          <>
            <div className="nav-header">Masters</div>
            <NavLink to="/institution" className="nav-link">
              <Building size={20} /> Institution
            </NavLink>
            <NavLink to="/campus" className="nav-link">
              <Map size={20} /> Campus
            </NavLink>
            <NavLink to="/department" className="nav-link">
              <Layers size={20} /> Department
            </NavLink>
            <NavLink to="/program" className="nav-link">
              <BookOpen size={20} /> Program
            </NavLink>
            <NavLink to="/seat-matrix" className="nav-link">
              <Settings size={20} /> Seat Matrix
            </NavLink>
          </>
        )}

        {(user?.role === 'ADMIN' || user?.role === 'ADMISSION_OFFICER') && (
          <>
            <div className="nav-header">Process</div>
            <NavLink to="/applicants" className="nav-link">
              <Users size={20} /> Applicants
            </NavLink>
            <NavLink to="/admission" className="nav-link">
              <UserPlus size={20} /> Admission
            </NavLink>
          </>
        )}
      </nav>
      
      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <button onClick={logout} className="nav-link" style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

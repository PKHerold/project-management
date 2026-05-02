import { NavLink, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? 'bg-ethara-primary/10 text-ethara-primary'
        : 'text-gray-400 hover:bg-ethara-card hover:text-gray-200'
    }`;

  return (
    <div className="w-56 bg-ethara-bg border-r border-ethara-border flex flex-col">
      <div className="h-16 flex items-center px-4 border-b border-ethara-border">
        <h1 className="text-lg font-bold text-white">Project Manager</h1>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/projects" className={linkClass}>
          Projects
        </NavLink>
      </nav>

      <div className="p-4 border-t border-ethara-border">
        <p className="text-sm font-medium text-white mb-2">{user.name}</p>
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 border border-ethara-border rounded-md text-sm font-medium text-gray-400 hover:bg-ethara-card hover:text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

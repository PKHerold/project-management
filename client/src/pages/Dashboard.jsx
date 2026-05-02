import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  const ts = stats?.taskStats || {};

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-sm font-medium text-gray-400">Total Projects</p>
          <p className="mt-2 text-3xl font-semibold text-white">{stats?.projectCount || 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm font-medium text-gray-400">To Do</p>
          <p className="mt-2 text-3xl font-semibold text-white">{ts.todo || 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm font-medium text-gray-400">In Progress</p>
          <p className="mt-2 text-3xl font-semibold text-white">{ts.inProgress || 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm font-medium text-gray-400">Completed</p>
          <p className="mt-2 text-3xl font-semibold text-white">{ts.done || 0}</p>
        </div>
      </div>

      {ts.overdue > 0 && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-5 mb-8">
          <h3 className="text-sm font-medium text-red-400">Attention Required</h3>
          <p className="mt-2 text-sm text-red-300">You have {ts.overdue} overdue task(s).</p>
          <Link to="/projects" className="mt-4 inline-block text-sm font-medium text-red-400 hover:text-red-300 hover:underline">
            View Projects &rarr;
          </Link>
        </div>
      )}

      {stats?.myTasks?.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3">My Pending Tasks</h2>
          <div className="space-y-2">
            {stats.myTasks.map(task => (
              <div key={task.id} className="card p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <p className="text-xs text-gray-400">{task.project?.name}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No due date'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

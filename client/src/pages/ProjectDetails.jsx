import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI } from '../api';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Task modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', requirements: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', assigneeId: '' });

  // View task modal
  const [viewTask, setViewTask] = useState(null);

  // Member modal
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchProject = () => {
    setLoading(true);
    projectAPI.getById(id)
      .then(setProject)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProject(); }, [id]);

  // Open create task modal
  const openCreateTask = () => {
    setEditingTask(null);
    setTaskForm({ title: '', description: '', requirements: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
    setShowTaskModal(true);
  };

  // Open edit task modal (pre-fill data)
  const openEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      requirements: task.requirements || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      assigneeId: task.assigneeId || ''
    });
    setShowTaskModal(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await projectAPI.updateTask(id, editingTask.id, taskForm);
      } else {
        await projectAPI.addTask(id, taskForm);
      }
      setShowTaskModal(false);
      fetchProject();
    } catch (err) {
      alert(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await projectAPI.deleteTask(id, taskId);
      fetchProject();
    } catch (err) {
      alert(err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.addMember(id, { email: newMemberEmail, role: 'MEMBER' });
      setShowMemberModal(false);
      setNewMemberEmail('');
      fetchProject();
    } catch (err) {
      alert(err);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await projectAPI.removeMember(id, memberId);
      fetchProject();
    } catch (err) {
      alert(err);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectAPI.deleteProject(id);
      navigate('/projects');
    } catch (err) {
      alert(err);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await projectAPI.updateTask(id, taskId, { status: newStatus });
      fetchProject();
    } catch (err) {
      alert(err);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading project details...</div>;
  }

  if (!project) return <div className="text-center mt-10 text-red-500 font-bold">Project not found</div>;

  const userMember = project.members.find(m => m.userId === currentUser.id);
  const userRole = userMember?.role;
  const isAdmin = userRole === 'ADMIN';

  const badgeColor = {
    TODO: 'bg-gray-800 text-gray-300',
    IN_PROGRESS: 'bg-blue-900/50 text-blue-400',
    DONE: 'bg-emerald-900/50 text-emerald-400',
    LOW: 'bg-emerald-900/50 text-emerald-400',
    MEDIUM: 'bg-amber-900/50 text-amber-500',
    HIGH: 'bg-red-900/50 text-red-400'
  };

  const filteredTasks = statusFilter
    ? project.tasks.filter(t => t.status === statusFilter)
    : project.tasks;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">{project.name}</h1>
        {isAdmin && (
          <div className="flex items-center gap-3">
            <button onClick={openCreateTask} className="btn btn-primary px-4 py-2 text-sm rounded-lg">
              + Add Task
            </button>
            <button onClick={() => setShowMemberModal(true)} className="btn btn-ghost px-4 py-2 text-sm rounded-lg">
              + Add Member
            </button>
            <button onClick={handleDeleteProject} className="btn btn-danger px-4 py-2 text-sm rounded-lg">
              Delete Project
            </button>
          </div>
        )}
      </div>

      {/* Tasks */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Tasks</h2>
        <div className="bg-ethara-card rounded-xl border border-ethara-border overflow-hidden">
          <div className="p-4 border-b border-ethara-border">
            <select
              className="bg-ethara-input border border-ethara-border text-gray-300 text-sm rounded-md px-3 py-2 w-full max-w-xs focus:outline-none focus:border-ethara-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs uppercase bg-ethara-card text-gray-400 border-b border-ethara-border">
                <tr>
                  <th className="px-6 py-4 font-medium">TASK</th>
                  <th className="px-6 py-4 font-medium">ASSIGNEE</th>
                  <th className="px-6 py-4 font-medium">STATUS</th>
                  <th className="px-6 py-4 font-medium">PRIORITY</th>
                  <th className="px-6 py-4 font-medium">DUE DATE</th>
                  <th className="px-6 py-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No tasks found.</td>
                  </tr>
                )}
                {filteredTasks.map(t => (
                  <tr key={t.id} className="border-b border-ethara-border hover:bg-ethara-input/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{t.title}</td>
                    <td className="px-6 py-4">{t.assignee ? t.assignee.name : 'unassigned'}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${badgeColor[t.status]}`}>{t.status.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${badgeColor[t.priority]}`}>{t.priority}</span>
                    </td>
                    <td className="px-6 py-4">
                      {t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewTask(t)} className="btn btn-ghost px-3 py-1 text-xs rounded-full border border-ethara-border">VIEW</button>
                        {isAdmin && (
                          <>
                            <button onClick={() => openEditTask(t)} className="btn btn-ghost px-3 py-1 text-xs rounded-full border border-ethara-border">EDIT</button>
                            <button onClick={() => handleDeleteTask(t.id)} className="text-red-400 hover:text-red-300 text-xs px-2 py-1">DELETE</button>
                          </>
                        )}
                        {t.assigneeId === currentUser.id && (
                          <select
                            className="bg-ethara-bg border border-ethara-border text-gray-300 text-xs rounded-full px-3 py-1.5 cursor-pointer focus:outline-none"
                            value={t.status}
                            onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                          >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Team Members</h2>
        <div className="space-y-3">
          {project.members.map(m => (
            <div key={m.id} className="bg-ethara-card border border-ethara-border rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-white">
                  {m.user.name} <span className={`text-xs ml-2 font-bold ${m.role === 'ADMIN' ? 'text-ethara-primary' : 'text-emerald-500'}`}>{m.role}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">{m.user.email}</p>
              </div>
              {isAdmin && m.userId !== currentUser.id && (
                <button onClick={() => handleRemoveMember(m.id)} className="btn btn-danger px-4 py-1.5 text-xs rounded-full">
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* View Task Modal */}
      {viewTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-ethara-card border border-ethara-border rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Task Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <p className="text-white">{viewTask.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <p className="text-gray-300 text-sm">{viewTask.description || 'No description'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Requirements</label>
                <p className="text-gray-300 text-sm">{viewTask.requirements || 'No requirements'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <span className={`badge ${badgeColor[viewTask.status]}`}>{viewTask.status.replace('_', ' ')}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
                  <span className={`badge ${badgeColor[viewTask.priority]}`}>{viewTask.priority}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Assignee</label>
                  <p className="text-gray-300 text-sm">{viewTask.assignee ? viewTask.assignee.name : 'Unassigned'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
                  <p className="text-gray-300 text-sm">{viewTask.dueDate ? new Date(viewTask.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No due date'}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-6">
              <button onClick={() => setViewTask(null)} className="btn btn-ghost px-6 border-ethara-border rounded-lg text-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-ethara-card border border-ethara-border rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">{editingTask ? 'Edit Task' : 'Add Task'}</h2>
            <form onSubmit={handleSaveTask} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input
                  type="text" required className="input-field"
                  value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  className="input-field" rows="3"
                  value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Requirements</label>
                <textarea
                  className="input-field" rows="2"
                  value={taskForm.requirements} onChange={e => setTaskForm({...taskForm, requirements: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
                <select className="input-field" value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
                <input type="date" className="input-field" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Assign To</label>
                <select className="input-field" value={taskForm.assigneeId} onChange={e => setTaskForm({...taskForm, assigneeId: e.target.value})}>
                  <option value="">Unassigned</option>
                  {project.members.map(m => (
                    <option key={m.userId} value={m.userId}>{m.user.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" className="btn btn-ghost px-6 border-ethara-border rounded-lg text-gray-300" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-ethara-card border border-ethara-border rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Add Member</h2>
            <form onSubmit={handleAddMember} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">User Email</label>
                <input
                  type="email" required className="input-field"
                  placeholder="email@example.com"
                  value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" className="btn btn-ghost px-6 border-ethara-border rounded-lg text-gray-300" onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 rounded-lg">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

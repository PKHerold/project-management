import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchProjects = () => {
    setLoading(true);
    projectAPI.getAll()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.create(newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary px-4 py-2 rounded-lg">
          New Project
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-10 bg-ethara-card border border-ethara-border rounded-xl">
          <p className="text-gray-400 mb-4">No projects found.</p>
          <button onClick={() => setShowModal(true)} className="text-ethara-primary hover:text-ethara-primaryHover font-medium">
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => {
            const role = p.members[0]?.role || 'MEMBER';
            
            return (
              <Link to={`/projects/${p.id}`} key={p.id} className="card p-5 hover:border-ethara-primary transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-white">{p.name}</h3>
                  <span className="badge bg-ethara-input text-gray-300 border border-ethara-border">{role}</span>
                </div>
                <p className="mt-2 text-sm text-gray-400 line-clamp-2 h-10">
                  {p.description || "No description."}
                </p>
                <div className="mt-4 text-xs text-gray-500">
                  Created {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-ethara-card border border-ethara-border rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Create New Project</h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Project Name</label>
                <input
                  type="text" required className="input-field bg-ethara-input"
                  placeholder="Project name"
                  value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  className="input-field bg-ethara-input" rows="3"
                  placeholder="Project description"
                  value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-4 mt-6">
                <button type="button" className="btn btn-ghost px-6 border-ethara-border rounded-lg text-gray-300" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 rounded-lg">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

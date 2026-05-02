const prisma = require('../config/db');

const requireRole = (...roles) => async (req, res, next) => {
  const projectId = req.params.projectId || req.params.id;
  if (!projectId) return res.status(400).json({ error: 'Project ID required' });

  try {
    const member = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: req.userId, projectId } }
    });
    if (!member) return res.status(403).json({ error: 'Not a project member' });
    if (!roles.includes(member.role)) return res.status(403).json({ error: 'Insufficient permissions' });
    req.memberRole = member.role;
    next();
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { requireRole };

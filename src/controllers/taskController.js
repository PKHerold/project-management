const prisma = require('../config/db');

exports.create = async (req, res) => {
  try {
    const { title, description, requirements, priority, dueDate, assigneeId } = req.body;
    if (!title) return res.status(400).json({ error: 'Task title is required' });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        requirements,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: req.params.projectId,
        assigneeId: assigneeId || null,
        createdById: req.userId
      },
      include: { assignee: { select: { id: true, name: true } } }
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.list = async (req, res) => {
  try {
    const where = { projectId: req.params.projectId };
    if (req.query.status) where.status = req.query.status;
    if (req.query.priority) where.priority = req.query.priority;

    const tasks = await prisma.task.findMany({
      where,
      include: { assignee: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, description, requirements, status, priority, dueDate, assigneeId } = req.body;

    // Members can only update status of tasks assigned to them
    if (req.memberRole === 'MEMBER') {
      const task = await prisma.task.findUnique({ where: { id: req.params.taskId } });
      if (!task) return res.status(404).json({ error: 'Task not found' });
      if (task.assigneeId !== req.userId) {
        return res.status(403).json({ error: 'Can only update your own tasks' });
      }
      const updated = await prisma.task.update({
        where: { id: req.params.taskId },
        data: { status },
        include: { assignee: { select: { id: true, name: true } } }
      });
      return res.json(updated);
    }

    // Admins can update everything
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (requirements !== undefined) data.requirements = requirements;
    if (status !== undefined) data.status = status;
    if (priority !== undefined) data.priority = priority;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
    if (assigneeId !== undefined) data.assigneeId = assigneeId || null;

    const task = await prisma.task.update({
      where: { id: req.params.taskId },
      data,
      include: { assignee: { select: { id: true, name: true } } }
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.taskId } });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

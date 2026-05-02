const prisma = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { members: { some: { userId: req.userId } } },
      select: { id: true, name: true }
    });

    const projectIds = projects.map(p => p.id);

    const [total, todo, inProgress, done, overdue, myTasks] = await Promise.all([
      prisma.task.count({ where: { projectId: { in: projectIds } } }),
      prisma.task.count({ where: { projectId: { in: projectIds }, status: 'TODO' } }),
      prisma.task.count({ where: { projectId: { in: projectIds }, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { projectId: { in: projectIds }, status: 'DONE' } }),
      prisma.task.count({
        where: {
          projectId: { in: projectIds },
          status: { not: 'DONE' },
          dueDate: { lt: new Date() }
        }
      }),
      prisma.task.findMany({
        where: { assigneeId: req.userId, status: { not: 'DONE' } },
        include: {
          project: { select: { name: true } },
          assignee: { select: { name: true } }
        },
        orderBy: { dueDate: 'asc' },
        take: 10
      })
    ]);

    res.json({
      projectCount: projects.length,
      taskStats: { total, todo, inProgress, done, overdue },
      myTasks,
      projects
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

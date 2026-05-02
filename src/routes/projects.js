const router = require('express').Router();
const ctrl = require('../controllers/projectController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const taskRoutes = require('./tasks');

router.use(authenticate);

router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', requireRole('ADMIN', 'MEMBER'), ctrl.get);
router.put('/:id', requireRole('ADMIN'), ctrl.update);
router.delete('/:id', requireRole('ADMIN'), ctrl.remove);

// Members
router.post('/:id/members', requireRole('ADMIN'), ctrl.addMember);
router.delete('/:id/members/:memberId', requireRole('ADMIN'), ctrl.removeMember);

// Tasks (nested)
router.use('/:projectId/tasks', taskRoutes);

module.exports = router;

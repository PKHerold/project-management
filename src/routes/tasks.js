const router = require('express').Router({ mergeParams: true });
const ctrl = require('../controllers/taskController');
const { requireRole } = require('../middleware/rbac');

router.post('/', requireRole('ADMIN'), ctrl.create);
router.get('/', requireRole('ADMIN', 'MEMBER'), ctrl.list);
router.put('/:taskId', requireRole('ADMIN', 'MEMBER'), ctrl.update);
router.delete('/:taskId', requireRole('ADMIN'), ctrl.remove);

module.exports = router;

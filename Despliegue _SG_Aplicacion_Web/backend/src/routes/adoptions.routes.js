const router = require('express').Router();
const ctrl = require('../controllers/adoptions.controller');
const auth = require('../middleware/auth');

router.get('/pets', auth, ctrl.getPets);
router.get('/', auth, ctrl.getAll);
router.post('/', auth, ctrl.adopt);

module.exports = router;

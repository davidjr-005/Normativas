const router = require('express').Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const ctrl = require('../controllers/auth.controller');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/profile', auth, ctrl.getProfile);
router.get('/users', auth, rbac('admin'), ctrl.getUsers);
router.post('/register-oauth', auth, ctrl.registerOAuth);

module.exports = router;
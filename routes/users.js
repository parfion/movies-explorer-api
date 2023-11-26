const router = require('express').Router();

const {
  getUser,
  updateUserInfo,
} = require('../controllers/users');
const { updateUserInfoValidation } = require('../middlewares/validation');

router.get('/me', getUser);
router.patch('/me', updateUserInfoValidation, updateUserInfo);

module.exports = router;

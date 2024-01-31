const express = require('express')
const router = express.Router();
const {signup , login, verifyToken ,getuser, refreshToken, logout} = require('../controllers/User-controller')

router.post('/signup',signup);
router.post('/login',login);
router.get('/user',verifyToken,getuser);
//verify token that is refresh should be created 
router.get('/refresh',refreshToken,verifyToken,getuser);
router.post('/logout',verifyToken,logout);

module.exports = router;
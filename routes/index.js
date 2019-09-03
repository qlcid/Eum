const express = require('express');
const router = express.Router();

// Every member
router.use('/chkid', require('./user/chkid.js'));
router.use('/signup', require('./user/signup.js'));

// Add relative people
router.use('/relation', require('./user/relation.js'));

// Login
router.use('/signin', require('./user/signin.js'));

//things edit
// Profile(url : localhost:3000/profile)
router.use('/profile', require('./user/profile.js'));
// Edit(url : localhost:3000/edit)
router.use('/edit', require('./user/edit.js'));

// MyScore(url : localhost:3000/myscore)
router.use('/myscore', require('./user/myscore.js'));

router.use('/showUser', require('./user/showUser.js'));



//contract

//contract(계약 시 가족 리스트 부르기 위해)
router.use('/familylist', require('./contract/familyList.js'));

//계약하는 확면
router.use('/writeContract', require('./contract/writeContract.js'));

//계약 맺기 전 리스트
router.use('/undoneContract', require('./contract/undoneContract.js'));

//계약 보내면 상대방이 받는 화면
router.use('/sendContract', require('./contract/sendContract.js'));

//계약 리스트 
router.use('/contractList', require('./contract/contractList.js'));

//계약 수정
router.use('/modifyContract', require('./contract/modifyContract.js'));



//game
router.use('/orderingscore', require('./game/orderingscore.js'));
router.use('/puzzlescore', require('./game/puzzlescore.js'));
router.use('/shapescore', require('./game/shapescore.js'));
router.use('/tetrisscore', require('./game/tetrisscore.js'));
router.use('/reachedscore', require('./game/reachedscore.js'));
module.exports = router;

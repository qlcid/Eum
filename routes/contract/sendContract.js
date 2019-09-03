//sendContract.js
const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection(require('../../config/dbConfig.js'));
const jwt = require('../../module/jwt.js');

//url: localhost:3000/sendContract, method: post
router.get('/', function(req, res){

	let token = req.headers.token;
	let decoded = jwt.verify(token);
	var currentID = decoded.string;

	if (decoded == -1) {
		res.status(500).send({
			message : "token err"
		});
	} else {
		var getQuery='SELECT name FROM member WHERE id=?';
		connection.query(getQuery, [currentID,currentID], function(err, result){
			if(err){
				res.status(400).send({
					message: "DB연결 실패"
				});
			}else{
				res.status(202).send({
					message: "계약서 보여주기 성공",
					data: result[0].name
				});
			}
		});
	}
});
module.exports = router;
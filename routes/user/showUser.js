//showUser.js
const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection(require('../../config/dbConfig.js'));
const jwt = require('../../module/jwt.js');

router.get('/', function(req, res){
	let token = req.headers.token;
	let decoded = jwt.verify(token);

	if (decoded == -1) {
		res.status(500).send({
			message : "token err"
		});
	} else{
		var currentID = decoded.string;

		var listQuery = 'SELECT id, name FROM member WHERE id=?';
		connection.query(listQuery, currentID, function(err, result){
			if(err){
				res.status(500).send({
					message: "Error getting show user"
				});
			}else{
				res.status(202).send({
					message: "Show user ok",
					data: result[0]
				});
			}
		});
	}
});

module.exports = router;
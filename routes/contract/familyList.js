//familyList.js
const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection(require('../../config/dbConfig.js'));
const jwt = require('../../module/jwt.js');

router.get('/', function(req, res){
	let token = req.headers.token;
	let decoded = jwt.verify(token);

	if(decoded == -1){
		res.status(500).send({
			message: "token err"
		});
	}else{
		var id = decoded.string;
		var famArray = new Array();

		var famChkQuery = 'SELECT num_f, name FROM member WHERE id = ?';
		connection.query(famChkQuery, id, function(err, result){
			if(err){
				res.status(501).send({
					message: "Internal server Error"
				});
			} else{
				var family = result[0].num_f;
				var myName = result[0].name;

				var getFamListQuery = 'SELECT name FROM member WHERE num_f = ?';
				connection.query(getFamListQuery, family, function(err, row){
					if(err){
						res.status(502).send({
							message: "Internal server Error"
						});
					} else {
						res.status(202).send({
							message: "Family list check ok",
							data: row
						});
						for(var i = 0; i<row.length; i++){
							famArray[i] = row[i].name;
							console.log(famArray[i]);
						}
					}
				});
			}
		});

	}	
});

module.exports = router;
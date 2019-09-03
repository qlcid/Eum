//contractList.js
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

		var getNUm = 'SELECT num_f FROM member WHERE id=?'
		connection.query(getNUm, currentID, function(err,row){
			if(err){
				res.status(500).send({
					message:"Internal error getting fam num"
				});
			}else{
				var num_f = row[0].num_f;
				var listQuery = 'SELECT m.name, c.score, c.content, c.success FROM member m, contract c WHERE (m.name = c.id_p OR m.name = c.id_c) AND m.num_f = c.num_f AND m.id != ? AND m.num_f=?';
				connection.query(listQuery, [currentID, num_f], function(err, result){
				if(err){
					res.status(500).send({
					message: "Internal error getting contract list"
					});
				} else{
					res.status(202).send({
						message: "Contract list ok",
						data: result
					});
				}
			});	
		}
		});

		
	}
});

module.exports = router;
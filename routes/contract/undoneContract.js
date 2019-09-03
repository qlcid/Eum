//undonContract.js
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
		var currentID = decoded.string;

		var getNUm = 'SELECT num_f FROM member WHERE id=?'
		connection.query(getNUm, currentID, function(err, row){
			if(err){
				res.status(501).send({
					message: "Internal error getting fam num"
				});
			}else{
				var num_f = row[0].num_f;
				console.log(num_f);

				var undonQuery = 'SELECT c.contract_idx, m.name, c.score, c.content FROM contract c, member m WHERE m.id != ? AND (m.name = c.id_p OR m.name = c.id_c) AND (c.chk_p = 0 OR c.chk_c = 0) AND m.num_f=?'
				connection.query(undonQuery, [currentID, num_f], function(err, result){
					if(err){
						res.status(502).send({
							message: "Internal error getting undone list"
						});
					}else{
						console.log(result);
						res.status(202).send({
							message: "Undone contract list ok",
							data: result,
							token: token
						});
					}
				});
			}
		});
	}
});
module.exports = router;
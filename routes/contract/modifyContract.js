//modifyContract.js
const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection(require('../../config/dbConfig.js'));
const jwt = require('../../module/jwt.js');

//url: localhost:3000/modifyContract, method: POST
router.post('/', function(req, res){

	let token = req.headers.token;
	let decoded = jwt.verify(token);

	var contract_idx = req.body.idx;
	var score = req.body.score;
	var content = req.body.content;
	var chk_c = 1;
	var chk_p = 1;

	if (decoded == -1) {
		res.status(500).send({
			message : "token err"
		});
	} else{
			var modifyQuery = 'UPDATE contract SET score=?, content=?, chk_c=?, chk_p=? WHERE contract_idx=?';
			connection.query(modifyQuery, [score, content, chk_c, chk_p, contract_idx], function(err, result){
			if(err){
				res.status(500).send({
					message: "Internal server error of modifying contract"
				});
				connection.end();
			}else{
					res.status(202).send({
						message: "계약 최종 완료"
					});
				}
			});
	}
});
module.exports = router;
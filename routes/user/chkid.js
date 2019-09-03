const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection(require('../../config/dbConfig.js'));

router.post('/', function(req, res){
	var id = req.body.id;

	if(!id){
		res.status(400).send({
			message: "Null value"
		});
	} else{
		var chkUserIdQuery = 'SELECT * FROM member WHERE id = ?';
		connection.query(chkUserIdQuery, id, function(err, result){
			if(err){
				res.status(500).send({
					message: "Internal server Error"
				});
				connection.end();
			} else if(result.length != 0){
				res.status(400).send({
					message: "Already joined"
				});
				connection.end();
			}  else {
				res.status(202).send({
					message: "Can use your ID"
				});
				connection.end();
			}
		});
	}

});

module.exports = router;
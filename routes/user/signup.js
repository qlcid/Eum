const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection(require('../../config/dbConfig.js'));
const jwt = require('../../module/jwt.js');

//url: localhost:3000/signup, method: POST
router.post('/', function(req, res){
	var name = req.body.name; //실명으로 가입
	var id = req.body.id;
	var pwd = req.body.pwd;
	var phone = req.body.phone;
	var birth = req.body.birth;
	var chk_f = 1;
	let token = jwt.sign(id);

	if(!id || !name || !pwd || !phone){
		res.status(400).send({
			message: "Null value"
		});
	} else{
		var famNumQuery = 'SELECT DISTINCT num_f FROM member ORDER BY num_f';
		connection.query(famNumQuery, function(err, result){
			if(err){
				res.status(500).send({
					message: "Internal server error"
				});
				connection.end();
			} else{
				for(var i = 0; i<result.length; i++){
					if(result[i].num_f == chk_f){
						++chk_f;
					}
					// else if(result[i].num_f > chk_f){
					// 	break;
					// }
				}

				var insertQuery = 'INSERT INTO member(id, name, pwd, phone, birth, num_f) VALUES(?, ?, ?, ?, ?, ?)';
				connection.query(insertQuery, [id, name, pwd, phone, birth, chk_f], function(err, result){
					if(err){
						res.status(500).send({
							message: "Internal server Error"
					});
					} else{
						var GameIdSetQuery = 'INSERT INTO gamescore(id, tetris, shape, ordering, puzzle, total) VALUES(?, ?, ?, ?, ?, ?)'
						connection.query(GameIdSetQuery, [id, 0,0,0,0,0], function(err,result){
							if(err){
                       			res.status(400).send({
                           			message : "DB Connection Error"
                        		});
                     		}
                     		else{
                        		res.status(202).send({
                           			message: "Successfully signed up",
                           			token: token
                        		});
                     		}
                     		});
					}
				});

			}
		});
	}

});


module.exports = router;
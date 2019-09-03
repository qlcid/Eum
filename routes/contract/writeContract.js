//writeContract.js
const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection(require('../../config/dbConfig.js'));
const jwt = require('../../module/jwt.js');

//url: localhost:3000/writeContract, method: POST
router.post('/', function(req, res){
	let token = req.headers.token;

	let decoded = jwt.verify(token);	// 결과값 decoded에 저장
	console.log(decoded);

	var id_p = req.body.id_p;    
	var id_c = req.body.id_c;    
	var score = req.body.score;
	var content = req.body.content;
	var chk_p = 0;
	var chk_c = 0;
	var success = 0;

	if (decoded == -1) {
		res.status(500).send({
			message : "token err"
		});
	} else {
		var currentID = decoded.string;  //Get by session(current id)

		var getNumQuery = 'SELECT num_f, name FROM member WHERE id = ?';
		connection.query(getNumQuery, currentID, function(err, row){
			if(err){
				res.status(500).send({
					message: "Internal server error getting Family Num"
				});
			} else{
				var num_f = row[0].num_f;
				var myName = row[0].name;

				console.log(num_f);
				console.log(myName);

				if(myName == id_p){
					chk_p = 1;
				} else if(myName == id_c){
					chk_c = 1;
				}

	//session의 아이디 중에 id_p 또는 id_c 중에 일치하는 사람의 것 chk_ +1해야 해 
				if(!id_p || !id_c || !score || !content){
					res.status(410).send({
						message: "Null value"
					});
				} else{
					//리스트에 본인의 이름을 선택했는지 확인 
					if(chk_p==1||chk_c==1){
					var writeQuery = 'INSERT INTO contract(id_p, id_c, score, content, chk_p, chk_c, success, num_f) VALUES(?,?,?,?,?,?,?,?) ';
					connection.query(writeQuery, [id_p, id_c, score, content, chk_p, chk_c, success,num_f], function(err, result){
						if(err){
							res.status(500).send({
								message: "Internal server Error"
						});
						} else{
							res.status(202).send({
								message: "Successfully made the contract"
						});
						}
					});
					} else{
						res.status(420).send({
							message: "본인의 이름을 필수로 선택해야 합니다."
					});
					}
			
				}
			}
		});   //여기 수정했는데...

		
	}
});

module.exports = router;
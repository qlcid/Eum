const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const connection = mysql.createConnection(require('../../config/dbConfig.js'));
const jwt = require('../../module/jwt.js');

//id와 pwd로 check
router.post('/', function(req, res){
  var id = req.body.id;
  var pwd = req.body.pwd;
  
  let token = jwt.sign(id);

  if(!id || !pwd){
    res.status(400).send({
      message : "Null value"
    });
  } else{
    var loginQuery = 'SELECT * FROM member WHERE id = ? AND pwd = ?';
    connection.query(loginQuery, [id, pwd], function(err, result){
      if(err){
        res.status(500).send({
          message: "Internal server Error"
        });
      }else if(result.length === 0){
        res.status(400).send({
          message: "Login Error"
        });
      } else{
          var countQuery = 'SELECT COUNT(c.contract_idx) AS contractNum FROM contract c, member m WHERE m.id = ? AND (m.name = c.id_p OR m.name = c.id_c) AND c.num_f = m.num_f AND (c.chk_p = 0 OR c.chk_c = 0)'
          connection.query(countQuery, id, function(err, row){
            if(err){
              res.status(505).send({
                message: "DB err"
              });
            }
            else{
              res.status(202).send({
                message: "Login success",
                data: row[0],
                token: token
              });
            }
          })
        }
      
    });

  } 
  //여기까지 출력됨


});


module.exports = router;
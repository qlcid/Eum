// reachedscore.js , 안드로이드 상에서 각 게임의 score.js파일과 함께 로드해주기.
const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection(require('../../config/dbConfig.js'));

const jwt = require('../../module/jwt.js');


router.get('/', function(req, res) {
  let token = req.headers.token;
  let decoded = jwt.verify(token);
  var tokenid = decoded.string;

  if (decoded == -1) {
    res.status(500).send({
      message : "Token Error"
    });
  } else {
    var selecttotalQuery = "SELECT g.total, m.name, c.contract_idx FROM gamescore g, member m, contract c WHERE g.id = m.id and (m.name = c.id_p or m.name = c.id_c) and m.id =? ORDER BY c.contract_idx";
    connection.query(selecttotalQuery, tokenid, function(err, result){
      if(err){
        res.status(400).send({
          message : "DB Connection Fail"
        });
      }
      else{
        var total = result[0].total;
        var name = result[0].name;
        var idx = result[0].contract_idx
        var reachedscoreQuery = "UPDATE contract SET success = 1 WHERE (? = id_p or ? = id_c) and ? >= score and contract_idx = ?";
        connection.query(reachedscoreQuery, [name, name, total, idx], function(err, result) {
        if(err) {
          res.status(400).send({
            message : "DB Connection Fail"
          });
  
        } else {
            var selectsuccessQuery = "SELECT success FROM contract WHERE ? = id_p OR ? = id_c and contract_idx = ?";
            connection.query(selectsuccessQuery, [name, name, idx], function(err, result){
              var success = result[0].success;
              if(err){
                res.status(400).send({
                  message : "DB Connection Fail"
                });
              }
              else if(success == 0){
                  res.status(401).send({
                    message : "점수가 더 필요합니다."
                  });
              }
              else if(success == 1){
                  var resetscoreQuery = "UPDATE gamescore SET tetris = 0, shape = 0, ordering = 0, puzzle = 0, total = 0 WHERE ? = id";
                  connection.query(resetscoreQuery, [tokenid], function(err, result){
                    if(err){
                      res.status(400).send({
                        message : "DB Connection Fail"
                      });
                    }
                    else{
                      res.status(202).send({
                        message : "계약 이행되었습니다."
                      });
                    }
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
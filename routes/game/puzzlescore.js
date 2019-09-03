// puzzlescore.js
const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection(require('../../config/dbConfig.js'));

const jwt = require('../../module/jwt.js');


router.post('/', function(req, res) {
  let token = req.headers.token;
  let decoded = jwt.verify(token);
  var tokenid = decoded.string;
  var puzzle = req.body.puzzle;

  if (decoded == -1) {
    res.status(500).send({
      message : "Token Error"
    });
  } else {
        var puzzlescoreQuery = 'INSERT INTO gamescore(id, puzzle) VALUES(?, ?)';
      }

    connection.query(puzzlescoreQuery, [tokenid, puzzle], function(err, result) {
      if(err) {
        res.status(400).send({
          message : "DB Connection Fail"
        });
        connection.end();
      } else {
        res.status(202).send({
          message : "puzzlescore",
          data : result
        });
        connection.end();
      }
      var selecttotalQuery = "SELECT total FROM gamescore WHERE id = ?";
      connection.query(selecttotalQuery, [tokenid], function(err, result){
        if(result[0] == 0){
          var inserttotalQuery = "INSERT INTO gamescore(total) VALUES(?)";
          connection.query(inserttotalQuery, [puzzle]);
        }
        else{
          var updatescoreQuery = "UPDATE gamescore SET total = total + ? WHERE id = ?";
          connection.query(updatescoreQuery, [puzzle, tokenid], function(err, result){
            if(err) {
               res.status(400).send({
               message : "DB Connection Fail"
              });
               connection.end();
            } else {
                res.status(202).send({
                  message : "totalscore",
                  data : result
                });
                connection.end();
              }
          });
        }
      });
    });
});
module.exports = router;
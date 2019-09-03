// shapescore.js
const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection(require('../../config/dbConfig.js'));

const jwt = require('../../module/jwt.js');


router.post('/', function(req, res) {
  let token = req.headers.token;
  let decoded = jwt.verify(token);
  var tokenid = decoded.string;
  var shape = req.body.shape;

  if (decoded == -1) {
    res.status(500).send({
      message : "Token Error"
    });
  } else {
        var shapescoreQuery = 'UPDATE gamescore SET shape = shape + ? WHERE id = ?';
        connection.query(shapescoreQuery, [shape, tokenid], function(err, result) {
          if(err) {
            res.status(400).send({
              message : "DB Connection Fail"
            });
          } else {
                  var updatescoreQuery = "UPDATE gamescore SET total = total + ? WHERE id = ?";
                  connection.query(updatescoreQuery, [shape, tokenid], function(err, result){
                    if(err) {
                      res.status(400).send({
                        message : "DB Connection Fail"
                      });
                      connection.end();
                    } 
                    else {
                      res.status(202).send({
                        message : "성공"
                      });
                      connection.end();
                    }
                  });
            }
        });
    }
});
module.exports = router;
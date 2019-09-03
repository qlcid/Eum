// myscore.js
const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection(require('../../config/dbConfig.js'));

const jwt = require('../../module/jwt.js');


router.get('/', function(req, res) {
  let token = req.headers.token;
  let decoded = jwt.verify(token);

  if (decoded == -1) {
    res.status(500).send({
      message : "Token Error"
    });
  } else {
    var currentID = decoded.string;
    
    var scoreQuery = 'SELECT puzzle, tetris, shape, ordering FROM gamescore WHERE id = ?';
    connection.query(scoreQuery, currentID, function(err, result) {
      if(err) {
        res.status(400).send({
          message : "DB Connection Fail"
        });
      } else {
        res.status(202).send({
          message : "MyScore",
          data : result[0]
        });
      }
    });
  }
});

module.exports = router;
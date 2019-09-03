const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection(require('../../config/dbConfig.js'));
const jwt = require('../../module/jwt.js');

router.post('/', function(req, res) {
  let token = req.headers.token;
  let decoded = jwt.verify(token);

  var id = decoded.string;
  var name = req.body.name_r;
  var phone = req.body.phone_r;

  var min = 0;
  var max = 0;

  if (decoded == -1) {
    res.status(500).send({
      message : "token err"
    });
  } else {
    var phoneChkQuery = 'SELECT num_f FROM member WHERE phone = ? OR id = ?';
    connection.query(phoneChkQuery, [phone, id], function(err, result) {
      if(err) {
         res.status(500).send({
         message : "Internal Server Error"
        });
     } else if(result.length === 0) {
        res.status(402).send({
          message : "No Relation"
      });
     } else {
        console.log(result);

        if (result[0].num_f > result[1].num_f) {
          min = result[1].num_f;
          max = result[0].num_f;
          console.log(min);
          console.log(max);
        } else {
          min = result[0].num_f;
          max = result[1].num_f;
        }

        var updateNumFQuery = 'UPDATE member SET num_f = ? WHERE num_f = ?';
        connection.query(updateNumFQuery, [min, max], function(err, row) {
          if (err) {
            res.status(500).send({
              message : "Internal Server Error"
            });
          } else {
            res.status(201).send({
              message : "Successfully Update"
            });
          }
        });
      }
    }); 
  }
});

module.exports = router;
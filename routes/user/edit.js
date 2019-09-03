// edit.js
const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection(require('../../config/dbConfig.js'));

const jwt = require('../../module/jwt.js');


router.post('/', function(req, res) {
  let token = req.headers.token;
  let decoded = jwt.verify(token);
  // console.log(decoded);

  var pwd = req.body.pwd;
  var birth = req.body.birth;

  if (decoded == -1) {
    res.status(500).send({
      message : "Token Error"
    });
  } else {
    var currentID = decoded.string;

    if(!pwd) {
      res.status(400).send({
        message : "Null Value"
      });
    } else {
      var editQuery = 'UPDATE member SET pwd = ?, birth = ? WHERE id = ?';

      connection.query(editQuery, [pwd, birth, currentID], function(err, result) {
        if(err) {
          res.status(500).send({
            message : "Internal Server Error"
          });
        } else {
            res.status(202).send({
              message : "Edit Success"
            });
          }
      });
    }
  }
});

module.exports = router;
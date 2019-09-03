const jwt = require('jsonwebtoken');

const secretKey = require('../config/secretKey.js').secret;


module.exports = {
  //payload의 string값
  //만약 로그인이었다면 function(id,pw,id_idx)
  sign : function(string) {
    const options = {
      algorithm : "HS256",
      expiresIn : 60 * 60 * 24 * 30 //30 days
    };
    const payload = {
      string : string
      // 로그인이었다면 토큰에 담아 전달할 값
      //'id' : id,
      //'pw' : pw,
      //'user_idx' : user_idx
    };

    let token = jwt.sign(payload, secretKey, options);
    return token;
  },

  //어떠한 에러가 있는지 알아야하기 때문에 에러처리 해준다.
  verify : function(token) {

    //결과값을 받은 변수
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    }
    catch(err) {
      //토큰 만료
      if(err.message === 'jwt expired') console.log('expired token');
      //정상적이지 않은 토큰
      else if(err.message === 'invalid token') console.log('invalid token');
    }
    //정상적으로 수행되지 않았을때 넘어오는..
    if(!decoded) { //아무런 값이 들어가지 않음. //사용자인증이 제대로 이루어지지않음의 메세지 출력
      return -1;
    }else {
      return decoded; //메소드가 잘 수행되고 값이 잘 들어왓음.
    }
  }
};
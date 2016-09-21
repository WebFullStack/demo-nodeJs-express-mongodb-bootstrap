var express = require('express');

var http = require('http');
var async = require('async');
var fs = require("fs");
var path = require('path');

var router = express.Router();

var user = require('../models/User').User;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function (req, res) {
  var obj = req.body;
  User.User.findOne({name : obj.userName,password: obj.password},function(err,doc){
    console.log(doc);
    if (doc){
      console.log(obj.userName + " login success");
      req.session.user = obj.userName;
      req.session.cookie.user = obj.userName;
      res.send({user: obj.userName});
    } else {
      console.log(obj.userName + " login failed");
      res.send(false);
    }
  })
});

router.post('/logout',function(req,res){
  var obj = req.body;
  var session = req.session;
  session.regenerate(function(){
    session.user = null;
  });
  res.render('index', {title: 'Express'});
});


router.post('/register',function(req,res,next){
  var obj = req.body;
  var code = req.session.code;
  user.create(params, function(error) {
    if(error) {
        console.log('create application error:%s', error);
    } else {
        console.log('create application success!');
    }
  });
});

var multer  = require('multer');
var upload = multer({dest: path.join(__dirname,'../temp/')});

/* 创建应用 */
router.post('/', upload.single('appAvatar'), function(req, res) {
  console.log(req.body);
  var avatar = 'images/avatar.png';
  if(req.file){
    console.log(req.file);
    var tmpPath = 'temp/' + req.file.filename;
  	//移动到指定的目录，一般放到public的images文件下面
  	//在移动的时候确定路径已经存在，否则会报错
    avatar = 'uploads/' + req.file.filename + '.png';
  	//将上传的临时文件移动到指定的目录下
  	fs.rename(tmpPath, 'public/' + avatar , function(err) {
  		if(err){
  			throw err;
  		}
  		//删除临时文件
  		fs.unlink(tmpPath, function(){
  			if(err) {
  				throw err;
  			}
  		})
  	})
  }

  var params = {
    projectId: req.body.projectId,
    name: req.body.name,
    tag: req.body.tag,
    avatar: './' + avatar
  };

  application.create(params, function(error) {
    if(error) {
        console.log('create application error:%s', error);
    } else {
        console.log('create application success!');
    }
  });
  res.redirect('/projects');
});

/* 导入api */
router.post('/importAPI', upload.single('apifile'), function(req, res) {
  console.log(req.file);  // 上传的文件信息
  var data = fs.readFileSync(req.file.path,"utf-8");
  var params = {
    applicationId: req.body._id,
    swagger: JSON.parse(data).swagger,
    info: JSON.parse(data).info,
    host: JSON.parse(data).host,
    basePath: JSON.parse(data).basePath
  };

  apiDocument.create(params, function(error) {
    if(error) {
        console.log('create document error:%s', error);
    } else {
        console.log('create document success!');
    }
  });

  console.log("##############");
  res.redirect('../applications?id='+req.body._id);
});


module.exports = router;

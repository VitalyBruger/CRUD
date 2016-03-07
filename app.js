var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var db = require('./db.js');
var path = require('path');
var bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.end('<div>Simple CRUD node.js + express application<br><br> <a href="/users">User list</a></div>');
});


app.get('/users', function(req, res) {  
  db.read ( function(data) {
    res.render('users',{page_title:"Users - Node.js",data:data});
  });
});


app.get('/users/add', function(req, res) {
  res.render('add_user',{page_title:"Add User - Node.js"});
});


app.post('/users/add', function (req, res) {  
  db.read ( function(data) {
    var tblUsers = data;
    tblUsers.push({
      firstName:req.body.firstname,
      lastName:req.body.lastname,
      age:req.body.age});
    db.write ( JSON.stringify(tblUsers),function() {
      res.redirect('/users');
    });
  });
});    
      

app.get('/users/delete/:id', function (req, res) {
  var id = req.params.id;
  db.read ( function(data) {
    var tblUsers = data;
    tblUsers.splice(id-1, 1); 
    db.write ( JSON.stringify(tblUsers),function() {
      res.redirect('/users');
    });
  });                 
});


app.get('/users/edit/:id', function (req, res) {
  var id = req.params.id;  
  db.read ( function(data) {
    var editUser = data[id-1];
    editUser.id = id; 
    res.render('edit_user',{page_title:"Users - Node.js",data:editUser});
  });            
});


app.post('/users/edit/:id',function (req, res) {  
  var id = req.params.id;
  db.read ( function(data) {
    var tblUsers = data;
    tblUsers[id-1] = {
      firstName:req.body.firstname,
      lastName:req.body.lastname,
      age:req.body.age};
    db.write ( JSON.stringify(tblUsers),function() {
      res.redirect('/users');
    });
  });
});


app.listen(port, function () {
  console.log('Listening on port ', port);
});



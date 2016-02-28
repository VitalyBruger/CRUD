var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var fs = require('fs');
var path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.end('<div>Simple CRUD node.js+express application<br><br> <a href="/users">User list</a></div>');
});


//git test
app.get('/users', function(req, res) {  
  fs.readFile('./data/users.json', {encoding: 'utf8'}, function (err, data) {
    if (err) throw err;
    var tblUsers = JSON.parse(data);
    res.render('users',{page_title:"Users - Node.js",data:tblUsers});
  });
});

app.get('/users/add', function(req, res) {
  res.render('add_user',{page_title:"Add User - Node.js"});
});


app.post('/users/add', function (req, res) {
  var POST = {};
  if (req.method == 'POST') {
    req.on('data', function(data) {
      data = data.toString();
      data = data.split('&');
      for (var i = 0; i < data.length; i++) {
        var _data = data[i].split("=");
        POST[_data[0]] = _data[1];
      }

      fs.readFile('./data/users.json', {encoding: 'utf8'}, function (err, data) {
        if (err) throw err;
        var tblUsers = JSON.parse(data);

        tblUsers.push({
          firstName:POST['firstname'],
          lastName:POST['lastname'],
          age:POST['age']});

        fs.writeFile('./data/users.json', JSON.stringify(tblUsers), function (err) {
          if (err) return console.log(err);
          res.redirect('/users');
        });
      });
    });
  }
});    
      

app.get('/users/delete/:id', function (req, res) {
  var id = req.params.id;
  fs.readFile('./data/users.json', {encoding: 'utf8'}, function (err, data) {
    if (err) throw err;
    var tblUsers = JSON.parse(data);

    tblUsers.splice(id-1, 1);            

    fs.writeFile('./data/users.json', JSON.stringify(tblUsers), function (err) {
      if (err) return console.log(err);             
      res.redirect('/users');
    });
  });                        
});


app.get('/users/edit/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  fs.readFile('./data/users.json', {encoding: 'utf8'}, function (err, data) {
    if (err) throw err;
    var tblUsers = JSON.parse(data);
    var editUser = tblUsers[id-1];
    editUser.id = id;    
    res.render('edit_user',{page_title:"Users - Node.js",data:editUser});
  });                        
});


app.post('/users/edit/:id',function (req, res) {
  var POST = {};
  var id = req.params.id;
  if (req.method == 'POST') {
    req.on('data', function(data) {
      data = data.toString();
      data = data.split('&');
      for (var i = 0; i < data.length; i++) {
        var _data = data[i].split("=");
        POST[_data[0]] = _data[1];
      }

      fs.readFile('./data/users.json', {encoding: 'utf8'}, function (err, data) {
        if (err) throw err;
        var tblUsers = JSON.parse(data);
        tblUsers[id-1] = {
          firstName:POST['firstname'],
          lastName:POST['lastname'],
          age:POST['age']};

        fs.writeFile('./data/users.json', JSON.stringify(tblUsers), function (err) {
          if (err) return console.log(err);
          res.redirect('/users');
        });
      });
    });
  }
});



app.listen(port, function () {
  console.log('Listening on port ', port);
});



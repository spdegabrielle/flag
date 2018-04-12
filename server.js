// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  if (!exists) {
    db.run('CREATE TABLE Patients (patient TEXT, seen TEXT)');
    console.log('New table Patients created!');
    // insert default patients
    db.serialize(function() {
      db.run('INSERT INTO Patients (patient,seen) VALUES ("Bryan Cranston","a"), ("Kermit (the) Frog","b"), ("Bunny, Bugs","cl")');//
    });
  }
  else {
    console.log('Database contentsmm');
    db.each('SELECT * from Patients', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
    
    console.log('end');
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// endpoint to get all the dreams in the database
// currently this is the only endpoint, ie. adding dreams won't update the database
// read the sqlite3 module docs and try to add your own! https://www.npmjs.com/package/sqlite3
app.get('/getPatients', function(request, response) {
  db.all('SELECT * from Patients', function(err, rows) {
    console.log('record:xxx');
    response.send(JSON.stringify(rows));
  });
});

// listen for requests :)..,
var listener = app.listen(process.env.PORT, function () {
  console.log('my app is listening on port ' + listener.address().port);
});
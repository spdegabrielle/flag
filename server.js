// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // for parsing application/json

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
    db.run('CREATE TABLE Patients (patient TEXT,pid TEXT,seen TEXT)');
    console.log('New table Patients created!');
    // insert default patients
    db.serialize(function() {
      db.run(`INSERT INTO Patients (patient,pid,seen) VALUES 
             ("Bryan A Cranston","M13345",""), 
             ("Kermit (the) Frog","E20001223",""), 
             ("Bunny, Bugs","5901619","Dr Sue")`); //
    });
  
    
      db.each('SELECT * from Patients', function(err, row) {
        if ( row ) { 
          console.log('New record:', row);
        }
      });
    
    
    
  }
  else {
    console.log('Server started ***');
    db.each('SELECT * from Patients', function(err, row) {
      if ( row ) { 
        console.log('record:', row);
      }
    });
  };
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// endpoint to get all the unseen dreams in the database
// currently this is the only endpoint, ie. adding dreams won't update the database
// read the sqlite3 module docs and try to add your own! https://www.npmjs.com/package/sqlite3
app.get('/getPatients', function(request, response) {
  db.all(`SELECT * from Patients WHERE seen IS NULL OR seen = '';`, function(err, rows) {
    response.send(JSON.stringify(rows));
    console.log('Results:', rows);
    //console.log('getPatients - records:',JSON.stringify(rows));
  });
});

// endpoint to get all the seen patients in the database
// currently this is the only endpoint,
// read the sqlite3 module docs and try to add your own! https://www.npmjs.com/package/sqlite3
app.get('/getSeenPatients', function(request, response) {
  db.all(`SELECT * from Patients WHERE seen<>"";`, function(err, rows) { //WHERE seen<>""
    response.send(JSON.stringify(rows));
    console.log('Seen:', rows);
  });
});

app.post('/setStatus', function (request, response) {
  console.log('------------------:');
  console.log('request:' + request.body.pid);
  console.log('--------------------');
  //acquire seenby and rpid values 
  // get the pid and seenby from the client when the user presses the button
  var rpid = request.body.pid; 
  var seenby = request.body.seenby; // i used $.ajax w/ POST  -- THANKS 
  // seems to work now
  console.log('setStatus   pid:' + rpid + ', seenby:' + seenby); 
  // set patient to seen
  let data = [seenby,rpid];
  let sql = `UPDATE Patients
              SET seen = ?
              WHERE pid = ?`;
  db.run(sql, data, function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log('update made');
    });
  
  db.each('SELECT * from Patients', function(err, row) {
    if ( row ) {
      console.log('all records:', row);
      }
    });  
  response.send('POST request to the homepage');
  //response.redirect('/');
})

app.post('/clearStatus', function (request, response) {
  console.log('-------xxxx');
  console.log('request:' + request.body.pid);
  console.log('----------');
  //acquire seenby and rpid values 
  // get the pid and seenby from the client when the user presses the button
  var rpid = request.body.pid; 
  var seenby = request.body.seenby; // i used $.ajax w/ POST  -- THANKS 
  // seems to work now
  console.log('setStatus   pid:' + rpid + ', seenby to be cleared' + seenby); 
  // set patient to seen
  let data = [rpid];
  let sql = `UPDATE Patients
              SET seen = ''
              WHERE pid = ?`;
  db.run(sql, data, function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log('update made');
    });
  
  db.each('SELECT * from Patients', function(err, row) {
    if ( row ) {
      console.log('all records:', row);
      }
    });  
  response.send('POST request to the homepage');
  //response.redirect('/');
})


// listen for requests :)..,
var listener = app.listen(process.env.PORT, function () {
  console.log('my app is listening on port ' + listener.address().port);
});

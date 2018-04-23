// client.js run by the browser each time your view 
(function(){
  console.log('hello world :D');
  let newPatients = [];

  let seenPatients = [];
  const patients = document.getElementById('patients');
  const seenpatients = document.getElementById('seen');
  const hiddenForm = document.forms[0];
  const seenbyInput = hiddenForm.elements['seenby'];
  const pidInput = hiddenForm.elements['pid'];
  const currentUser = 'Dr T. Test';
  
  const getPatientsListener = function() {
    newPatients = JSON.parse(this.responseText);
    patients.innerHTML = '';
    newPatients.forEach( function(row) {
      console.log('getPatientsListener:' + row);
      appendPatient(row);
    });
  };
  
  const getSeenListener = function() {
    seenPatients = JSON.parse(this.responseText);
    seenpatients.innerHTML = '';
    seenPatients.forEach( function(row) {
      console.log('getSeenListener:' + row);
      appendSeenPatient(row);
    });
  };
  
  // request the unseen patientsrow
  function refreshPatientsList() {
    const newPatientsRequest = new XMLHttpRequest();
    newPatientsRequest.onload = getPatientsListener;
    newPatientsRequest.open('get', '/getPatients');
    newPatientsRequest.send();
  };
  refreshPatientsList() ;
  
   // request the unseen patientsrow
  function refreshSeenPatientsList() {
    const seenPatientsRequest = new XMLHttpRequest();
    seenPatientsRequest.onload = getSeenListener;
    seenPatientsRequest.open('get', '/getSeenPatients');
    seenPatientsRequest.send();
  };
  refreshSeenPatientsList() ;
  
  
  function sendSeen(pid) {
    console.log("called sendSeen(" + pid + ")"); 
    seenbyInput.value = currentUser ;
    pidInput.value = pid;
    var data = {seenby: currentUser, pid: pid};

    console.log("PID data:" + data);  
    // post data to endpoint with jQuery
    //$.ajax({ url: '/setStatus', type: 'POST', data: data });
    var request = new XMLHttpRequest();
    request.open('POST', '/setStatus', true);
    request.setRequestHeader('Content-Type', "application/json;charset=UTF-8");
//                             'application/x-www-form-urlencoded; charset=UTF-8');
    request.onload = function () {
        // do something to response
        //console.log("this.responseText");
    };
    request.send(JSON.stringify(data));
    // refresh the list now the database has been updated
    // my lists refresh befor the database 
    // is the any way to make it wait till the db has updated so refresh shows the correct 
    
    
    function waitForUpdateToFinish() {
      setTimeout(function () {
        refreshPatientsList() ;  //  then call this function to refresh it form the DB
        refreshSeenPatientsList() ;
        
      }, 600);
    }
    waitForUpdateToFinish();
    
    

  };
  window.sendSeen = sendSeen; // add to global scope
  
  
  function sendClear(pid) {
    console.log("called sendClear(" + pid + ")"); 
    seenbyInput.value = currentUser ;
    pidInput.value = pid;
    var data = {seenby: currentUser, pid: pid};

    console.log("xPID data:" + data);  
    // post data to endpoint with jQuery
    //$.ajax({ url: '/setStatus', type: 'POST', data: data });
    var request = new XMLHttpRequest();
    request.open('POST', '/clearStatus', true);
    request.setRequestHeader('Content-Type', "application/json;charset=UTF-8");
//                             'application/x-www-form-urlencoded; charset=UTF-8');
    request.onload = function () {
        // do something to response
        //console.log("this.responseText");
    };
    request.send(JSON.stringify(data));
    function waitForUpdateToFinish() {
      setTimeout(function () {
        refreshPatientsList() ;  //  then call this function to refresh it form the DB
        refreshSeenPatientsList() ;
        
      }, 600);
    }
    waitForUpdateToFinish();
  };
  window.sendClear = sendClear; // add to global scope
  
  
  //these two functions are virtually identical - should I pass the list as an arg to refactor?
  // make the list of unseen patients with a button to mark them
  const appendPatient = function(row) {
    const newListItem = document.createElement('li');
    newListItem.innerHTML = `<button type="button" onclick="sendSeen('` 
      + row.pid +`')" id="` + row.pid +'">seen</button> ' + row.patient + ' (' + row.pid + ')' ;
    // button includes the patient id  (pid) so the server can update 
    // the patient with the name of the user who marked them as seen
    patients.appendChild(newListItem);
  };
  
    // make the list of seen patients with a button to mark them
  const appendSeenPatient = function(row) {
    const newListItem = document.createElement('li');
    newListItem.innerHTML = `<button type="button" onclick="sendClear('` 
      + row.pid +`')" id="` + row.pid +'">clear</button> ' + row.patient + ' (' + row.pid + ') ' 
    + `seen by: ` + row.seen + ` <a href="/">chat</a>` ;
    seenpatients.appendChild(newListItem);
  };
  
  // my try
  
})()

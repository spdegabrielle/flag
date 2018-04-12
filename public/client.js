// client-side js
// run by the browser each time your view template referencing it is loaded

(function(){
  console.log('hello world :o>');
  
  let dreams = [];
  
  // define variables that reference elements on our page
  const dreamsList = document.getElementById('patients');
  //const dreamsForm = document.forms[0];
  //const dreamInput = dreamsForm.elements['dream'];
  
  // a helper function to call when our request for dreams is done
  const getDreamsListener = function() {
    // parse our response to convert to JSON
    dreams = JSON.parse(this.responseText);
    
    // iterate through every dream and add it to our page
    dreams.forEach( function(row) {
      appendNewDream(row.patient);
    });
  }
  
  // request the dreams from our app's sqlite database.
  const dreamRequest = new XMLHttpRequest();
  dreamRequest.onload = getDreamsListener;
  console.log('New table Patients created!');
  dreamRequest.open('get', '/getPatients');
  dreamRequest.send();
  
  // a helper function that creates a list item for a given dream
  const appendNewDream = function(dream) {
    const newListItem = document.createElement('li');
    newListItem.innerHTML = dream;
    dreamsList.appendChild(newListItem);
  }
  
})()

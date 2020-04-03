// MISC 
////////////////////////////////////////

var copiedTimer;
var copiedContents;

// copy button copies note from textarea
copy_button.addEventListener('click', function () {
    textOutput.select();
    document.execCommand("copy");
    //defocus the textarea and remove selection
    textOutput.selectionStart = 0;
    textOutput.selectionEnd = 0;
    textOutput.blur();

    //display text letting the user know it was copied
    copied.style.opacity = '100%';

    //remember what text is copied
    copiedContents = textOutput.value;

    //hide text again when text of textarea changes
    clearInterval(copiedTimer);
    copiedTimer = setInterval(function () {
        if (copiedContents != textOutput.value) {
            copied.style.opacity = '0%';
            clearInterval(copiedTimer);
        }
    }, 250);
});



//today button sets date to current
today_button.addEventListener('click', function () {

    //create date object at current time
    var date = new Date();
 
    // parse date to local in 'YYYY-MM-DD' format and place into input
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString().padStart(2, 0);
    var day = date.getDate().toString().padStart(2, 0);

    dateInput.value = `${year}-${month}-${day}`
})



// reset button resets all inputs
document.querySelector('.reset_button').addEventListener('click', function () {
    // reset to default date (nothing)
    dateInput.value = '';

    // clear textEntry
    textEntry.value = '';

    // uncheck all boxes
    for (let categoryCode in topicsExtended) {
        for (let topicCode in topicsExtended[categoryCode].topics) {
            topicsExtended[categoryCode].topics[topicCode].checkbox.checked = false;
        }
    }
})



//remove links from tab order
document.querySelectorAll('a').forEach(function (link) {
    link.tabIndex = -1;
});



//Match topic_col heights per row

//forces all rows to equal internal height
function heightMatch () {

    //get all rows from DOM
    var topic_rows = document.querySelectorAll('.topic_row');

    topic_rows.forEach(function (row) {

        //get all columns in the row
        var cols = row.querySelectorAll('.topic_col');

        //let columns set themselves to start
        cols.forEach(function (col) {
            col.style.height = 'auto';
        });
    
        //max height of this row
        var max_height = 0;
        cols.forEach(function (col) {
            max_height = Math.max(max_height, col.offsetHeight);
        });
    
        //match each column to this row
        cols.forEach(function (col) {
            col.style.height = max_height.toString(10)+'px';
        });
    });
}

//match immediately twice, then whenever window is resized
heightMatch();
setTimeout(heightMatch, 250);
window.addEventListener('resize', heightMatch);





// Get saved contents of textEntry, dateInput, and textOutput from cookies
textEntry.value = cookie.get('textEntry','');
dateInput.value = cookie.get('dateInput','');
textOutput.value = cookie.get('textOutput','');

//get saved contents of checkboxes
for (let categoryCode in topicsExtended) {
    for (let topicCode in topicsExtended[categoryCode].topics) {
        topicsExtended[categoryCode].topics[topicCode].checkbox.checked = 
        cookie.get(topicCode+'@'+topicsExtended[categoryCode].topics[topicCode].name,'off') == 'on';
    }
}

// Set contents to cookies by Interval
setInterval(function () {
    cookie.set('textEntry', textEntry.value);
    cookie.set('dateInput', dateInput.value);
    cookie.set('textOutput', textOutput.value);

    //set cookies for checkboxes
    for (let categoryCode in topicsExtended) {
        for (let topicCode in topicsExtended[categoryCode].topics) {
            if (topicsExtended[categoryCode].topics[topicCode].checkbox.checked) {
                cookie.set(topicCode+'@'+topicsExtended[categoryCode].topics[topicCode].name,'on');
            }
            else {
                cookie.set(topicCode+'@'+topicsExtended[categoryCode].topics[topicCode].name,'off');
            }
        }
    }
}, 250)
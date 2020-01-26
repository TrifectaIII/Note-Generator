// MISC 
////////////////////////////////////////

// copy button copies note from textarea
copy_button.addEventListener('click', function () {
    textOutput.select();
    document.execCommand("copy");
    //after a bit, defocus the textarea
    setTimeout(function () {
        textOutput.selectionStart = 0;
        textOutput.selectionEnd = 0;
        textOutput.blur();
    },100)
})



//today button sets date to current
today_button.addEventListener('click', function () {
    dateInput.value = moment().format('YYYY-MM-DD');
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

//match immediately, then whenever window is resized
heightMatch();
window.addEventListener('resize', heightMatch);


// Get saved contents of textEntry, dateInput, and textOutput from cookies
textEntry.value = cookie.get('textEntry','');
dateInput.value = cookie.get('dateInput','');
textOutput.value = cookie.get('textOutput','');

// Set contents to cookies by Interval
setInterval(function () {
    cookie.set('textEntry', textEntry.value);
    cookie.set('dateInput', dateInput.value);
    cookie.set('textOutput', textOutput.value);
}, 100)
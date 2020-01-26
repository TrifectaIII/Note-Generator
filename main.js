// reference from HTML
var dateInput = document.querySelector('.dateInput');// input for date of class
var today_button = document.querySelector('.today_button');//button to set date to today
var textEntry = document.querySelector('.textEntry');// textarea for custom text in note
var generate_button = document.querySelector('.generate_button'); // button to generate the note
var textOutput = document.querySelector('.textOutput'); // textarea to hold generated note
var copy_button = document.querySelector('.copy_button'); //button to cop note to clipboard

// TOPIC COLUMNS
////////////////////////////////////////

//extended object to hold all info re: topics
var topicsExtended = {}

//to generate unique identifiers
var categoryCodeTracker = 0
var topicCodeTracker = 0

// build extended object with unique identifiers
for (let category in topics) {
    let categoryCode = 'cat' + categoryCodeTracker.toString(10)
    topicsExtended[categoryCode] = {
        name:category,
        topics:{},
    }
    topics[category].forEach(function (topic) {
        let topicCode = 'top' + topicCodeTracker.toString(10)
        topicsExtended[categoryCode].topics[topicCode] = {
            name:topic,
        }
        topicCodeTracker += 1
    })
    categoryCodeTracker += 1
}

// console.log(topicsExtended)

//pull topics div from document
var topics_section = document.querySelector('.topic_section');

//init parser for the topics template
var topic_parser = Handlebars.compile(document.querySelector('.topic_template').innerHTML);

//track position in rows of 3
var row_tracker = 1;

//size of topics
var topicLength = Object.keys(topics).length;

// track total columns so far
var topicCols = 0

//hold topic html contents
var topics_HTML = '';

//loop though all categories in topics obj
for (let categoryCode in topicsExtended) {

    //add to total count
    topicCols += 1

    //if the beginning of a row of three
    if (row_tracker == 1) {
        topics_HTML += '<div class="topic_row row">';
    }

    // object to send to parser
    var topicObj = {
        categoryCode:categoryCode,
        category:topicsExtended[categoryCode].name,
        bullets:topicsExtended[categoryCode].topics,
        //if last column in its own row, put spacer to center it
        offset4:topicCols == topicLength && topicLength%3 != 2,
        //if last 2 columns in their own row, pur spacer to center both
        offset2:topicCols == topicLength-1 && topicLength%3 != 1,
    }

    //parse object and add to html
    topics_HTML += topic_parser(topicObj);

    //finish a row if last in three
    if (row_tracker == 3) {
        topics_HTML += '</div>';
        row_tracker = 1;
    } else {
        row_tracker += 1;
    }
}

// if row isnt already finished, finish it
if (row_tracker != 1) {
    topics_HTML += '</div>';
}

//place html contents into page
topics_section.innerHTML = topics_HTML;


//grab generated elements from HTML and place in extended object
for (let categoryCode in topicsExtended) {
    //grab each column 
    topicsExtended[categoryCode].column = document.querySelector(`.${categoryCode}`);
    for (let topicCode in topicsExtended[categoryCode].topics) {
        //grab each checkbox
        topicsExtended[categoryCode].topics[topicCode].checkbox =
        topicsExtended[categoryCode].column.querySelector(`.${topicCode}`);
    }
}

// console.log(topicsExtended)

// OUTPUT
////////////////////////////////////////

//init parser for the note template
var output_template = `{{#if date_exists}}
Date: {{{date}}}
{{/if}}
{{#if text_exists}}

{{{text}}}
{{/if}}

{{#if categories_exists}}
Topics Covered:
{{#each categories}}
> {{{@key}}}
  {{#each this}}
--- {{{this}}}
  {{/each}}
{{/each}}
{{/if}}`;

var output_parser = Handlebars.compile(output_template);

// function to generate note
function genOutput(parser) {
    var note_info = {
        date:dateInput.value,
        date_exists:dateInput.value != '',
        text:textEntry.value,
        text_exists:textEntry.value.trim() != '',
        categories:{},
        categories_exists:false,
    };

    //go through all checkboxs to find checked ones

    //loop through category columns first
    for (let categoryCode in topicsExtended) {
        var added = false;

        //then loop though each topic in category
        for (let topicCode in topicsExtended[categoryCode].topics) {

            //if checkbox is checked
            if (topicsExtended[categoryCode].topics[topicCode].checkbox.checked) {
                //add category to note if first checkbox seen in category
                if (!added) {
                    note_info.categories[topicsExtended[categoryCode].name] = [];
                    added = true;
                    //add categories section if first checkbox seen ever
                    note_info.categories_exists = true;
                }
                //add individual topic
                note_info.categories[topicsExtended[categoryCode].name].push(topicsExtended[categoryCode].topics[topicCode].name);
            }
        }
    }
    return parser(note_info).trim();
}

//button to generate the note
generate_button.addEventListener('click', function () {
    var contents = genOutput(output_parser);
    textOutput.value = contents;
});


// MISC 
////////////////////////////////////////

// copy button
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
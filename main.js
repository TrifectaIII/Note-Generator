// reference from HTML
var dateInput = document.querySelector('.dateInput');// input for date of class
var textEntry = document.querySelector('.textEntry');// textarea for custom text in note
var generate_button = document.querySelector('.generate_button'); // button to generate the note
var textOutput = document.querySelector('.textOutput'); // textarea to hold generated note
var copy_button = document.querySelector('.copy_button'); //button to cop note to clipboard

// TOPIC COLUMNS
////////////////////////////////////////

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
for (let category in topics) {

    //add to total count
    topicCols += 1

    //if the beginning of a row of three
    if (row_tracker == 1) {
        topics_HTML += '<div class="row">';
    }

    // object to send to parser
    var topicObj = {
        category:category,
        bullets:topics[category],
        offset:false,
    }

    //if last column and not perfect multiple of 3, offset it
    if (topicCols == topicLength && topicLength%3 != 0) {
        topicObj.offset = true;
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

//build object containing the check marks
var topicChecks = {};

for (let category in topics) {
    topicChecks[category] = {};
    for (let i=0; i < topics[category].length; i++) {
        topicChecks[category][topics[category][i]] = document.querySelector('.'+category+'-'+topics[category][i]);
    };
};

// console.log(topicChecks);

// OUTPUT
////////////////////////////////////////

//init parser for the output template
var output_template = `Date: {{date}}
{{#if text_exists}}

{{text}}
{{/if}}

{{#if categories_exists}}
Topics Covered:
{{#each categories}}
\t> {{@key}}
  {{#each this}}
\t\t- {{this}}
  {{/each}}
{{/each}}
{{/if}}`

var output_parser = Handlebars.compile(output_template);

// function to generate and display output
function genOutput(parser) {
    var info = {
        date:dateInput.value,
        text:textEntry.value,
        text_exists:textEntry.value.trim() != '',
        categories:{},
        categories_exists:false,
    };

    //loop through all checkboxes
    for (let category in topicChecks) {
        var added = false
        for (let topic in topicChecks[category]) {
            if (topicChecks[category][topic].checked) {
                if (!added) {
                    info.categories[category] = []
                    added = true
                    info.categories_exists = true
                }
                info.categories[category].push(topic)
            }
        }
    }

    return parser(info);
}

generate_button.addEventListener('click', function () {
    var contents = genOutput(output_parser);
    textOutput.value = contents;
})


// MISC 
////////////////////////////////////////

// copy button
copy_button.addEventListener('click', function () {
    textOutput.select();
    document.execCommand("copy");
    setTimeout(function () {
        textOutput.selectionStart = 0;
        textOutput.selectionEnd = 0;
    },100)
})

// default date is today
dateInput.valueAsDate = new Date();

// reset button
document.querySelector('.reset_button').addEventListener('click', function () {
    // reset to default date (today)
    dateInput.valueAsDate = new Date();

    // clear textEntry
    textEntry.value = '';

    // uncheck all boxes
    for (let category in topicChecks) {
        for (let topic in topicChecks[category]) {
            topicChecks[category][topic].checked = false;
        }
    }
})

//remove links from tab order
document.querySelectorAll('a').forEach(function (link) {
    link.tabIndex = -1;
});
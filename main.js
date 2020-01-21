// reference from HTML
var dateInput = document.querySelector('.dateInput');
var textEntry = document.querySelector('.textEntry');
var generate_button = document.querySelector('.generate_button');


// TOPIC COLUMNS
////////////////////////////////////////

//pull topics div from document
var topics_section = document.querySelector('.topic_section');

//init parser for the topics template
var topic_parser = Handlebars.compile(document.querySelector('.topic_template').innerHTML);

//track position in rows of 3
var row_tracker = 1;

//eventual topic html contents
var topics_output = '';

for (let category in topics) {
    if (row_tracker == 1) {
        topics_output += '<div class="row">';
    }
    topics_output += topic_parser({
        category:category,
        bullets:topics[category]
    });
    if (row_tracker == 3) {
        topics_output += '</div>';
        row_tracker = 1;
    } else {
        row_tracker += 1;
    }
}

if (row_tracker != 1) {
    topics_output += '</div>';
}

//place contents into page
topics_section.innerHTML = topics_output;

//build object containing the check marks
var topicChecks = {};

for (let category in topics) {
    topicChecks[category] = [];
    for (let i=0; i < topics[category].length; i++) {
        topicChecks[category].push(document.querySelector('.'+category+'-'+topics[category][i]))
    };
};

// OUTPUT
////////////////////////////////////////

//pull output div from document
var output = document.querySelector('.output_section');

//init parser for the output template
var output_parser = Handlebars.compile(document.querySelector('.output_template').innerHTML);

// function to generate and display output
function genOutput(div, parser, ability) {
}

generate_button.addEventListener('click', function () {
    console.log('GENERATE')
})


// MISC 
////////////////////////////////////////

// default date is today
document.querySelector('.dateInput').valueAsDate = new Date();

// reset button
document.querySelector('.reset_button').addEventListener('click', function () {
    // reset to default date (today)
    document.querySelector('.dateInput').valueAsDate = new Date();

    //clear textEntry
    textEntry.value = '';
})

//remove links from tab order
document.querySelectorAll('a').forEach(function (link) {
    link.tabIndex = -1;
});
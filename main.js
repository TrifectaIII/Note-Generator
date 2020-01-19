// default date is today
document.querySelector('.dateInput').valueAsDate = new Date();


// TOPIC COLUMNS
////////////////////////////////////////

//pull topics div from document
var topics_section = document.querySelector('.topic_section');

//init parser for the topics template
var topic_parser = Handlebars.compile(document.querySelector('.topic_template').innerHTML);

var row_tracker = 1;

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

topics_section.innerHTML = topics_output;

// OUTPUT
////////////////////////////////////////

//pull output div from document
var output = document.querySelector('.output_section');

//init parser for the output template
var output_parser = Handlebars.compile(document.querySelector('.output_template').innerHTML);

// function to generate and display output
function genOutput(div, parser, ability) {
}

//Update Output when inputs are valid
setInterval(function () {
    //only check when inputs change
}, 250);


// MISC 
////////////////////////////////////////

//remove links from tab order
document.querySelectorAll('a').forEach(function (link) {
    link.tabIndex = -1;
});
// reference from HTML
var dateInput = document.querySelector('.dateInput');
var textEntry = document.querySelector('.textEntry');
var generate_button = document.querySelector('.generate_button');
var textOutput = document.querySelector('.textOutput');
var copy_button = document.querySelector('.copy_button');

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
>  {{@key}}
  {{#each this}}
-    {{this}}
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
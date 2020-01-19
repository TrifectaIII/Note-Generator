// default date is today
document.querySelector('.dateInput').valueAsDate = new Date();


// OUTPUT
////////////////////////////////////////

//pull output div from document
var output = document.querySelector('.output_section');

//init parser for the output template
var output_parser = Handlebars.compile(document.querySelector('.output_template').innerHTML);

// function to generate and display output
function genOutput(div, parser, ability) {
    div.innerHTML = ability.value;
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
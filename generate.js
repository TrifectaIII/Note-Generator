// GENERATE NOTE OUTPUT
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
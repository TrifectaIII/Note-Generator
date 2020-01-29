// POPULATE TOPIC COLUMNS
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
        offset4:topicCols == topicLength && topicLength%3 == 1,
        //if last 2 columns in their own row, pur spacer to center both
        offset2:topicCols == topicLength-1 && topicLength%3 == 2,
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
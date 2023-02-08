
//variables for the current time
var today = moment();
var todaysDate = moment().format('dddd') + " " + moment().format ("Do MMM YYYY");

var tasks = {
    "9": [],
    "10": [], 
    "11": [],
    "12": [],
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": []

};

//function to set tasks to the local storage 
var setTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//function to get tasks out of the local storage
var getTasks = function() {
    var loadedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (loadedTasks) {
        tasks = loadedTasks

        //create task
        $.each(tasks, function(hour, task) {
            var hourDiv = $("#" + hour);
            createTask(task, hourDiv);
        })
    }

    auditTasks()
}

//creating a task function with tasktext and hourdiv
// want the description of the task to be added to a class, and we want to add the text into the tasktext variable

var createTask = function(taskText, hourDiv) {

    var taskDiv= hourDiv.find(".task");
    var taskparagraph = $("<p>")
        .addClass("description")
        .text(taskText)
    taskDiv.html(taskparagraph);
}

//this is going to change the task elements depending on the hour
//if the hour correlated to the task is less than the current hour we are going to label it as a past task
//if the hour correlated to the task is equal to the current hour we are going to label it as present
//anything else is going to go in the else function and is going to be labeled as a future task
var auditTasks = function() {

    var currentHour = moment().hour();
    $(".task-info").each (function () {
        var taskHour = parseInt($(this).attr("id"));

        if (taskHour < currentHour) {
            $(this).removeClass(["present", "future"]).addClass("past");
        }
        else if ( taskHour === currentHour ) {
            $(this).removeClass(["past", "future"]).addClass("present");
        }
        else {
            $(this).removeClass(["past", "present"]).addClass("future");
        }
    })
};

//created a replace text function
//create two variables tasktext and linking it by using .closest, which finds the first element of the ancestor of a selected element
//created text area where we want to find the element text area
//.attr will return attributes of the id element
//we want to call out the setTasks function
//and the create tasks function
var replateText = function(textElement) {
    
    var taskText = textElement.closest(".task-info");
    var textArea = taskInfo.find("textarea");

    var time = taskText.attr("id");
    var text = textArea.val().trim();

    tasks[time] = [text];
    setTasks();

    createTask(text, taskText);
}

//when the user clicks task then this function will run
//
$(".task").click(function() {

    $("textarea").each(function(){
        replaceTextArea($(this));
    })

//retrieving the closest attribute to task-info
    var time = $(this).closest(".task-info").attr("id");
    if (parseInt(time) >= moment().hour()) {
        var text = $(this).text();
        var textInput = $("<textarea>")
            .addClass("form")
            .val(text);

            $(this).html(textInput);
            textInput.trigger("focus");
    }
})

// function colorchange(){
//     $(".form").each(function () {
//         var timeTest = parseInt($(this).attr("id"));
//         hour = parseInt(hour);
//         console.log(hour);
//         if (hour > timeTest) {
//             $(this).addClass(".past");
//         } else if (hour < timeTest) {
//             $(this).addClass(".future");
//         } else {
//             $(this).addClass(".present");
//         }
//     });
// }

$(".saveBtn").click(function() {
    replaceTextArea($(this));
})

timeHour = 3600000 - today.milliseconds();
setTimeout(function() {
    setInterval(auditTasks, 3600000)
}, timeHour)

//for local storage to load
getTasks();

//text input works for 9am but nothing else
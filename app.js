"use strict";

function MyApp() {
    var version="v1.0";
    
    function setStatus(message) {
        $("#app>footer").text(message);
    }
    
    function addTask() {
        var taskName=$("#new-task-name").val();
        if(taskName) {
            addTaskElement(taskName);
            $("#new-task-name").val("").focus();
        }
    }
    
    function addTaskElement(taskName) {
        var $task = $("<li></li>");
        var $delete=$("<button class='delete'>X</button>");
        var $moveUp = $("<button class='move-up'>^</button>");
        var $moveDown = $("<button class='move-down'>v</button>");
        $task.append($delete)
             .append($moveUp)
             .append($moveDown)
             .append("<span class='task-name'>"+taskName+"</span>");
        $("#task-list").append($task);
        
        $delete.click(function() {$task.remove();});
        $moveUp.click(function() {
           $task.insertBefore($task.prev()); 
        });
        $moveDown.click(function() {
           $task.insertAfter($task.next()); 
        });
       
    }
    
    this.start = function() {
        $("#new-task-name").keypress(function(e) {
            if(e.which===13) {
                addTask();
                return false;
            }
        });
        $("#app>header").append(version);
        setStatus("ready");
    };
}
$(function() {
    window.app = new MyApp();
    window.app.start();
});
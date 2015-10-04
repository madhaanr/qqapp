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
        var $task = $("#task-template .task").clone();
        $("span.task-name", $task).text(taskName);
        $("#task-list").append($task);
        
        $("button.delete", $task).click(function() {
            $task.remove();
        });
        $("button.move-up", $task).click(function() {
           $task.insertBefore($task.prev()); 
        });
        $("button.move-down").click(function() {
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
"use strict";

function MyApp() {
    var version="v2.1",
        appStorage=new AppStorage("taskAtHand");
    
    function setStatus(message) {
        $("#app>footer").text(message);
    }
    
    function addTask() {
        var taskName=$("#new-task-name").val();
        if(taskName) {
            addTaskElement(taskName);
            saveTaskList();
            $("#new-task-name").val("").focus();
        }
    }
    
    function addTaskElement(taskName) {
        var $task = $("#task-template .task").clone();
        $("span.task-name", $task).text(taskName);
        
        $("#task-list").append($task);
        
        $("button.delete", $task).click(function() {
            removeTask($task, true);
        });
        $("button.move-up", $task).click(function() {
           moveTask($task,true); 
        });
        $("button.move-down",$task).click(function() {
           moveTask($task,false); 
        });
        $("span.task-name",$task).click(function() {
           onEditTaskName($(this)); 
        });
        $("input.task-name",$task).change(function() {
           onChangeTaskName($(this)); 
        }).blur(function() {
           $(this).hide().siblings("span.task-name").show(); 
        });
    }
    
    function removeTask($task) {
        $task.remove();
        saveTaskList();
    }
    
    function moveTask($task, moveUp) {
        if(moveUp) {
            $task.insertBefore($task.prev());
        }
        else {
            $task.insertAfter($task.next());
        }
        saveTaskList();
    }
    
    function onEditTaskName($span) {
        $span.hide()
             .siblings("input.task-name")
             .val($span.text())
             .show()
             .focus();
    }
    
    function onChangeTaskName($input) {
        $input.hide();
        var $span=$input.siblings("span.task-name");
        if($input.val()) {
            $span.text($input.val());
        }
        saveTaskList();
        $span.show();
    }
    
    function saveTaskList() {
        var tasks=[];
        $("#task-list .task span.task-name").each(function() {
            tasks.push($(this).text());
        });
        appStorage.setValue("taskList",tasks);
    }
    
    function loadTaskList() {
        var tasks=appStorage.getValue('taskList');
        if(tasks) {
            for (var i in tasks) {
                addTaskElement(tasks[i]);
            }
        }
    }
    
    this.start = function() {
        $("#new-task-name").keypress(function(e) {
            if(e.which===13) {
                addTask();
                return false;
            }
        });
        $("#app>header").append(version);
        loadTaskList();
        setStatus("ready");
    };
}

$(function() {
    window.app = new MyApp();
    window.app.start();
});
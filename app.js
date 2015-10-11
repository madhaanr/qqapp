"use strict";

function MyApp() {
    var version = "v3.3",
            appStorage = new AppStorage("taskAtHand"),
            taskList = new TaskList(),
            timeoutId = 0;

    function setStatus(message, noFade) {
        $("#app>footer").text(message).show();
        if (!noFade) {
            $("#app>footer").fadeOut(1000);
        }
    }

    function addTask() {
        var taskName = $("#new-task-name").val();
        if (taskName) {
            var task = new Task(taskName);
            taskList.addTask(task);
            appStorage.setValue("nextTaskId", Task.nextTaskId);
            addTaskElement(task);
            saveTaskList();
            $("#new-task-name").val("").focus();
        }
    }

    function addTaskElement(task) {
        var $task = $("#task-template .task").clone();
        $task.data("task-id", task.id);
        $("span.task-name", $task).text(task.name);
        $(".details input, .details select", $task).each(function () {
            var $input = $(this);
            var fieldName = $input.data("field");
            $input.val(task[fieldName]);
        });
        $("#task-list").append($task);

        $("button.delete", $task).click(function () {
            removeTask($task, true);
        });
        $("button.move-up", $task).click(function () {
            moveTask($task, true);
        });
        $("button.move-down", $task).click(function () {
            moveTask($task, false);
        });
        $("span.task-name", $task).click(function () {
            onEditTaskName($(this));
        });
        $("input.task-name", $task).change(function () {
            onChangeTaskName($(this));
        }).blur(function () {
            $(this).hide().siblings("span.task-name").show();
        });
        $(".details input, .details select", $task).change((function () {
            onChangeTaskDetails(task.id, $(this));
        }))

        $("button.toggle-details", $task).click(function () {
            $task.click(function () {
                onSelectTask($task);
            });
            toggleDetails($task);
        });
    }

    function onChangeTaskDetails(taskId, $input) {
        var task = taskList.getTask(taskId);
        if (task) {
            var fieldName = $input.data("field");
            task[fieldName] = $input.val();
            saveTaskList();
        }
    }

    function onSelectTask($task) {
        if ($task) {
            $task.siblings(".selected").removeClass("selected");
            $task.addClass("selected");
        }
    }

    function removeTask($task) {
        $task.remove();
        saveTaskList();
    }

    function moveTask($task, moveUp) {
        if (moveUp) {
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
        var $span = $input.siblings("span.task-name");
        if ($input.val()) {
            $span.text($input.val());
        }
        saveTaskList();
        $span.show();
    }

    function saveTaskList() {
        if (timeoutId)
            clearTimeout(timeoutId);
        setStatus("saving changes...", true);
        timeoutId = setTimeout(function () {
            appStorage.setValue("taskList", taskList.getTasks());
            timeoutId=0;
            setStatus("changes saved.");
        },2000);
    }

    function loadTaskList() {
        var tasks = appStorage.getValue("taskList");
        taskList = new TaskList(tasks);
        rebuildTaskList();
    }

    function rebuildTaskList() {
        $("#task-list").empty();
        taskList.each(function (task) {
            addTaskElement(task);
        });
    }

    function onChangeTheme() {
        var theme = $("#theme>option").filter(":selected").val();
        setTheme(theme);
        appStorage.setValue("theme", theme);
    }

    function setTheme(theme) {
        $("#theme-style").attr("href", "themes/" + theme + ".css");
    }
    function loadTheme() {
        var theme = appStorage.getValue("theme");
        if (theme) {
            setTheme(theme);
            $("#theme>option[value=" + theme + "]")
                    .attr("selected", "selected");
        }
    }

    function toggleDetails($task) {
        $(".details", $task).slideToggle();
        $("button.toggle-details", $task).toggleClass("expanded");
    }

    this.start = function () {
        $("#new-task-name").keypress(function (e) {
            if (e.which === 13) {
                addTask();
                return false;
            }
        });
        $("#theme").change(onChangeTheme);
        $("#app>header").append(version);
        loadTaskList();
        loadTheme();
        setStatus("ready");
    };
}

$(function () {
    window.app = new MyApp();
    window.app.start();
});
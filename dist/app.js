"use strict";
/// <reference path="models.ts" />
/**
 * Kezdő feladatok — TypeScript tömbből (követelmény 1).
 * Az AngularJS controller ebből tölti a listát.
 */
var FeladatApp;
(function (FeladatApp) {
    FeladatApp.INITIAL_TASKS = [
        {
            id: 1,
            title: "README megírása",
            description: "Futtatási útmutató és követelmény-térkép",
            priority: "high",
            status: "done",
            estimatedMinutes: 30,
        },
        {
            id: 2,
            title: "TypeScript modulok",
            description: "Adatmodell, számított értékek, controller",
            priority: "high",
            status: "doing",
            estimatedMinutes: 90,
        },
        {
            id: 3,
            title: "Bootstrap űrlap",
            description: "Validáció és vizuális visszajelzés",
            priority: "medium",
            status: "todo",
            estimatedMinutes: 45,
        },
        {
            id: 4,
            title: "Szűrés tesztelése",
            description: "Kis- és nagybetű független keresés",
            priority: "low",
            status: "todo",
            estimatedMinutes: 20,
        },
        {
            id: 5,
            title: "Prezentáció",
            description: "Rövid demó a kötelező elemekről",
            priority: "medium",
            status: "todo",
            estimatedMinutes: 40,
        },
    ];
})(FeladatApp || (FeladatApp = {}));
/// <reference path="models.ts" />
/**
 * Számított értékek TypeScript modulból (követelmény 6).
 * A template csak a kész eredményt jeleníti meg.
 */
var FeladatApp;
(function (FeladatApp) {
    /** Összes becsült perc a listában. */
    function computeTotalMinutes(tasks) {
        return tasks.reduce(function (sum, task) {
            return sum + (task.estimatedMinutes || 0);
        }, 0);
    }
    FeladatApp.computeTotalMinutes = computeTotalMinutes;
    /** Kész feladatok száma. */
    function countDone(tasks) {
        return tasks.filter(function (t) {
            return t.status === "done";
        }).length;
    }
    FeladatApp.countDone = countDone;
    /** Haladás százalékban (0–100). */
    function computeProgressPercent(tasks) {
        if (!tasks.length) {
            return 0;
        }
        return Math.round((countDone(tasks) / tasks.length) * 100);
    }
    FeladatApp.computeProgressPercent = computeProgressPercent;
    /** Prioritás magyar címkéje. */
    function priorityLabel(priority) {
        switch (priority) {
            case "high":
                return "Magas";
            case "medium":
                return "Közepes";
            case "low":
                return "Alacsony";
            default:
                return priority;
        }
    }
    FeladatApp.priorityLabel = priorityLabel;
    /** Státusz magyar címkéje. */
    function statusLabel(status) {
        switch (status) {
            case "todo":
                return "Teendő";
            case "doing":
                return "Folyamatban";
            case "done":
                return "Kész";
            default:
                return status;
        }
    }
    FeladatApp.statusLabel = statusLabel;
})(FeladatApp || (FeladatApp = {}));
/// <reference path="models.ts" />
/// <reference path="data.ts" />
/// <reference path="stats.ts" />
/**
 * AngularJS 1.x alkalmazás — Feladatkezelő.
 * Követelmények: lista, űrlap+validáció, események, binding,
 * szűrés, számított érték, form feedback, dinamikus CSS.
 */
var FeladatApp;
(function (FeladatApp) {
    function emptyForm() {
        return {
            title: "",
            description: "",
            priority: "medium",
            status: "todo",
            estimatedMinutes: null,
        };
    }
    function TaskController($scope) {
        var nextId = FeladatApp.INITIAL_TASKS.reduce(function (max, t) {
            return Math.max(max, t.id);
        }, 0) + 1;
        $scope.tasks = FeladatApp.INITIAL_TASKS.map(function (t) {
            return {
                id: t.id,
                title: t.title,
                description: t.description,
                priority: t.priority,
                status: t.status,
                estimatedMinutes: t.estimatedMinutes,
            };
        });
        $scope.filterText = "";
        $scope.form = emptyForm();
        $scope.editingId = null;
        $scope.flashMessage = "";
        $scope.filteredTasks = function () {
            var q = ($scope.filterText || "").trim().toLowerCase();
            if (!q) {
                return $scope.tasks;
            }
            return $scope.tasks.filter(function (task) {
                var hay = (task.title + " " + task.description + " " + task.status + " " + task.priority).toLowerCase();
                return hay.indexOf(q) !== -1;
            });
        };
        $scope.totalMinutes = function () {
            return FeladatApp.computeTotalMinutes($scope.tasks);
        };
        $scope.doneCount = function () {
            return FeladatApp.countDone($scope.tasks);
        };
        $scope.progressPercent = function () {
            return FeladatApp.computeProgressPercent($scope.tasks);
        };
        $scope.priorityLabel = FeladatApp.priorityLabel;
        $scope.statusLabel = FeladatApp.statusLabel;
        /** Dinamikus CSS osztályok adat alapján (követelmény 8). */
        $scope.rowClass = function (task) {
            return {
                "task-done": task.status === "done",
                "task-doing": task.status === "doing",
                "task-todo": task.status === "todo",
                "priority-high": task.priority === "high",
                "priority-medium": task.priority === "medium",
                "priority-low": task.priority === "low",
            };
        };
        $scope.badgeClass = function (task) {
            if (task.status === "done") {
                return "bg-success";
            }
            if (task.status === "doing") {
                return "bg-primary";
            }
            if (task.priority === "high") {
                return "bg-danger";
            }
            if (task.priority === "medium") {
                return "bg-warning text-dark";
            }
            return "bg-secondary";
        };
        $scope.isFormValid = function () {
            var titleOk = !!($scope.form.title && $scope.form.title.trim().length >= 3);
            var mins = $scope.form.estimatedMinutes;
            var minsOk = mins !== null && mins !== undefined && !isNaN(Number(mins)) && Number(mins) >= 1;
            return titleOk && minsOk;
        };
        function showFlash(msg) {
            $scope.flashMessage = msg;
        }
        /** Mentés gomb / Enter az űrlapon (követelmény 2, 3). */
        $scope.submitForm = function () {
            if (!$scope.isFormValid()) {
                showFlash("Az űrlap hibás — javítsd a kiemelt mezőket.");
                return;
            }
            var payload = {
                id: $scope.editingId !== null ? $scope.editingId : nextId++,
                title: $scope.form.title.trim(),
                description: ($scope.form.description || "").trim(),
                priority: $scope.form.priority,
                status: $scope.form.status,
                estimatedMinutes: Number($scope.form.estimatedMinutes),
            };
            if ($scope.editingId !== null) {
                var idx = $scope.tasks.findIndex(function (t) {
                    return t.id === $scope.editingId;
                });
                if (idx >= 0) {
                    $scope.tasks[idx] = payload;
                }
                showFlash("Feladat frissítve: „" + payload.title + "”");
            }
            else {
                $scope.tasks.push(payload);
                showFlash("Új feladat hozzáadva: „" + payload.title + "”");
            }
            $scope.form = emptyForm();
            $scope.editingId = null;
            if ($scope.taskForm) {
                $scope.taskForm.$setPristine();
                $scope.taskForm.$setUntouched();
            }
        };
        $scope.startEdit = function (task) {
            $scope.editingId = task.id;
            $scope.form = {
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                estimatedMinutes: task.estimatedMinutes,
            };
            showFlash("Szerkesztés: „" + task.title + "”");
        };
        $scope.cancelEdit = function () {
            $scope.editingId = null;
            $scope.form = emptyForm();
            showFlash("Szerkesztés megszakítva.");
            if ($scope.taskForm) {
                $scope.taskForm.$setPristine();
                $scope.taskForm.$setUntouched();
            }
        };
        $scope.removeTask = function (task) {
            $scope.tasks = $scope.tasks.filter(function (t) {
                return t.id !== task.id;
            });
            if ($scope.editingId === task.id) {
                $scope.cancelEdit();
            }
            showFlash("Törölve: „" + task.title + "”");
        };
        /** Kattintás: státusz váltás kész / teendő között (követelmény 3). */
        $scope.toggleDone = function (task) {
            task.status = task.status === "done" ? "todo" : "done";
            showFlash(task.status === "done"
                ? "Késznek jelölve: „" + task.title + "”"
                : "Újra teendő: „" + task.title + "”");
        };
        /**
         * Enter a szűrőmezőben: fókusz a listára / üzenet (követelmény 3).
         * Másik eseménytípus, mint a gombok ng-click-je.
         */
        $scope.onFilterKeyup = function ($event) {
            if ($event.key === "Enter" || $event.keyCode === 13) {
                var n = $scope.filteredTasks().length;
                showFlash("Szűrés alkalmazva — " + n + " találat („" + ($scope.filterText || "") + "”).");
            }
        };
        $scope.clearFilter = function () {
            $scope.filterText = "";
            showFlash("Szűrés törölve.");
        };
    }
    TaskController.$inject = ["$scope"];
    angular.module("feladatApp", []).controller("TaskController", TaskController);
})(FeladatApp || (FeladatApp = {}));
//# sourceMappingURL=app.js.map
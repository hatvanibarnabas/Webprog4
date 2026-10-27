/// <reference path="models.ts" />
/// <reference path="data.ts" />
/// <reference path="stats.ts" />

declare const angular: any;

/**
 * AngularJS 1.x alkalmazás — Feladatkezelő.
 * Követelmények: lista, űrlap+validáció, események, binding,
 * szűrés, számított érték, form feedback, dinamikus CSS.
 */
namespace FeladatApp {
  interface TaskScope {
    tasks: Task[];
    filterText: string;
    form: TaskFormModel;
    editingId: number | null;
    flashMessage: string;
    taskForm: any;

    filteredTasks: () => Task[];
    totalMinutes: () => number;
    doneCount: () => number;
    progressPercent: () => number;
    priorityLabel: (p: Task["priority"]) => string;
    statusLabel: (s: Task["status"]) => string;
    rowClass: (task: Task) => Record<string, boolean>;
    badgeClass: (task: Task) => string;

    submitForm: () => void;
    startEdit: (task: Task) => void;
    cancelEdit: () => void;
    removeTask: (task: Task) => void;
    toggleDone: (task: Task) => void;
    onFilterKeyup: ($event: KeyboardEvent) => void;
    clearFilter: () => void;
    isFormValid: () => boolean;
  }

  function emptyForm(): TaskFormModel {
    return {
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      estimatedMinutes: null,
    };
  }

  function TaskController($scope: TaskScope): void {
    let nextId =
      INITIAL_TASKS.reduce(function (max, t) {
        return Math.max(max, t.id);
      }, 0) + 1;

    $scope.tasks = INITIAL_TASKS.map(function (t) {
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

    $scope.filteredTasks = function (): Task[] {
      const q = ($scope.filterText || "").trim().toLowerCase();
      if (!q) {
        return $scope.tasks;
      }
      return $scope.tasks.filter(function (task) {
        const hay =
          (task.title + " " + task.description + " " + task.status + " " + task.priority).toLowerCase();
        return hay.indexOf(q) !== -1;
      });
    };

    $scope.totalMinutes = function (): number {
      return computeTotalMinutes($scope.tasks);
    };

    $scope.doneCount = function (): number {
      return countDone($scope.tasks);
    };

    $scope.progressPercent = function (): number {
      return computeProgressPercent($scope.tasks);
    };

    $scope.priorityLabel = priorityLabel;
    $scope.statusLabel = statusLabel;

    /** Dinamikus CSS osztályok adat alapján (követelmény 8). */
    $scope.rowClass = function (task: Task): Record<string, boolean> {
      return {
        "task-done": task.status === "done",
        "task-doing": task.status === "doing",
        "task-todo": task.status === "todo",
        "priority-high": task.priority === "high",
        "priority-medium": task.priority === "medium",
        "priority-low": task.priority === "low",
      };
    };

    $scope.badgeClass = function (task: Task): string {
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

    $scope.isFormValid = function (): boolean {
      const titleOk = !!($scope.form.title && $scope.form.title.trim().length >= 3);
      const mins = $scope.form.estimatedMinutes;
      const minsOk = mins !== null && mins !== undefined && !isNaN(Number(mins)) && Number(mins) >= 1;
      return titleOk && minsOk;
    };

    function showFlash(msg: string): void {
      $scope.flashMessage = msg;
    }

    /** Mentés gomb / Enter az űrlapon (követelmény 2, 3). */
    $scope.submitForm = function (): void {
      if (!$scope.isFormValid()) {
        showFlash("Az űrlap hibás — javítsd a kiemelt mezőket.");
        return;
      }

      const payload: Task = {
        id: $scope.editingId !== null ? $scope.editingId : nextId++,
        title: $scope.form.title.trim(),
        description: ($scope.form.description || "").trim(),
        priority: $scope.form.priority,
        status: $scope.form.status,
        estimatedMinutes: Number($scope.form.estimatedMinutes),
      };

      if ($scope.editingId !== null) {
        const idx = $scope.tasks.findIndex(function (t) {
          return t.id === $scope.editingId;
        });
        if (idx >= 0) {
          $scope.tasks[idx] = payload;
        }
        showFlash("Feladat frissítve: „" + payload.title + "”");
      } else {
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

    $scope.startEdit = function (task: Task): void {
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

    $scope.cancelEdit = function (): void {
      $scope.editingId = null;
      $scope.form = emptyForm();
      showFlash("Szerkesztés megszakítva.");
      if ($scope.taskForm) {
        $scope.taskForm.$setPristine();
        $scope.taskForm.$setUntouched();
      }
    };

    $scope.removeTask = function (task: Task): void {
      $scope.tasks = $scope.tasks.filter(function (t) {
        return t.id !== task.id;
      });
      if ($scope.editingId === task.id) {
        $scope.cancelEdit();
      }
      showFlash("Törölve: „" + task.title + "”");
    };

    /** Kattintás: státusz váltás kész / teendő között (követelmény 3). */
    $scope.toggleDone = function (task: Task): void {
      task.status = task.status === "done" ? "todo" : "done";
      showFlash(
        task.status === "done"
          ? "Késznek jelölve: „" + task.title + "”"
          : "Újra teendő: „" + task.title + "”"
      );
    };

    /**
     * Enter a szűrőmezőben: fókusz a listára / üzenet (követelmény 3).
     * Másik eseménytípus, mint a gombok ng-click-je.
     */
    $scope.onFilterKeyup = function ($event: KeyboardEvent): void {
      if ($event.key === "Enter" || ($event as any).keyCode === 13) {
        const n = $scope.filteredTasks().length;
        showFlash(
          "Szűrés alkalmazva — " + n + " találat („" + ($scope.filterText || "") + "”)."
        );
      }
    };

    $scope.clearFilter = function (): void {
      $scope.filterText = "";
      showFlash("Szűrés törölve.");
    };
  }

  TaskController.$inject = ["$scope"];

  angular.module("feladatApp", []).controller("TaskController", TaskController);
}

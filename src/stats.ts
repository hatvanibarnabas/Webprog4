/// <reference path="models.ts" />

/**
 * Számított értékek TypeScript modulból (követelmény 6).
 * A template csak a kész eredményt jeleníti meg.
 */
namespace FeladatApp {
  /** Összes becsült perc a listában. */
  export function computeTotalMinutes(tasks: Task[]): number {
    return tasks.reduce(function (sum, task) {
      return sum + (task.estimatedMinutes || 0);
    }, 0);
  }

  /** Kész feladatok száma. */
  export function countDone(tasks: Task[]): number {
    return tasks.filter(function (t) {
      return t.status === "done";
    }).length;
  }

  /** Haladás százalékban (0–100). */
  export function computeProgressPercent(tasks: Task[]): number {
    if (!tasks.length) {
      return 0;
    }
    return Math.round((countDone(tasks) / tasks.length) * 100);
  }

  /** Prioritás magyar címkéje. */
  export function priorityLabel(priority: Task["priority"]): string {
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

  /** Státusz magyar címkéje. */
  export function statusLabel(status: Task["status"]): string {
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
}

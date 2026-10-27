/** Egy feladat adatmodellje. */
interface Task {
  id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "doing" | "done";
  estimatedMinutes: number;
}

/** Űrlap mezők a hozzáadáshoz / szerkesztéshez. */
interface TaskFormModel {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "doing" | "done";
  estimatedMinutes: number | null;
}

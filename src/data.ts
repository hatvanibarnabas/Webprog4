/// <reference path="models.ts" />

/**
 * Kezdő feladatok — TypeScript tömbből (követelmény 1).
 * Az AngularJS controller ebből tölti a listát.
 */
namespace FeladatApp {
  export const INITIAL_TASKS: Task[] = [
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
}

"use client";

import Todo from "./components/Todo";
import { useTasks } from "./hooks/useTask";

export default function Home() {
  const {
    tasks,
    error,
    handleAddTask,
    handleUpdateTask,
    handleToggleComplete,
    handleDeleteTask,
  } = useTasks();

  return (
    <Todo
      tasks={tasks}
      error={error}
      handleAddTask={handleAddTask}
      handleUpdateTask={handleUpdateTask}
      handleToggleComplete={handleToggleComplete}
      handleDeleteTask={handleDeleteTask}
    />
  );
}

"use client";
import { Task } from "@/models/Task";
import AddTaskForm from "./AddTaskForm";
import TaskList from "./TaskList";
import { useState } from "react";
import TaskDetail from "./TaskDetail";

interface TodoProps {
  tasks: Task[];
  error: string | null;
  handleAddTask: (newTask: Task) => Promise<void>;
  handleUpdateTask: (updatedTask: Task) => Promise<void>;
  handleToggleComplete: (taskId: string) => Promise<void>;
  handleDeleteTask: (taskId: string) => Promise<void>;
}

export default function Todo(props: TodoProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleOpenTaskDetail = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskDetail = () => {
    setSelectedTask(null);
  };

  return (
    <div className="container">
      {props.error && <div className="text-red-500">{props.error}</div>}
      <h1 className="text-2xl font-bold text-center mb-4">TODO APP</h1>

      {/* タスク追加フォーム */}
      <AddTaskForm onAddTask={props.handleAddTask} />

      {/* タスクリスト */}
      <TaskList
        tasks={props.tasks}
        onToggleComplete={props.handleToggleComplete}
        onDelete={props.handleDeleteTask}
        onOpenTaskDetail={handleOpenTaskDetail}
      />

      {/* タスク詳細ウィンドウ */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={handleCloseTaskDetail}
          onDelete={props.handleDeleteTask}
          onUpdate={props.handleUpdateTask}
        />
      )}
    </div>
  );
}

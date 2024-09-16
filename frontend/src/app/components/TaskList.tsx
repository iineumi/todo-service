"use client";
import { Task } from "@/models/Task";
import { useState } from "react";
import ExitIcon from "./icons/ExitIcon";
import SettingIcon from "./icons/SettingIcon";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onOpenTaskDetail: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskList(props: TaskListProps) {
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const toggleDeleteMode = () => setIsDeleteMode(!isDeleteMode);

  return (
    <div>
      {/* 削除モード切り替えボタン */}
      <div className="flex justify-end mb-4">
        <button onClick={toggleDeleteMode} className="setting-button">
          {isDeleteMode ? (
            <ExitIcon className="size-6" />
          ) : (
            <SettingIcon className="size-6" />
          )}
        </button>
      </div>

      {/* タスク一覧 */}
      <ul className="list-none p-0">
        {props.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            level={0}
            onToggleComplete={props.onToggleComplete}
            onOpenTaskDetail={props.onOpenTaskDetail}
            onDelete={props.onDelete}
            isDeleteMode={isDeleteMode}
          />
        ))}
      </ul>
    </div>
  );
}

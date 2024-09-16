import { Task } from "@/models/Task";
import DeleteIcon from "./icons/DeleteIcon";

interface TaskItemProps {
  task: Task;
  level: number;
  onToggleComplete: (taskId: string) => void;
  onOpenTaskDetail: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDeleteMode: boolean;
}

export function TaskItem(props: TaskItemProps) {
  // アーカイブ済みタスクは表示しない
  if (props.task.isArchived) return null;

  function handleToggleComplete(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    props.onToggleComplete(props.task.id);
  }

  const handleDelete = () => props.onDelete(props.task.id);

  const formatDate = (date: Date | null) => {
    return date
      ? new Date(date).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "";
  };

  return (
    <li
      key={props.task.id}
      className={`rounded-lg p-3 shadow ml-${
        props.level * 4
      } bg-white flex items-center justify-between ${
        props.task.completed ? "opacity-50 line-through" : ""
      }`}
    >
      <div className="flex items-center grow">
        {/* チェックボックスとタスク名 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={props.task.completed}
            onChange={handleToggleComplete}
            className="mr-2"
          />
          <span
            className={`font-bold cursor-pointer ${
              props.task.completed ? "text-gray-400" : ""
            }`}
            onClick={() => props.onOpenTaskDetail(props.task)}
          >
            {props.task.title}
          </span>
        </div>

        {/* 期限と削除ボタン */}
        <div className="flex items-center ml-auto">
          {props.task.dueDate?.Valid && (
            <div className="mr-4 inline-flex items-center justify-center w-32 rounded-md bg-gray-200 px-2 py-1">
              {formatDate(props.task.dueDate.Time)}
            </div>
          )}
          <div className="w-6 inline-flex">
            {props.isDeleteMode && (
              <button onClick={handleDelete} className="text-red-500">
                <DeleteIcon className="size-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

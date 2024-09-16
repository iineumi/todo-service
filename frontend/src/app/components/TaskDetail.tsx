"use client";
import { Task } from "@/models/Task";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onDelete: (taskId: string) => void;
  onUpdate: (updatedTask: Task) => void;
}

export default function TaskDetail(props: TaskDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(props.task.title);
  const [editedDescription, setEditedDescription] = useState(
    props.task.description
  );
  const [editedDueDate, setEditedDueDate] = useState<Date | null>(
    props.task.dueDate?.Time || null
  );

  const handleSave = async () => {
    // タイトルが空の場合は保存しない
    if (!editedTitle) return;

    const updatedTask: Task = {
      ...props.task,
      title: editedTitle,
      description: editedDescription,
      dueDate: editedDueDate ? { Valid: true, Time: editedDueDate } : null,
    };

    try {
      await props.onUpdate(updatedTask);
      setIsEditing(false);
      if (updatedTask.description !== props.task.description) {
        props.onClose();
      }
    } catch (error) {
      console.error("タスクの更新中にエラーが発生しました。", error);
    }
  };

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
    <div className="fixed inset-0 flex items-center justify-center z-50 modal-container">
      <div
        className="modal-overlay absolute inset-0"
        onClick={props.onClose}
      ></div>

      <div className="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto modal-content">
        <div className="py-4 text-left px-6">
          {/* ヘッダー */}
          <div className="flex justify-between items-center pb-3">
            {isEditing ? (
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            ) : (
              <p className="text-2xl font-bold">{props.task.title}</p>
            )}
            <div
              className="modal-close cursor-pointer z-50"
              onClick={props.onClose}
            >
              <svg
                className="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>

          {/* 本文 */}
          {isEditing ? (
            <>
              <textarea
                className="w-full px-3 py-2 border rounded mb-2"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
              <DatePicker
                selected={editedDueDate}
                onChange={(date: Date | null) => setEditedDueDate(date)}
                className="w-full px-3 py-2 border rounded mb-4"
                dateFormat="yyyy/MM/dd"
              />
            </>
          ) : (
            <>
              <p className="mb-2">{props.task.description}</p>
              <p className="mb-2">
                期限: {editedDueDate ? formatDate(editedDueDate) : "未設定"}
              </p>
            </>
          )}

          {/* フッター */}
          <div className="flex justify-end pt-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                保存
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  編集
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded delete-button"
                >
                  削除
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

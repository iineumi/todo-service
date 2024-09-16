"use client";
import { Task } from "@/models/Task";
import { useState } from "react";
import DatePicker from "react-datepicker";

interface AddTaskFormProps {
  onAddTask: (newTask: Task) => void;
}
export default function AddTaskForm(props: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const handleAddTask = async () => {
    if (!title) return; // タスク名が入力されていない場合は処理を中断

    const dueDateForAPI = dueDate ? dueDate.toISOString() : "";

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description,
      dueDate: dueDateForAPI
        ? { Valid: true, Time: new Date(dueDateForAPI) }
        : null,
      completed: false,
      isArchived: false,
    };

    try {
      await props.onAddTask(newTask);
      setTitle("");
      setDescription("");
      setDueDate(null);
    } catch (error) {
      console.error("タスクの追加中にエラーが発生しました。", error);
    }
  };

  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const handleDateChange = (date: Date | null) => {
    setDueDate(date);
    setIsDatePickerOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* タスク名入力 */}
      <input
        type="text"
        placeholder="タスク名を入力"
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 説明入力 */}
      <textarea
        placeholder="説明を入力"
        className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex items-center justify-between">
        {/* 期限設定 */}
        <div className="relative">
          <button
            onClick={toggleDatePicker}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md mr-2 setting-button"
          >
            {dueDate ? dueDate.toLocaleDateString() : "期限を設定"}
          </button>
          {dueDate && (
            <button
              onClick={() => setDueDate(null)}
              className="absolute right-2 top-1 transform -translate-y-1/2 bg-gray-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
            >
              <span className="text-xs">×</span>
            </button>
          )}
          {isDatePickerOpen && (
            <div className="absolute z-10">
              <DatePicker
                selected={dueDate}
                onChange={handleDateChange}
                inline
                className="bg-white p-2 rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        {/* 追加ボタン */}
        <button className="primary-button" onClick={handleAddTask}>
          追加
        </button>
      </div>
    </div>
  );
}

import { Task } from "@/models/Task";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);

    const TasksApiPath = "/api/tasks"

    useEffect(() => {
        const fetchTasks = async () => {
            const res = await fetch(TasksApiPath);
            const data = await res.json();
            setTasks(data);
        };

        fetchTasks();
    }, []);

    const handleAddTask = async (newTask: Task): Promise<void> => {
        try {
            const response = await fetch(TasksApiPath, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTask),
            });

            if (response.ok) {
                const data = await response.json();
                setTasks([...tasks, data]);
            } else {
                console.error("タスクの追加に失敗しました。", response.status);
            }
        } catch (error) {
            console.error("タスクの追加中にエラーが発生しました。", error);
            buildSetError(setError, "タスクの追加中にエラーが発生しました。", error)
        }
    };

    const handleUpdateTask = async (updatedTask: Task): Promise<void> => {
        try {
            const response = await fetch(`${TasksApiPath}/${updatedTask.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTask),
            });

            if (response.ok) {
                console.log("タスクの更新に成功しました");
                const updatedData = await response.json();
                setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedData : t)));
            } else {
                console.error("タスクの更新に失敗しました。", response.status);
            }
        } catch (error) {
            console.error("タスクの更新中にエラーが発生しました。", error);
            buildSetError(setError, "タスクの追加中にエラーが発生しました。", error)
        }
    };

    const handleToggleComplete = async (taskId: string): Promise<void> => {
        try {
            const taskToUpdate = tasks.find((task) => task.id === taskId);
            if (!taskToUpdate) {
                console.error(`Task with ID ${taskId} not found.`);
                return;
            }

            const updatedTask = {
                ...taskToUpdate,
                completed: !taskToUpdate.completed,
            };

            await handleUpdateTask(updatedTask);
        } catch (error) {
            console.error("タスクの更新中にエラーが発生しました。", error);
            buildSetError(setError, "タスクの更新中にエラーが発生しました。", error)

        }
    };

    const handleDeleteTask = async (taskId: string): Promise<void> => {
        try {
            const taskToUpdate = tasks.find((task) => task.id === taskId);
            if (!taskToUpdate) {
                console.error(`Task with ID ${taskId} not found.`);
                return;
            }

            const updatedTask = {
                ...taskToUpdate,
                isArchived: !taskToUpdate.isArchived,
            };

            await handleUpdateTask(updatedTask);
        } catch (error) {
            console.error("タスクの削除中にエラーが発生しました。", error);
            buildSetError(setError, "タスクの削除中にエラーが発生しました。", error)
        }
    };

    return {
        tasks,
        error,
        handleAddTask,
        handleUpdateTask,
        handleToggleComplete,
        handleDeleteTask,
    };
};

function buildSetError(setError: Dispatch<SetStateAction<string | null>>, message: string, error: any) {
    const typedError = error as string
    return setError(typedError || message);
}

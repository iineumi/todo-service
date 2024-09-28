import { useEffect, useState } from "react";
import initialData from '../init.json';
import { Task } from "@/models/Task";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);

    // ローカルストレージからタスクを読み込む
    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            try {
                const parsedTasks: Task[] = JSON.parse(storedTasks);
                setTasks(parsedTasks);
            } catch (error) {
                console.error("localStorage からのデータ読み込みに失敗しました:", error);
                localStorage.removeItem('tasks');
                localStorage.setItem('tasks', JSON.stringify(initialData));
                setTasks(initialData);
            }
        } else {
            localStorage.setItem('tasks', JSON.stringify(initialData));
            setTasks(initialData);
            console.log("タスクの初期データがロードされました");
        }
    }, []);

    const handleAddTask = async (newTask: Task): Promise<void> => {
        try {
            newTask.completed = false;
            setTasks([...tasks, newTask]);
            localStorage.setItem('tasks', JSON.stringify([...tasks, newTask]));
        } catch (error) {
            const typedError = error as string
            setError(typedError || "タスクの追加中にエラーが発生しました。");
        }
    };

    const handleUpdateTask = async (updatedTask: Task): Promise<void> => {
        try {
            setTasks(prevTasks => {
                const updatedTasks = prevTasks.map(task =>
                    task.id === updatedTask.id ? updatedTask : task
                );
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                return updatedTasks;
            });
        } catch (error) {
            const typedError = error as string
            setError(typedError || "タスクの更新中にエラーが発生しました。");
        }
    };

    const handleToggleComplete = async (taskId: string): Promise<void> => {
        try {
            setTasks(prevTasks => {
                const updatedTasks = prevTasks.map(task => {
                    if (task.id === taskId) {
                        return { ...task, completed: !task.completed };
                    }
                    return task;
                });
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                return updatedTasks;
            });
        } catch (error) {
            const typedError = error as string
            setError(typedError || "タスクの更新中にエラーが発生しました。");
        }
    };

    const handleDeleteTask = async (taskId: string): Promise<void> => {
        try {
            setTasks((prevTasks) => {
                const updatedTasks = prevTasks.filter(task => task.id !== taskId);
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                return updatedTasks;
            });
        } catch (error) {
            const typedError = error as string
            setError(typedError || "タスクの削除中にエラーが発生しました。");
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

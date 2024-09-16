export interface Task {
    id: string,
    title: string,
    description: string,
    dueDate: {
        Valid: boolean;
        Time: Date | null
    } | null,
    completed: boolean,
    isArchived: boolean
}

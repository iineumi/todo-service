package repository

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/google/uuid"
	"github.com/iineumi/todo-service/backend/model"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// GetTasks gets all tasks from the database
func GetTasks(dbpool *pgxpool.Pool, logger *slog.Logger) ([]model.Task, error) {
	rows, err := dbpool.Query(context.Background(), "SELECT id, title, description, due_date, completed, is_archived, created_at, updated_at FROM tasks")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Data Formatting
	allTasks, err := buildTaskHierarchy(rows)
	if err != nil {
		return nil, err
	}

	// Stores formatted data
	var tasks []model.Task
	for _, task := range allTasks {
		tasks = append(tasks, task)
	}

	return tasks, nil
}

// GetTaskByID gets a task by ID from the database
func GetTaskByID(dbpool *pgxpool.Pool, taskID string, logger *slog.Logger) (*model.Task, error) {
	query := `
	SELECT id, title, description, due_date, completed, is_archived, created_at, updated_at 
	FROM tasks 
	WHERE id = $1
	`

	rows, err := dbpool.Query(context.Background(), query, taskID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Data Formatting
	allTasks, err := buildTaskHierarchy(rows)
	if err != nil {
		return nil, err
	}

	// Stores formatted data
	if task, ok := allTasks[taskID]; ok {
		return &task, nil
	}

	return nil, fmt.Errorf("task not found: %w", pgx.ErrNoRows)
}

// CreateTask creates a new task in the database
func CreateTask(tx pgx.Tx, task model.Task, logger *slog.Logger) error {
	// Insert the task
	_, err := tx.Exec(context.Background(),
		"INSERT INTO tasks (id, title, description, due_date) VALUES ($1, $2, $3, $4)",
		task.ID, task.Title, task.Description, task.DueDate,
	)
	if err != nil {
		return fmt.Errorf("failed to insert task: %w", err)
	}

	logger.Info("created task", "task", task)
	return nil
}

// UpdateTask updates an existing task in the database
func UpdateTask(tx pgx.Tx, taskID string, task model.Task, logger *slog.Logger) error {
	// Update process
	commandTag, err := tx.Exec(context.Background(),
		"UPDATE tasks SET title = $1, description = $2, due_date = $3, completed = $4, is_archived = $5 WHERE id = $6",
		task.Title, task.Description, task.DueDate, task.Completed, task.IsArchived, taskID,
	)
	if err != nil {
		return fmt.Errorf("failed to update task: %w", err)
	}

	// Returns an error if the number of rows updated is 0
	if commandTag.RowsAffected() == 0 {
		return fmt.Errorf("task not found: %w", pgx.ErrNoRows)
	}

	logger.Info("updated task", "taskID", taskID)
	return nil
}

// DeleteTask deletes a task from the database
func DeleteTask(tx pgx.Tx, taskID string, logger *slog.Logger) error {
	commandTag, err := tx.Exec(context.Background(), "DELETE FROM tasks WHERE id = $1", taskID)
	if err != nil {
		return fmt.Errorf("failed to delete task: %w", err)
	}

	// Returns an error if the number of rows updated is 0
	if commandTag.RowsAffected() == 0 {
		return fmt.Errorf("task not found: %w", pgx.ErrNoRows)
	}

	logger.Info("deleted task", "taskID", taskID)
	return nil
}

func buildTaskHierarchy(rows pgx.Rows) (map[string]model.Task, error) {
	allTasks := make(map[string]model.Task)

	for rows.Next() {
		var task model.Task
		var id uuid.UUID

		err := rows.Scan(&id, &task.Title, &task.Description, &task.DueDate, &task.Completed, &task.IsArchived, &task.CreatedAt, &task.UpdatedAt)
		if err != nil {
			return nil, err
		}

		task.ID = id.String()

		allTasks[task.ID] = task
	}

	return allTasks, nil
}

package service

import (
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/google/uuid"
	"github.com/iineumi/todo-service/backend/model"
	"github.com/iineumi/todo-service/backend/repository"
	"github.com/jackc/pgx/v5/pgxpool"
)

// GetTasks gets all tasks from the database
func GetTasks(dbpool *pgxpool.Pool, logger *slog.Logger) ([]model.Task, error) {
	return repository.GetTasks(dbpool, logger)
}

// GetTaskByID gets a task by ID from the database
func GetTaskByID(dbpool *pgxpool.Pool, taskID string, logger *slog.Logger) (*model.Task, error) {
	return repository.GetTaskByID(dbpool, taskID, logger)
}

// CreateTask creates a new task in the database
func CreateTask(dbpool *pgxpool.Pool, task model.Task, logger *slog.Logger) error {
	// Generate UUID
	task.ID = uuid.New().String()

	// Set timestamp
	now := time.Now()
	task.CreatedAt = now
	task.UpdatedAt = now

	tx, err := dbpool.Begin(context.Background())
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(context.Background())

	err = repository.CreateTask(tx, task, logger)

	if err := tx.Commit(context.Background()); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return err
}

// UpdateTask updates an existing task in the database
func UpdateTask(dbpool *pgxpool.Pool, taskID string, task model.Task, logger *slog.Logger) error {
	// Set timestamp
	now := time.Now()
	task.UpdatedAt = now

	tx, err := dbpool.Begin(context.Background())
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(context.Background())

	err = repository.UpdateTask(tx, taskID, task, logger)

	if err := tx.Commit(context.Background()); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return err
}

// DeleteTask deletes a task from the database
func DeleteTask(dbpool *pgxpool.Pool, taskID string, logger *slog.Logger) error {
	tx, err := dbpool.Begin(context.Background())
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(context.Background())

	err = repository.DeleteTask(tx, taskID, logger)

	if err := tx.Commit(context.Background()); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return err
}

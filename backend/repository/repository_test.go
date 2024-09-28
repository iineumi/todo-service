package repository

import (
	"context"
	"database/sql"
	"log/slog"
	"net/http"
	"os"
	"testing"
	"time"

	"github.com/iineumi/todo-service/backend/model"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetTasks(t *testing.T) {
	dbpool, _ := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	defer dbpool.Close()

	jsonHandler := slog.NewJSONHandler(os.Stdout, nil)
	logger := slog.New(jsonHandler)

	tasks, err := GetTasks(dbpool, logger)
	require.NoError(t, err)

	assert.GreaterOrEqual(t, len(tasks), 1)
}

func TestGetTaskByID(t *testing.T) {
	dbpool, _ := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	defer dbpool.Close()

	jsonHandler := slog.NewJSONHandler(os.Stdout, nil)
	logger := slog.New(jsonHandler)

	taskID := "0f04693f-fd65-4d7f-9082-12a1942d0c33"

	task, err := GetTaskByID(dbpool, taskID, logger)
	require.NoError(t, err)
	logger.Info("got task", "taskID", taskID)

	assert.Equal(t, taskID, task.ID)
}

func TestCreateTask(t *testing.T) {
	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	require.NoError(t, err)
	defer dbpool.Close()

	jsonHandler := slog.NewJSONHandler(os.Stdout, nil)
	logger := slog.New(jsonHandler)

	tests := []struct {
		name    string
		task    model.Task
		wantErr bool
	}{
		{
			name: "Success",
			task: model.Task{
				ID:          uuid.New().String(),
				Title:       "Test Task",
				Description: "This is a test task",
				DueDate:     sql.NullTime{Valid: false, Time: time.Now().AddDate(0, 0, 7)},
			},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tx, err := dbpool.Begin(context.Background())
			require.NoError(t, err)
			defer tx.Rollback(context.Background()) // Rollback after testing

			err = CreateTask(tx, tt.task, logger)
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				require.NoError(t, err)

				// Verify that the task exists in the database
				var createdTask model.Task
				err = tx.QueryRow(context.Background(),
					`SELECT id, title, description, due_date, completed, parent_id, required_time, actual_time
					FROM tasks
					WHERE id = $1`,
					tt.task.ID).Scan(
					&createdTask.ID,
					&createdTask.Title,
					&createdTask.Description,
					&createdTask.DueDate,
					&createdTask.Completed,
				)
				require.NoError(t, err)

				assert.Equal(t, tt.task.ID, createdTask.ID)
				assert.Equal(t, tt.task.Title, createdTask.Title)
				assert.Equal(t, tt.task.Description, createdTask.Description)
				// assert.Equal(t, tt.task.DueDate, createdTask.DueDate)
			}
		})
	}
}

func TestUpdateTask(t *testing.T) {
	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	require.NoError(t, err)
	defer dbpool.Close()

	jsonHandler := slog.NewJSONHandler(os.Stdout, nil)
	logger := slog.New(jsonHandler)

	existingTaskID := "0f04693f-fd65-4d7f-9082-12a1942d0c33" // Existing task ID

	tests := []struct {
		name           string
		taskID         string
		requestBody    model.Task
		expectedStatus int
		wantErr        bool
	}{
		{
			name:           "Success",
			taskID:         existingTaskID,
			requestBody:    model.Task{Title: "Updated Task Title", Description: "Updated Task Description"},
			expectedStatus: http.StatusOK,
			wantErr:        false,
		},
		{
			name:           "NotFound",
			taskID:         "00000000-0000-0000-0000-000000000000", // Task ID that does not exist
			requestBody:    model.Task{Title: "Updated Task Title", Description: "Updated Task Description"},
			expectedStatus: http.StatusNotFound,
			wantErr:        true,
		},
		{
			name:           "Success",
			taskID:         "539cbeec-f565-472c-ba70-e34c5947715a",
			requestBody:    model.Task{Title: "Updated Task Title", Description: "Updated Task Description"},
			expectedStatus: http.StatusOK,
			wantErr:        false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tx, err := dbpool.Begin(context.Background())
			if err != nil {
				t.Fatal(err)
			}
			defer tx.Rollback(context.Background()) // Rollback after testing

			err = UpdateTask(tx, tt.taskID, tt.requestBody, logger)
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				require.NoError(t, err)

				// Confirmation that the task has been updated
				var actualTask model.Task
				err = tx.QueryRow(context.Background(),
					`SELECT id, title, description, due_date, completed, parent_id, required_time, actual_time
					FROM tasks
					WHERE id = $1`,
					tt.taskID).Scan(
					&actualTask.ID,
					&actualTask.Title,
					&actualTask.Description,
					&actualTask.DueDate,
					&actualTask.Completed,
				)
				require.NoError(t, err)

				assert.Equal(t, tt.requestBody.Title, actualTask.Title)
				assert.Equal(t, tt.requestBody.Description, actualTask.Description)
			}
		})
	}
}

func TestDeleteTask(t *testing.T) {
	dbpool, _ := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	defer dbpool.Close()

	jsonHandler := slog.NewJSONHandler(os.Stdout, nil)
	logger := slog.New(jsonHandler)

	taskID := "0f04693f-fd65-4d7f-9082-12a1942d0c33"

	tests := []struct {
		name           string
		taskID         string
		expectedStatus int
		wantErr        bool
	}{
		{
			name:           "Success",
			taskID:         taskID,
			expectedStatus: http.StatusNoContent,
			wantErr:        false,
		},
		{
			name:           "NotFound",
			taskID:         uuid.New().String(), // Task ID that does not exist
			expectedStatus: http.StatusNotFound,
			wantErr:        true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tx, err := dbpool.Begin(context.Background())
			require.NoError(t, err)
			defer tx.Rollback(context.Background()) // Rollback after testing

			err = DeleteTask(tx, tt.taskID, logger)
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				require.NoError(t, err)

				// Confirmation that the task has been deleted
				var exists bool
				err = tx.QueryRow(context.Background(), "SELECT EXISTS (SELECT 1 FROM tasks WHERE id = $1)", taskID).Scan(&exists)
				if err != nil {
					t.Fatal(err)
				}
				assert.False(t, exists, "task should be deleted")
			}
		})
	}
}

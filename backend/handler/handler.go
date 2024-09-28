package handler

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/iineumi/todo-service/backend/model"
	"github.com/iineumi/todo-service/backend/service"
	"github.com/iineumi/todo-service/backend/util"
	"github.com/jackc/pgx/v5/pgxpool"
)

func HandleTasks(dbpool *pgxpool.Pool, logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		switch r.Method {
		case "GET":
			tasks, err := service.GetTasks(dbpool, logger)
			if err != nil {
				logger.Error("failed to get tasks", "error", err)
				util.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
				return
			}
			json.NewEncoder(w).Encode(tasks)

		case "POST":
			var task model.Task
			if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
				logger.Error("failed to decode task", "error", err)
				util.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
				return
			}

			// Validate task
			validate := validator.New()
			if err := validate.Struct(task); err != nil {
				logger.Error("validation error", "error", err)
				util.SendErrorResponse(w, http.StatusBadRequest, util.ValidationErrorsToString(err))
				return
			}

			// Create task
			if err := service.CreateTask(dbpool, task, logger); err != nil {
				logger.Error("failed to create task", "error", err)
				util.SendErrorResponse(w, http.StatusInternalServerError, "Failed to create task")
				return
			}

			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(task)

		default:
			http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
		}
	}
}

func HandleSingleTask(dbpool *pgxpool.Pool, logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		taskID := strings.TrimPrefix(r.URL.Path, "/tasks/")
		if taskID == "" {
			util.SendErrorResponse(w, http.StatusBadRequest, "Task ID is required")
			return
		}

		switch r.Method {
		case "GET":
			task, err := service.GetTaskByID(dbpool, taskID, logger)
			if err != nil {
				logger.Error("failed to get task", "error", err)
				util.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
				return
			}
			json.NewEncoder(w).Encode(task)

		case "PUT":
			var task model.Task
			if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
				logger.Error("failed to decode task", "error", err)
				util.SendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
				return
			}

			// Validate task
			validate := validator.New()
			if err := validate.Struct(task); err != nil {
				logger.Error("validation error", "error", err)
				util.SendErrorResponse(w, http.StatusBadRequest, util.ValidationErrorsToString(err))
				return
			}

			// Update task
			if err := service.UpdateTask(dbpool, taskID, task, logger); err != nil {
				logger.Error("failed to update task", "error", err)
				util.SendErrorResponse(w, http.StatusInternalServerError, "Failed to update task")
				return
			}

			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(task)

		case "DELETE":
			if err := service.DeleteTask(dbpool, taskID, logger); err != nil {
				logger.Error("failed to delete task", "error", err)
				util.SendErrorResponse(w, http.StatusInternalServerError, "Failed to delete task")
				return
			}
			w.WriteHeader(http.StatusNoContent)

		default:
			http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
		}
	}
}

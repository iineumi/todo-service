package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"

	"github.com/iineumi/todo-service/backend/handler"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	// logger
	jsonHandler := slog.NewJSONHandler(os.Stdout, nil)
	logger := slog.New(jsonHandler)

	// Database
	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		logger.Error("failed to connect to database", "error", err)
		os.Exit(1)
	}
	defer dbpool.Close()

	// Routing
	http.HandleFunc("/tasks", handler.HandleTasks(dbpool, logger))
	http.HandleFunc("/tasks/", handler.HandleSingleTask(dbpool, logger))

	// Running Server
	logger.Info("Server listening on port 8888")
	if err := http.ListenAndServe(":8888", nil); err != nil {
		logger.Error("failed to start server", "error", err)
	}
}

package model

import (
	"database/sql"
	"time"
)

type Task struct {
	ID          string       `json:"id"`
	Title       string       `json:"title" validate:"required,min=1,max=100"`
	Description string       `json:"description" validate:"omitempty,min=1,max=255"`
	DueDate     sql.NullTime `json:"dueDate"`
	Completed   bool         `json:"completed"`
	IsArchived  bool         `json:"isArchived"`
	CreatedAt   time.Time    `json:"createdAt"`
	UpdatedAt   time.Time    `json:"updatedAt"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

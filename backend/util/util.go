package util

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/iineumi/todo-service/backend/model"
)

func SendErrorResponse(w http.ResponseWriter, statusCode int, message string) {
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(model.ErrorResponse{Error: message})
}

func ValidationErrorsToString(err error) string {
	var ve validator.ValidationErrors
	if errors.As(err, &ve) {
		var errorStrings []string
		for _, fe := range ve {
			errorStrings = append(errorStrings, fmt.Sprintf("%s: %s", fe.Field(), fe.Tag()))
		}
		return strings.Join(errorStrings, ", ")
	}
	return "Validation error"
}

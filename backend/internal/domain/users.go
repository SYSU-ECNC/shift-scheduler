package domain

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID           uuid.UUID `json:"id"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"-"`
	FullName     string    `json:"fullName"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"createdAt"`
}

package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/domain"
)

func (repo *Repository) GetUserByUsername(ctx context.Context, username string) (*domain.User, error) {
	user := &domain.User{
		Username: username,
	}

	query := `
		SELECT id, username, password_hash, full_name, role, created_at
		FROM users
		WHERE username = $1
	`

	if err := repo.db.QueryRowContext(ctx, query, user.Username).Scan(
		&user.ID,
		&user.Username,
		&user.PasswordHash,
		&user.FullName,
		&user.Role,
		&user.CreatedAt,
	); err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return user, nil
}

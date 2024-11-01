package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/domain"
	"github.com/google/uuid"
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

func (repo *Repository) UpdateUser(ctx context.Context, user *domain.User) error {
	query := `
		UPDATE users
		SET password_hash = $1, full_name = $2, role = $3
		WHERE username = $4
	`

	res, err := repo.db.ExecContext(ctx, query, user.PasswordHash, user.FullName, user.Role, user.Username)
	if err != nil {
		return err
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rows != 1 {
		return ErrRecordNotFound
	}

	return nil
}

func (repo *Repository) GetAllUsers(ctx context.Context) ([]*domain.User, error) {
	query := `
		SELECT id, username, full_name, role, created_at 
		FROM users
	`

	users := make([]*domain.User, 0)
	rows, err := repo.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		user := new(domain.User)
		if err := rows.Scan(&user.ID, &user.Username, &user.FullName, &user.Role, &user.CreatedAt); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (repo *Repository) GetUserByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	user := new(domain.User)
	user.ID = id

	query := `
		SELECT username, full_name, role, created_at
		FROM users
		WHERE id = $1
	`

	if err := repo.db.QueryRowContext(ctx, query, user.ID).Scan(
		&user.Username,
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

func (repo *Repository) CreateUser(ctx context.Context, user *domain.User) error {
	query := `
		INSERT INTO users (username, password_hash, full_name, role)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at
	`

	if err := repo.db.QueryRowContext(ctx, query, user.Username, user.PasswordHash, user.FullName, user.Role).Scan(
		&user.ID,
		&user.CreatedAt,
	); err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return ErrRecordNotFound
		default:
			return err
		}
	}

	return nil
}

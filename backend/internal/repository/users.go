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

func (repo *Repository) GetAllUserID(ctx context.Context) ([]string, error) {
	query := `
		SELECT id FROM users
	`

	ids := make([]string, 0)
	rows, err := repo.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		ids = append(ids, id)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return ids, nil
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

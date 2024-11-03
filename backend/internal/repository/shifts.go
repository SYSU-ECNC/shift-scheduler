package repository

import (
	"context"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/domain"
)

func (repo *Repository) CreateShiftMeta(ctx context.Context, shiftMeta *domain.ShiftMeta) error {
	query := `
		INSERT INTO shifts_metas (name, shift_template_id, submission_start, submission_end, active_start, active_end)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at
	`

	if err := repo.db.QueryRowContext(
		ctx,
		query,
		shiftMeta.Name,
		shiftMeta.ShiftTemplateID,
		shiftMeta.SubmissionStart,
		shiftMeta.SubmissionEnd,
		shiftMeta.ActiveStart,
		shiftMeta.ActiveEnd,
	).Scan(&shiftMeta.ID, &shiftMeta.CreatedAt); err != nil {
		return err
	}

	return nil
}

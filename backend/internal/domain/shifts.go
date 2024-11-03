package domain

import "time"

type ShiftMeta struct {
	ID              string    `json:"id"`
	Name            string    `json:"name"`
	ShiftTemplateID string    `json:"shiftTemplateID"`
	SubmissionStart time.Time `json:"submissionStart"`
	SubmissionEnd   time.Time `json:"submissionEnd"`
	ActiveStart     time.Time `json:"activeStart"`
	ActiveEnd       time.Time `json:"activeEnd"`
	CreatedAt       time.Time `json:"createdAt"`
}

package controller

import (
	"net/http"
	"time"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/domain"
)

func (ctrl *Controller) createShift(w http.ResponseWriter, r *http.Request) {
	type request struct {
		Name            string `json:"name" validate:"required"`
		SubmissionStart string `json:"submissionStart" validate:"required"`
		SubmissionEnd   string `json:"submissionEnd" validate:"required"`
		ActiveStart     string `json:"activeStart" validate:"required"`
		ActiveEnd       string `json:"activeEnd" validate:"required"`
	}

	req := new(request)
	if err := ctrl.readJSON(r, req); err != nil {
		ctrl.badRequest(w, err)
		return
	}
	if err := ctrl.validate.Struct(req); err != nil {
		ctrl.badRequest(w, err)
		return
	}

	SubmissionStart, err := time.Parse(time.RFC3339, req.SubmissionStart)
	if err != nil {
		ctrl.badRequest(w, err)
		return
	}

	SubmissionEnd, err := time.Parse(time.RFC3339, req.SubmissionEnd)
	if err != nil {
		ctrl.badRequest(w, err)
		return
	}

	ActiveStart, err := time.Parse(time.RFC3339, req.ActiveStart)
	if err != nil {
		ctrl.badRequest(w, err)
		return
	}

	ActiveEnd, err := time.Parse(time.RFC3339, req.ActiveEnd)
	if err != nil {
		ctrl.badRequest(w, err)
		return
	}

	shiftMeta := &domain.ShiftMeta{
		Name:            req.Name,
		ShiftTemplateID: "6f13d136-19f7-436c-a473-c01371ade914", // 暂时不考虑模板功能，故这里采用硬编码
		SubmissionStart: SubmissionStart,
		SubmissionEnd:   SubmissionEnd,
		ActiveStart:     ActiveStart,
		ActiveEnd:       ActiveEnd,
	}
	if err := ctrl.repo.CreateShiftMeta(r.Context(), shiftMeta); err != nil {
		ctrl.internalServerError(w, err)
		return
	}

	ctrl.writeJSON(w, http.StatusCreated, shiftMeta)
}

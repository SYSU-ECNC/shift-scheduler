package controller

import (
	"errors"
	"net/http"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/repository"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

func (ctrl *Controller) getAllUserID(w http.ResponseWriter, r *http.Request) {
	ids, err := ctrl.repo.GetAllUserID(r.Context())
	if err != nil {
		ctrl.internalServerError(w, err)
		return
	}

	ctrl.writeJSON(w, http.StatusOK, ids)
}

func (ctrl *Controller) getUserByID(w http.ResponseWriter, r *http.Request) {
	IDParam := chi.URLParam(r, "ID")

	uuid, err := uuid.Parse(IDParam)
	if err != nil {
		ctrl.writeErrorJSON(w, http.StatusNotFound, errors.New("用户不存在"))
		return
	}

	user, err := ctrl.repo.GetUserByID(r.Context(), uuid)
	if err != nil {
		switch {
		case errors.Is(err, repository.ErrRecordNotFound):
			ctrl.writeErrorJSON(w, http.StatusNotFound, errors.New("用户不存在"))
		default:
			ctrl.internalServerError(w, err)
			return
		}
	}

	ctrl.writeJSON(w, http.StatusOK, user)
}

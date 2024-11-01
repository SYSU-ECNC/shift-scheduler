package controller

import (
	"errors"
	"net/http"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

func (ctrl *Controller) getRequesterInfo(w http.ResponseWriter, r *http.Request) {
	requester, err := ctrl.getRequesterFromCtx(r.Context())
	if err != nil {
		ctrl.internalServerError(w, err)
		return
	}

	ctrl.writeJSON(w, http.StatusOK, requester)
}

func (ctrl *Controller) changeRequesterPassword(w http.ResponseWriter, r *http.Request) {
	requester, err := ctrl.getRequesterFromCtx(r.Context())
	if err != nil {
		ctrl.internalServerError(w, err)
		return
	}

	type request struct {
		OldPassword string `json:"oldPassword"`
		NewPassword string `json:"newPassword"`
	}

	req := new(request)
	if err := ctrl.readJSON(r, req); err != nil {
		ctrl.badRequest(w, err)
		return
	}

	if req.OldPassword == "" {
		ctrl.badRequest(w, errors.New("旧密码为空"))
		return
	}
	if req.NewPassword == "" {
		ctrl.badRequest(w, errors.New("新密码为空"))
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(requester.PasswordHash), []byte(req.OldPassword)); err != nil {
		switch {
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
			ctrl.unauthorized(w, errors.New("旧密码错误"))
		default:
			ctrl.internalServerError(w, err)
		}
		return
	}

	newPasswordHashBytes, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		ctrl.internalServerError(w, err)
		return
	}

	requester.PasswordHash = string(newPasswordHashBytes)
	if err := ctrl.repo.UpdateUser(r.Context(), requester); err != nil {
		switch {
		case errors.Is(err, repository.ErrRecordNotFound):
			ctrl.notFound(w, errors.New("用户不存在"))
		default:
			ctrl.internalServerError(w, err)
		}
		return
	}

	ctrl.writeJSON(w, http.StatusNoContent, nil)
}

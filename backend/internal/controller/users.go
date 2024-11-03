package controller

import (
	"errors"
	"net/http"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/domain"
	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

func (ctrl *Controller) getAllUsers(w http.ResponseWriter, r *http.Request) {
	users, err := ctrl.repo.GetAllUsers(r.Context())
	if err != nil {
		ctrl.internalServerError(w, err)
		return
	}

	ctrl.writeJSON(w, http.StatusOK, users)
}

func (ctrl *Controller) getUserByID(w http.ResponseWriter, r *http.Request) {
	user, err := ctrl.getUserFromCtx(r.Context())
	if err != nil {
		ctrl.internalServerError(w, err)
		return
	}

	ctrl.writeJSON(w, http.StatusOK, user)
}

func (ctrl *Controller) createUser(w http.ResponseWriter, r *http.Request) {
	// 初始用户的密码直接硬编码为 ecncpassword
	type request struct {
		Username string `json:"username"`
		FullName string `json:"fullName"`
		Role     string `json:"role"`
	}

	req := new(request)
	if err := ctrl.readJSON(r, req); err != nil {
		ctrl.badRequest(w, err)
		return
	}

	if req.Username == "" {
		ctrl.badRequest(w, errors.New("用户名为空"))
		return
	}
	if req.FullName == "" {
		ctrl.badRequest(w, errors.New("姓名为空"))
		return
	}
	if req.Role == "" {
		ctrl.badRequest(w, errors.New("身份为空"))
		return
	}
	if req.Role != "普通助理" && req.Role != "资深助理" && req.Role != "黑心" {
		ctrl.badRequest(w, errors.New("身份非法"))
		return
	}

	passwordHashBytes, err := bcrypt.GenerateFromPassword([]byte("ecncpassword"), bcrypt.DefaultCost)
	if err != nil {
		ctrl.internalServerError(w, err)
		return
	}

	user := &domain.User{
		Username:     req.Username,
		FullName:     req.FullName,
		Role:         req.Role,
		PasswordHash: string(passwordHashBytes),
	}

	if err := ctrl.repo.CreateUser(r.Context(), user); err != nil {
		switch {
		case errors.Is(err, repository.ErrUsernameConflict):
			ctrl.writeErrorJSON(w, http.StatusConflict, err)
			return
		default:
			ctrl.writeErrorJSON(w, http.StatusInternalServerError, err)
			return
		}
	}

	ctrl.writeJSON(w, http.StatusCreated, user)
}

func (ctrl *Controller) updateUser(w http.ResponseWriter, r *http.Request) {
	user, err := ctrl.getUserFromCtx(r.Context())
	if err != nil {
		ctrl.writeErrorJSON(w, http.StatusInternalServerError, err)
		return
	}

	type request struct {
		Role              *string `json:"role" validate:"oneof=普通助理 资深助理 黑心"`
		NeedResetPassword *bool   `json:"needResetPassword"`
	}

	req := new(request)
	if err := ctrl.readJSON(r, req); err != nil {
		ctrl.writeErrorJSON(w, http.StatusBadRequest, err)
		return
	}

	if err := ctrl.validate.Struct(req); err != nil {
		ctrl.writeErrorJSON(w, http.StatusBadRequest, err)
		return
	}

	if req.Role != nil {
		user.Role = *req.Role
	}
	if req.NeedResetPassword != nil && *req.NeedResetPassword {
		passwordHashBytes, err := bcrypt.GenerateFromPassword([]byte("ecncpassword"), bcrypt.DefaultCost)
		if err != nil {
			ctrl.writeErrorJSON(w, http.StatusInternalServerError, err)
			return
		}
		user.PasswordHash = string(passwordHashBytes)
	}

	if err := ctrl.repo.UpdateUser(r.Context(), user); err != nil {
		ctrl.writeErrorJSON(w, http.StatusInternalServerError, err)
		return
	}

	ctrl.writeJSON(w, http.StatusOK, user)
}

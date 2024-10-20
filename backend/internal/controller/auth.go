package controller

import (
	"errors"
	"net/http"
	"time"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/domain"
	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func (ctrl *Controller) login(w http.ResponseWriter, r *http.Request) {
	type request struct {
		Username string `json:"username"`
		Password string `json:"password"`
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
	if req.Password == "" {
		ctrl.badRequest(w, errors.New("密码为空"))
		return
	}

	user, err := ctrl.repo.GetUserByUsername(r.Context(), req.Username)
	if err != nil {
		switch {
		case errors.Is(err, repository.ErrRecordNotFound):
			ctrl.notFound(w, errors.New("用户名不存在"))
		default:
			ctrl.internalServerError(w, err)
		}
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		switch {
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
			ctrl.unauthorized(w, errors.New("密码错误"))
		default:
			ctrl.internalServerError(w, err)
		}
		return
	}

	Expires := time.Now().Add(24 * time.Hour)
	claims := domain.CustomClaims{
		Role: user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   user.Username,
			ExpiresAt: jwt.NewNumericDate(Expires),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString([]byte(ctrl.cfg.JWTSecret))
	if err != nil {
		ctrl.internalServerError(w, err)
		return
	}

	cookie := &http.Cookie{
		Name:     "__shift_scheduler_jwt",
		Value:    ss,
		Path:     "/",
		Expires:  Expires,
		HttpOnly: true,
	}
	http.SetCookie(w, cookie)

	ctrl.ok(w, "登录成功", nil)
}

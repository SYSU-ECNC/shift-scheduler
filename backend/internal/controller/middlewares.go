package controller

import (
	"context"
	"errors"
	"net/http"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/domain"
	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/repository"
	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func (ctrl *Controller) getSubAndRoleFromJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("__shift_scheduler_jwt")
		if err != nil {
			switch {
			case errors.Is(err, http.ErrNoCookie):
				ctrl.unauthorized(w, errors.New("未登录"))
			default:
				ctrl.internalServerError(w, err)
			}
			return
		}

		token, err := jwt.ParseWithClaims(cookie.Value, &domain.CustomClaims{}, func(t *jwt.Token) (interface{}, error) {
			return []byte(ctrl.cfg.JWTSecret), nil
		})
		if err != nil {
			ctrl.unauthorized(w, errors.New("登录凭证无效"))
			return
		}
		claims, ok := token.Claims.(*domain.CustomClaims)
		if !ok {
			ctrl.unauthorized(w, errors.New("登录凭证无效"))
			return
		}

		ctx := r.Context()
		ctx = context.WithValue(ctx, subCtxKey, claims.Subject)
		ctx = context.WithValue(ctx, roleCtxKey, claims.Role)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (ctrl *Controller) getRequester(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sub, err := ctrl.getSubFromCtx(r.Context())
		if err != nil {
			ctrl.internalServerError(w, err)
			return
		}

		requester, err := ctrl.repo.GetUserByUsername(r.Context(), sub)
		if err != nil {
			switch {
			case errors.Is(err, repository.ErrRecordNotFound):
				ctrl.notFound(w, errors.New("用户名不存在"))
			default:
				ctrl.internalServerError(w, err)
			}
			return
		}

		ctx := r.Context()
		ctx = context.WithValue(ctx, requesterCtxKey, requester)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (ctrl *Controller) checkAdmin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requester, err := ctrl.getRequesterFromCtx(r.Context())
		if err != nil {
			ctrl.internalServerError(w, err)
			return
		}

		if requester.Role != "黑心" {
			ctrl.writeErrorJSON(w, http.StatusForbidden, errors.New("无权限"))
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (ctrl *Controller) getUserMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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
			}
			return
		}

		ctx := context.WithValue(r.Context(), userCtxKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

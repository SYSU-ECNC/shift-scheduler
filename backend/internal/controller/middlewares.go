package controller

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"time"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/domain"
	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/repository"
	"github.com/golang-jwt/jwt/v5"
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

func (ctrl *Controller) corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if ctrl.cfg.Environment == "development" {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (ctrl *Controller) loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		next.ServeHTTP(w, r)

		duration := time.Since(start)

		ctrl.logger.Info("HTTP request",
			slog.String("method", r.Method),
			slog.String("path", r.URL.Path),
			slog.Duration("duration", duration),
		)
	})
}

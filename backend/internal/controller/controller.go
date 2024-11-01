package controller

import (
	"errors"
	"log/slog"
	"net/http"
	"time"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/config"
	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/repository"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type Controller struct {
	cfg    *config.Config
	logger *slog.Logger
	repo   *repository.Repository

	Handler http.Handler
}

func NewController(cfg *config.Config, logger *slog.Logger, repo *repository.Repository) *Controller {
	return &Controller{cfg: cfg, logger: logger, repo: repo}
}

func (ctrl *Controller) SetupRoutes() {
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	var allowedOrigins []string
	if ctrl.cfg.Environment == "development" {
		allowedOrigins = []string{"http://localhost:5173"}
	} else {
		allowedOrigins = []string{}
	}

	r.Use(cors.Handler(cors.Options{
		AllowCredentials: true,
		AllowedHeaders:   []string{"Content-Type"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowedOrigins:   allowedOrigins,
	}))

	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		ctrl.writeErrorJSON(w, http.StatusNotFound, errors.New("路由不存在"))
	})
	r.MethodNotAllowed(func(w http.ResponseWriter, r *http.Request) {
		ctrl.writeErrorJSON(w, http.StatusMethodNotAllowed, errors.New("非法的请求方法"))
	})

	r.Route("/api/v1", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Post("/login", ctrl.login)
			r.Post("/logout", ctrl.logout)
		})
		r.Group(func(r chi.Router) {
			r.Use(ctrl.getSubAndRoleFromJWT)
			r.Use(ctrl.getRequester)
			r.Route("/me", func(r chi.Router) {
				r.Get("/", ctrl.getRequesterInfo)
				r.Patch("/password", ctrl.changeRequesterPassword)
			})

			r.Group(func(r chi.Router) {
				r.Use(ctrl.checkAdmin)
				r.Route("/users", func(r chi.Router) {
					r.Get("/ids", ctrl.getAllUserID)
					r.Get("/{ID}", ctrl.getUserByID)
				})
			})
		})
	})

	ctrl.Handler = r
}

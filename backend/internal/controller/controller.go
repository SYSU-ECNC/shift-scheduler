package controller

import (
	"log/slog"
	"net/http"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/config"
	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/repository"
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
	meMux := http.NewServeMux()
	meMux.HandleFunc("GET /info", ctrl.getRequesterInfo)
	meMux.HandleFunc("PATCH /info/password", ctrl.changeRequesterPassword)

	privateMux := http.NewServeMux()
	privateMux.Handle("/me/", http.StripPrefix("/me", ctrl.getRequester(meMux)))

	authMux := http.NewServeMux()
	authMux.HandleFunc("POST /login", ctrl.login)
	authMux.HandleFunc("POST /logout", ctrl.logout)

	v1Mux := http.NewServeMux()
	v1Mux.Handle("/auth/", http.StripPrefix("/auth", authMux))
	v1Mux.Handle("/private/", http.StripPrefix("/private", ctrl.getSubAndRoleFromJWT(privateMux)))

	mainMux := http.NewServeMux()
	mainMux.Handle("/api/v1/", http.StripPrefix("/api/v1", v1Mux))

	ctrl.Handler = ctrl.corsMiddleware(mainMux)
}

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
	ctrl.Handler = http.NewServeMux()
}

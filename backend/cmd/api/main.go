package main

import (
	"context"
	"database/sql"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/config"
	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/controller"
	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/repository"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func main() {
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	cfg := config.NewConfig(logger)
	cfg.LoadConfig()

	db, err := sql.Open("pgx", cfg.DatabaseURL)
	if err != nil {
		logger.Error("cannot open database", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	if err := db.PingContext(ctx); err != nil {
		logger.Error("cannot Ping database", "error", err)
		os.Exit(1)
	}
	defer cancel()
	logger.Info("connect database successfully")

	repo := repository.NewRepository(db)
	ctrl := controller.NewController(cfg, logger, repo)
	ctrl.SetupRoutes()
	srv := &http.Server{
		Addr:         ":8000",
		Handler:      ctrl.Handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  time.Minute,
		ErrorLog:     slog.NewLogLogger(logger.Handler(), slog.LevelError),
	}

	logger.Info("the server is listening", "PORT", "8000")
	if err := srv.ListenAndServe(); err != nil {
		logger.Error("failed to start the server", "error", err)
	}
}

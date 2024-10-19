package config

import (
	"log/slog"
	"os"
)

type Config struct {
	logger *slog.Logger

	DatabaseURL string
	JWTSecret   string
}

func NewConfig(logger *slog.Logger) *Config {
	return &Config{logger: logger}
}

func (cfg *Config) LoadConfig() {
	cfg.DatabaseURL = cfg.readStringEnv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/ecnc_sso_db?sslmode=disable")
	cfg.JWTSecret = cfg.readStringEnv("JWT_SECRET", "995076d89c85eec20e01b0911bc298e5")
}

func (cfg *Config) readStringEnv(key string, fallback string) string {
	value, ok := os.LookupEnv(key)
	if !ok {
		cfg.logger.Warn("the environment variable is empty, use fallback instead", "key", key, "fallback", fallback)
		return fallback
	}
	return value
}

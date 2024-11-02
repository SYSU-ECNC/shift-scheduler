package config

import (
	"os"
)

type Config struct {
	DatabaseURL string
	Environment string
	JWTSecret   string
}

func NewConfig() *Config {
	return &Config{}
}

func (cfg *Config) LoadConfig() {
	cfg.DatabaseURL = cfg.readStringEnv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/shift_scheduler_db?sslmode=disable")
	cfg.Environment = cfg.readStringEnv("ENVIRONMENT", "development")
	cfg.JWTSecret = cfg.readStringEnv("JWT_SECRET", "995076d89c85eec20e01b0911bc298e5")
}

func (cfg *Config) readStringEnv(key string, fallback string) string {
	value, ok := os.LookupEnv(key)
	if !ok {
		return fallback
	}
	return value
}

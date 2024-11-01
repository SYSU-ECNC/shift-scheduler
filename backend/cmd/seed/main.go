package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"os"
	"time"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/repository"
	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/utils"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func main() {
	action := flag.String("action", "", "action to perform")
	flag.Parse()

	dsn, ok := os.LookupEnv("DATABASE_URL")
	if !ok {
		dsn = "postgresql://postgres:password@localhost:5432/shift_scheduler_db?sslmode=disable"
	}

	db, err := sql.Open("pgx", dsn)
	if err != nil {
		fmt.Println("cannot open database")
		os.Exit(1)
	}
	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	if err := db.PingContext(ctx); err != nil {
		fmt.Println("cannot ping database")
		os.Exit(1)
	}
	defer cancel()

	repo := repository.NewRepository(db)

	switch *action {
	case "create_users":
		createUsers(repo)
	default:
		fmt.Printf("unknown action: %s\n", *action)
	}
}

func createUsers(repo *repository.Repository) {
	for i := 0; i < 50; i++ {
		user := utils.GenerateRandomUser()
		if err := repo.CreateUser(context.Background(), user); err != nil {
			fmt.Printf("failed to create user: %s, err: %v\n", user.Username, err)
		}
	}
	fmt.Println("users created successfully")
}

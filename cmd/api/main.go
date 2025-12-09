package main

import (
	"database/sql"
	"log"

	"github.com/govindti/echonet/internal/env"
	"github.com/govindti/echonet/internal/store"
)

func main() {
	
	// 1. Load variables first!
	// (Ensure you added the Load() function to your env package as discussed previously)
	env.Load()
	
	cfg := config{
		addr: env.GetString("ADDR", ":8080"),
		db: dbConfig{
			addr: env.GetString("DB_ADDR", "postgres://user:adminpassword@localhost/echonet?sslmode=disable"),
			maxOpenConns: env.GetInt("DB_MAX_OPEN_CONNS", 30),
			maxIdleConns: env.GetInt("DB_MAX_IDLE_CONNS", 30),
			maxIdleTime: env.GetString("DB_MAX_IDLE_TIME", "15min"),
		}
	}

	store := store.NewStorage(nil)
	
	app := &Application{
		config: cfg,
		store: store,
	}

	mux := app.mount()
	log.Fatal(app.run(mux))
}

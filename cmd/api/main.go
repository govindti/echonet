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
	}

	store := store.NewStorage(nil)
	
	app := &Application{
		config: cfg,
		store: store,
	}

	mux := app.mount()
	log.Fatal(app.run(mux))
}

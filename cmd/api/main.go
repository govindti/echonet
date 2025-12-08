package main

import (
	"log"

	"github.com/govindti/echonet/internal/env"
)

func main() {

	// 1. Load variables first!
	// (Ensure you added the Load() function to your env package as discussed previously)
	env.Load()

	cfg := config{
		addr: env.GetString("ADDR", ":8080"),
	}
	app := &Application{
		config: cfg,
	}

	mux := app.mount()
	log.Fatal(app.run(mux))
}

package main

import (
	"log"

	"github.com/govindti/echonet/internal/db"
	"github.com/govindti/echonet/internal/env"
	"github.com/govindti/echonet/internal/store"
)

func main() {
	addr := env.GetString("DB_ADDR", "postgres://admin:adminpassword@localhost/echonet?sslmode=disable")
	conn, err := db.New(addr, 3, 3, "15m")
	if err != nil {
		log.Fatal(err)
	}

	defer conn.Close()

	store := store.NewStorage(conn)

	db.Seed(store, conn)
}

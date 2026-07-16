//go:build !docs

package main

import "github.com/go-chi/chi/v5"

func (app *Application) mountDocs(r chi.Router) {}

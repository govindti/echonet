//go:build docs

package main

import (
	"fmt"

	"github.com/go-chi/chi/v5"
	"github.com/govindti/echonet/docs"
	httpSwagger "github.com/swaggo/http-swagger"
)

func (app *Application) mountDocs(r chi.Router) {
	docs.SwaggerInfo.Version = version
	docs.SwaggerInfo.Host = app.config.apiURL
	docs.SwaggerInfo.BasePath = "/api/v1"
	docsURL := fmt.Sprintf("http://%s/api/v1/docs/doc.json", app.config.apiURL)
	r.Get("/docs/*", httpSwagger.Handler(httpSwagger.URL(docsURL)))
}

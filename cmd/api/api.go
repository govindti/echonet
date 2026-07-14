package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"go.uber.org/zap"

	"github.com/govindti/echonet/docs" // this is req for generating swagger docs
	"github.com/govindti/echonet/internal/auth"
	"github.com/govindti/echonet/internal/mailer"
	"github.com/govindti/echonet/internal/ratelimiter"
	"github.com/govindti/echonet/internal/store"
	"github.com/govindti/echonet/internal/store/cache"
	httpSwagger "github.com/swaggo/http-swagger"
)

type Application struct {
	config        config
	store         store.Storage
	cacheStorage  cache.Storage
	logger        *zap.SugaredLogger
	mailer        mailer.Client
	authenticator auth.Authenticator
	rateLimiter   ratelimiter.Limiter
}

type config struct {
	addr               string
	db                 dbConfig
	env                string
	apiURL             string
	mail               mailConfig
	frontendUrl        string
	auth               authconfig
	redisCfg           redisConfig
	rateLimiterEnabled bool
}

type redisConfig struct {
	addr    string
	pw      string
	db      int
	enabled bool
}

type authconfig struct {
	basic basicConfig
	token tokenConfig
}
type tokenConfig struct {
	secret string
	exp    time.Duration
	iss    string
	aud    string
}

type basicConfig struct {
	user string
	pass string
}

type dbConfig struct {
	addr         string
	maxOpenConns int
	maxIdleConns int
	maxIdleTime  string
}

type mailConfig struct {
	sendGrid  sendGridConfig
	fromEmail string
	exp       time.Duration
}

type sendGridConfig struct {
	apiKey string
}

func (app *Application) mount() *chi.Mux {

	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(app.RateLimiterMiddleware)

	// Set a timeout value on the request context (ctx), that will signal
	// through ctx.Done() that the request has timed out and further
	// processing should be stopped.
	r.Use(middleware.Timeout(60 * time.Second))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hi"))
	})
	r.Route("/api", func(r chi.Router) {

		r.Route("/v1", func(r chi.Router) {
			r.Get("/health", app.healthCheckHandler)

			docsURL := fmt.Sprintf("http://%s/api/v1/docs/doc.json", app.config.apiURL)
			r.Get("/docs/*", httpSwagger.Handler(httpSwagger.URL(docsURL)))

			r.Route("/posts", func(r chi.Router) {
				r.Use(app.AuthTokenMiddleware)
				r.Post("/", app.createPostHandler)
				r.Route("/{postID}", func(r chi.Router) {
					r.Use(app.postsContextMiddleware)

					r.Get("/", app.getPostHandler)
					r.Delete("/", app.checkPostOwnership("admin", app.deletePostHandler))
					r.Patch("/", app.checkPostOwnership("moderator", app.updatePostHandler))
				})
			})
			r.Route("/users", func(r chi.Router) {
				r.Put("/activate/{token}", app.activateUserHandler)
				r.Group(func(r chi.Router) {
					r.Use(app.AuthTokenMiddleware)
					r.Get("/feed", app.getUserFeedHandler)
				})
				r.Route("/{userID}", func(r chi.Router) {
					r.Use(app.AuthTokenMiddleware)

					r.Get("/", app.getUserHandler)
					r.Put("/follow", app.followUserHandler)
					r.Put("/unfollow", app.unfollowUserHandler)
				})
			})

			// public routes
			r.Route("/authentication", func(r chi.Router) {
				r.Post("/user", app.registerUserHandler)
				r.Post("/token", app.createTokenHandler)
			})
		})
	})

	return r
}

func (app *Application) run(mux *chi.Mux) error {
	// Docs
	docs.SwaggerInfo.Version = version
	docs.SwaggerInfo.Host = app.config.apiURL
	docs.SwaggerInfo.BasePath = "/api/v1"

	// Implementation of the run method

	srv := &http.Server{
		Addr:         app.config.addr,
		Handler:      mux,
		WriteTimeout: time.Second * 30,
		ReadTimeout:  time.Second * 10,
		IdleTimeout:  time.Minute * 1,
	}

	shutdown := make(chan error)

	go func() {
		quit := make(chan os.Signal, 1)

		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		s := <-quit

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		app.logger.Infow("signal caught", "signal", s.String())

		shutdown <- srv.Shutdown(ctx)
	}()
	app.logger.Infow("Server has started ", "addr", app.config.addr, "env", app.config.env)

	err := srv.ListenAndServe()
	if !errors.Is(err, http.ErrServerClosed) {
		return err
	}

	err = <-shutdown
	if err != nil {
		return err
	}

	app.logger.Infow("server has stopped", "addr", app.config.addr, "env", "app.config.env")

	return nil
}

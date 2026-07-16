package main

import (
	"expvar"
	"runtime"
	"time"

	"github.com/govindti/echonet/internal/auth"
	"github.com/govindti/echonet/internal/db"
	"github.com/govindti/echonet/internal/env"
	"github.com/govindti/echonet/internal/mailer"
	"github.com/govindti/echonet/internal/ratelimiter"
	"github.com/govindti/echonet/internal/store"
	"github.com/govindti/echonet/internal/store/cache"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

const version = ""

//	@title			EchoNet API
//	@description	A Social Media API for Go Devs

//	@license.name	Apache 2.0
//	@license.url	http://www.apache.org/licenses/LICENSE-2.0.html

//	@BasePath					/api/v1
//	@securityDefinitions.apikey	ApiKeyAuth
//	@in							header
//	@name						Authorization
//	@description				Enter: Bearer {token}

func main() {

	// 1. Load variables first!
	// (Ensure you added the Load() function to your env package as discussed previously)
	env.Load()

	cfg := config{
		addr: env.GetString("ADDR", ":8080"),
		db: dbConfig{
			addr:         env.GetString("DB_ADDR", "postgres://admin:adminpassword@localhost/echonet?sslmode=disable"),
			maxOpenConns: env.GetInt("DB_MAX_OPEN_CONNS", 30),
			maxIdleConns: env.GetInt("DB_MAX_IDLE_CONNS", 30),
			maxIdleTime:  env.GetString("DB_MAX_IDLE_TIME", "15m"),
		},
		redisCfg: redisConfig{
			addr:    env.GetString("REDIS_ADDR", "localhost:6379"),
			pw:      env.GetString("REDIS_PW", ""),
			db:      env.GetInt("REDIS_DB", 0),
			enabled: env.GetBool("REDIS_ENABLED", false),
		},
		rateLimiterEnabled: env.GetBool("RATE_LIMITER_ENABLED", true),
		env:                env.GetString("ENV", "development"),
		apiURL:             env.GetString("EXTERNAL_URL", "localhost:4000"),
		frontendUrl:        env.GetString("FRONTEND_URL", "localhost:4000"),
		mail: mailConfig{
			exp:       time.Hour * 24 * 3, // 3 days
			fromEmail: env.GetString("SENDGRID_FROM_EMAIL", ""),
			sendGrid: sendGridConfig{
				apiKey: env.GetString("SENDGRID_API_KEY", ""),
			},
		},
		auth: authconfig{
			basic: basicConfig{
				user: env.GetString("AUTH_BASIC_USER", "admin"),
				pass: env.GetString("AUTH_BASIC_PASS", "admin"),
			},
			token: tokenConfig{
				secret: env.GetString("AUTH_TOKEN_SECRET", "example"),
				exp:    time.Hour * 24 * 7, // 7 days
				iss:    "echonet",
				aud:    "echonet",
			},
		},
	}

	// Logger
	logger := zap.Must(zap.NewProduction()).Sugar()
	defer logger.Sync()

	// Database

	db, err := db.New(
		cfg.db.addr,
		cfg.db.maxOpenConns,
		cfg.db.maxIdleConns,
		cfg.db.maxIdleTime,
	)
	if err != nil {
		logger.Fatal(err)
	}

	defer db.Close()
	logger.Info("DB connection pool established!")

	// redis
	var rdb *redis.Client
	if cfg.redisCfg.enabled {
		rdb = cache.NewRedisClient(cfg.redisCfg.addr, cfg.redisCfg.pw, cfg.redisCfg.db)
		logger.Info("redis cache connection established")
		defer rdb.Close()
	}

	// Rate limiter
	rateLimiter := ratelimiter.NewFixedWindowLimiter(
		env.GetInt("RATE_LIMIT_REQUESTS_PER_TIME_FRAME", 20),
		time.Second*5,
	)

	store := store.NewStorage(db)
	cacheStorage := cache.NewRedisStorage(rdb)
	mailer := mailer.NewSendgrid(cfg.mail.sendGrid.apiKey, cfg.mail.fromEmail)
	JWTAuthenticator := auth.NewJWTAuthenticator(cfg.auth.token.secret, cfg.auth.token.aud, cfg.auth.token.iss)

	app := &Application{
		config:        cfg,
		store:         store,
		cacheStorage:  cacheStorage,
		logger:        logger,
		mailer:        mailer,
		authenticator: JWTAuthenticator,
		rateLimiter:   rateLimiter,
	}

	// Metrics Collector
	expvar.NewString("version").Set(version)
	expvar.Publish("database", expvar.Func(func() any {
		return db.Stats()
	}))
	expvar.Publish("goroutines", expvar.Func(func() any {
		return runtime.NumGoroutine
	}))

	mux := app.mount()
	logger.Fatal(app.run(mux))
}

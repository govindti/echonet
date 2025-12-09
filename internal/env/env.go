package env

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Load reads the .env file and loads it into the system environment.
// Call this function once in your main.go.
func Load() {
	// You can pass specific filenames here, e.g., godotenv.Load(".env.local")
	// If empty, it defaults to ".env"
	err := godotenv.Load()
	if err != nil {
		// It is common to log this as info rather than fatal,
		// because in production you might use real env vars instead of a file.
		log.Println("Info: .env file not found, using system environment variables")
	}
}

func GetString(key, fallback string) string {
	val, ok := os.LookupEnv(key)
	if !ok {
		return fallback
	}
	return val
}

func GetInt(key string, fallback int) int {
	val, ok := os.LookupEnv(key)
	if !ok {
		return fallback
	}

	valAsInt, err := strconv.Atoi(val)
	if err != nil {
		return fallback
	}

	return valAsInt
}

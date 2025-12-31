package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	BitnobClientID     string
	BitnobClientSecret string
	BitnobAPIURL       string
	Port               string
	GinMode            string
}

var AppConfig *Config

func Load() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	AppConfig = &Config{
		BitnobClientID:     getEnv("BITNOB_CLIENT_ID", ""),
		BitnobClientSecret: getEnv("BITNOB_CLIENT_SECRET", ""),
		BitnobAPIURL:       getEnv("BITNOB_API_URL", "https://api.bitnob.co"),
		Port:               getEnv("PORT", "8080"),
		GinMode:            getEnv("GIN_MODE", "debug"),
	}

	if AppConfig.BitnobClientID == "" || AppConfig.BitnobClientSecret == "" {
		log.Fatal("BITNOB_CLIENT_ID and BITNOB_CLIENT_SECRET must be set")
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
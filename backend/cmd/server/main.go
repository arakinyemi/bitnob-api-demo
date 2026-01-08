package main

import (
	"log"

	"github.com/bitnob-api-demo/config"
	"github.com/bitnob-api-demo/internal/api"
	"github.com/bitnob-api-demo/internal/bitnob"
	"github.com/bitnob-api-demo/internal/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	config.Load()

	// Set Gin mode
	gin.SetMode(config.AppConfig.GinMode)

	// Initialize Bitnob client
	bitnobClient := bitnob.NewClient(
		config.AppConfig.BitnobAPIURL,
		config.AppConfig.BitnobClientID,
		config.AppConfig.BitnobClientSecret,
	)

	// Initialize handlers
	transferHandler := api.NewTransferHandler(bitnobClient)
	payoutHandler := api.NewPayoutHandler(bitnobClient)
	tradingHandler := api.NewTradingHandler(bitnobClient)

	// Setup router
	router := gin.Default()

	// Apply middleware
	router.Use(middleware.CORS())
	router.Use(middleware.Logger())
	router.Use(middleware.Recovery())

	// API routes
	api := router.Group("/api")
	{
		// Wallet routes
		wallets := api.Group("/wallets")
		{
			wallets.POST("/transfers", transferHandler.CreateTransfer)
		}

		// Payout routes
		payouts := api.Group("/payouts")
		{
			payouts.POST("/quotes", payoutHandler.CreateQuote)
			payouts.POST("/initialize", payoutHandler.InitializePayout)
			payouts.POST("/finalize", payoutHandler.FinalizePayout)
			payouts.GET("/countries/:country/requirements", payoutHandler.GetCountryRequirements)
			payouts.GET("/limits", payoutHandler.GetTransactionLimits)
		}

		// Trading routes
		trading := api.Group("/trading")
		{
			trading.POST("/quotes", tradingHandler.CreateQuote)
			trading.POST("/orders", tradingHandler.CreateOrder)
			trading.GET("/orders", tradingHandler.GetOrders)
			trading.GET("/orders/:id", tradingHandler.GetOrderByID)
		}
	}

	// Start server
	log.Printf("Starting server on port %s", config.AppConfig.Port)
	if err := router.Run(":" + config.AppConfig.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

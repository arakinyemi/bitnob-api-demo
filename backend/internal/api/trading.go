package api

import (
	"net/http"

	"github.com/bitnob-api-demo/internal/models"
	"github.com/gin-gonic/gin"
)

type TradingHandler struct {
	bitnobClient BitnobClient
}

func NewTradingHandler(client BitnobClient) *TradingHandler {
	return &TradingHandler{
		bitnobClient: client,
	}
}

func (h *TradingHandler) CreateQuote(c *gin.Context) {
	var req models.CreateQuoteRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	response, err := h.bitnobClient.CreateTradingQuote(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create trading quote",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

func (h *TradingHandler) CreateOrder(c *gin.Context) {
	var req models.CreateOrderRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	response, err := h.bitnobClient.CreateOrder(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create order",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

func (h *TradingHandler) GetOrders(c *gin.Context) {
	response, err := h.bitnobClient.GetOrders()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to get orders",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

func (h *TradingHandler) GetOrderByID(c *gin.Context) {
	id := c.Param("id")
	
	response, err := h.bitnobClient.GetOrderByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to get order",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

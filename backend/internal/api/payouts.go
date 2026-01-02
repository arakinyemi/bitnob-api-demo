package api

import (
	"net/http"

	"github.com/bitnob-api-demo/internal/models"
	"github.com/gin-gonic/gin"
)

type PayoutHandler struct {
	bitnobClient BitnobClient
}

func NewPayoutHandler(client BitnobClient) *PayoutHandler {
	return &PayoutHandler{
		bitnobClient: client,
	}
}

func (h *PayoutHandler) CreateQuote(c *gin.Context) {
	var req models.PayoutQuoteRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	response, err := h.bitnobClient.CreatePayoutQuote(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create payout quote",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    response,
	})
}

func (h *PayoutHandler) InitializePayout(c *gin.Context) {
	var req models.InitializePayoutRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	response, err := h.bitnobClient.InitializePayout(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to initialize payout",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    response,
	})
}

func (h *PayoutHandler) FinalizePayout(c *gin.Context) {
	var req models.FinalizePayoutRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	response, err := h.bitnobClient.FinalizePayout(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to finalize payout",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    response,
	})
}

func (h *PayoutHandler) GetCountryRequirements(c *gin.Context) {
	country := c.Param("country")

	response, err := h.bitnobClient.GetCountryRequirements(country)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to get country requirements",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    response,
	})
}

func (h *PayoutHandler) GetTransactionLimits(c *gin.Context) {
	response, err := h.bitnobClient.GetTransactionLimits()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to get transaction limits",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    response,
	})
}

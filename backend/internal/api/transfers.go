package api

import (
	"net/http"

	"github.com/bitnob-api-demo/internal/models"
	"github.com/gin-gonic/gin"
)

type TransferHandler struct {
	bitnobClient BitnobClient
}

func NewTransferHandler(client BitnobClient) *TransferHandler {
	return &TransferHandler{
		bitnobClient: client,
	}
}

func (h *TransferHandler) CreateTransfer(c *gin.Context) {
	var req models.TransferRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	response, err := h.bitnobClient.CreateTransfer(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create transfer",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

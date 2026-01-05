package api

import (
	"fmt"
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
		fmt.Printf("JSON binding error: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	fmt.Printf("Transfer request received: %+v\n", req)

	response, err := h.bitnobClient.CreateTransfer(req)
	if err != nil {
		fmt.Printf("Transfer error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create transfer",
			"details": map[string]interface{}{
				"error_message": err.Error(),
				"request_data":  req,
			},
		})
		return
	}

	fmt.Printf("Transfer response: %+v\n", response)
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    response,
	})
}
